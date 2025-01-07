import get from 'lodash/get';
import maxBy from 'lodash/maxBy';

import { getUnitDisplay, convertValue } from '~/utils/convert';
import { getAppStorage } from '~/clients/jsonApi';

import {
  METRICS_KEYS,
  DRILLSTRING_KEYS,
  BHA_FAMILY,
  MOTOR_CONFIG,
  PERCENTILE_KEYS,
  NON_MAGNETIC_TYPE,
  COLLECTIONS,
  MAX_DEPTH_LIMIT,
  MAX_INC_LIMIT,
} from '~/constants/bha';

const PDM_COUNT_UNIT = 2;
const OTHER_COUNT_UNIT = 1;
const ALL_COMPANY_ID = -1;

const isNotAllCompany = companyId => companyId && companyId !== ALL_COMPANY_ID;

export const getBHAInformation = (assetId, bhaId, drillStringData) => {
  const dataInDrillString = drillStringData.filter(
    item => item.asset_id === assetId && item.data?.id === bhaId
  );

  if (dataInDrillString.length > 0) {
    return dataInDrillString[0];
  }
  return [];
};

/**
 * Drillstring/BHA bit size calculator
 * @param  {array} components - list of components
 * @return {number}           - bit size
 */
export const getBhaBitSize = (components = []) => {
  const fieldName = 'shortLength';
  const bitSize = components.find(c => c.family === 'bit')?.size;

  const roundedBitSize = bitSize ? `${Math.round(bitSize * 1000) / 1000}` : bitSize;

  const adjustedBitSize = convertValue(roundedBitSize, fieldName, 'in') || '-';
  const bitSizeUnit = getUnitDisplay(fieldName);

  return `${adjustedBitSize} ${bitSizeUnit}`;
};

export const getBhaDepthIn = startDepth => {
  const adjustedDepth = Number.isFinite(startDepth)
    ? convertValue(startDepth, 'length', 'ft', null, 3)
    : 0;
  return `${adjustedDepth} ${getUnitDisplay('length')}`;
};

// IMPORTANT: Added company_id
const updateQuery = (query, item, selectedSectionNames, companyId) => {
  let updatedQuery = query;

  if (isNotAllCompany(companyId)) {
    updatedQuery = {
      company_id: companyId,
      ...updatedQuery,
    };
  } else if (item?.company_id) {
    updatedQuery = {
      company_id: item.company_id,
      ...updatedQuery,
    };
  }

  if (selectedSectionNames) {
    updatedQuery['data.well_sections'] = { $in: selectedSectionNames };
  }

  return updatedQuery;
};

// NOTE: Load data from drillstring collection for list view
export const loadDrillStringData = async (curBHAandWellIds, companyId) => {
  // NOTE: Produce the query
  const queryCombined = curBHAandWellIds.map(item => {
    const assetId = Number(item._id); // eslint-disable-line no-underscore-dangle
    const bhaIds = item.bha_ids || [];

    const query = {
      asset_id: assetId,
      'data.id': { $in: bhaIds },
    };

    return updateQuery(query, item, null, companyId);
  });

  if (!queryCombined.length) return [];

  const $match = queryCombined.length > 1 ? { $or: queryCombined } : queryCombined[0];
  const $limit = 10000;

  const queryJson = {
    aggregate: JSON.stringify([{ $match }, { $limit }]),
  };

  let drillStringData = [];
  try {
    drillStringData = await getAppStorage(
      COLLECTIONS.drillstring.provider,
      COLLECTIONS.drillstring.collection,
      null,
      queryJson
    );
  } catch (e) {
    drillStringData = [];
  }

  return drillStringData;
};

const calculateBHAComponentDetails = components => {
  const bhaFamilyValues = Object.values(BHA_FAMILY);
  let passed = false;

  const distList = components.reduce((result, item) => {
    const { family, material } = item;

    if (passed || bhaFamilyValues.includes(family) || material === NON_MAGNETIC_TYPE) {
      passed = true;

      if (bhaFamilyValues.includes(family)) {
        const categoryInfo = {
          family,
          bitType: family === BHA_FAMILY.bit ? item.bit_type : '',
        };

        result.push(categoryInfo);

        return result;
      }

      const otherInfo = {
        family: 'other',
        bitType: '',
      };

      if (!result.length || result[result.length - 1].family !== 'other') result.push(otherInfo);

      return result;
    }

    return result;
  }, []);

  return distList;
};

export const calculateBHALengthMax = drillStringData => {
  if (!drillStringData.length) {
    return 0;
  }

  // NOTE: BHA = bit + pdm + stabilizer (in this app)
  const maxRecord = maxBy(drillStringData, drillstringRecord => {
    const components = drillstringRecord.data?.components;

    const componentDetails = calculateBHAComponentDetails(components);

    return componentDetails.reduce((result, record) => {
      const { family } = record;
      if (family === BHA_FAMILY.rss || family === BHA_FAMILY.pdm) {
        return result + PDM_COUNT_UNIT;
      } else if (!Object.values(BHA_FAMILY).includes(family)) {
        return result + OTHER_COUNT_UNIT;
      }
      return result;
    }, 0);
  });

  // NOTE: Calculate the length
  const maxLengthComponent = maxRecord.data?.components;
  const maxLength = calculateBHAComponentDetails(maxLengthComponent).reduce((result, record) => {
    const { family } = record;
    if (family === BHA_FAMILY.rss || family === BHA_FAMILY.pdm) {
      return result + PDM_COUNT_UNIT;
    } else if (!Object.values(BHA_FAMILY).includes(family)) {
      return result + OTHER_COUNT_UNIT;
    }
    return result;
  }, 0);
  return maxLength;
};

// NOTE: Remove unnecessary 0
export const removeZero = (value, decimals) => {
  return parseFloat(parseFloat(value).toFixed(decimals)).toString();
};

export const getUnitConvertedValue = (value, key) => {
  let convertedValue;

  switch (key) {
    case PERCENTILE_KEYS.ropRotary:
    case PERCENTILE_KEYS.ropSlide:
    case METRICS_KEYS.netROP:
    case METRICS_KEYS.ropRotary:
    case METRICS_KEYS.ropSlide:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'velocity', 'ft/h'))
        : value;
      break;
    case METRICS_KEYS.distance:
    case METRICS_KEYS.holeDepth:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'length', 'ft'))
        : value;
      break;
    case DRILLSTRING_KEYS.bitToBend:
    case DRILLSTRING_KEYS.hwdpLength:
    case METRICS_KEYS.rotaryFootage:
    case METRICS_KEYS.slideFootage:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? parseFloat(convertValue(value, 'length', 'ft')).fixFloat(2)
        : value;
      break;
    case METRICS_KEYS.turnRate:
    case METRICS_KEYS.buildRate:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? parseFloat(convertValue(value, 'anglePerLength', 'dp100f')).toFixed(2)
        : value;
      break;
    case METRICS_KEYS.onBottomTime:
    case METRICS_KEYS.totalTime:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? parseFloat(value).toFixed(2)
        : value;
      break;
    case PERCENTILE_KEYS.mse:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'msePressure', 'psi'))
        : value;
      break;
    case PERCENTILE_KEYS.wob:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'force', 'klbf'))
        : value;
      break;
    case PERCENTILE_KEYS.diffPressure:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'pressure', 'psi'))
        : value;
      break;
    case PERCENTILE_KEYS.flowIn:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? Math.floor(convertValue(value, 'volumeFlowRate', 'gal/min'))
        : value;
      break;
    case DRILLSTRING_KEYS.tfa:
      convertedValue = !Number.isNaN(parseFloat(value)) ? parseFloat(value).fixFloat(2) : value;
      break;
    case DRILLSTRING_KEYS.holeSize:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? removeZero(convertValue(value, 'shortLength', 'in'), 3)
        : value;
      break;
    case DRILLSTRING_KEYS.motorSize:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? removeZero(convertValue(value, 'shortLength', 'in'), 2)
        : value;
      break;
    case MOTOR_CONFIG.outer_diameter:
      convertedValue = !Number.isNaN(Number.parseFloat(value))
        ? removeZero(convertValue(value, 'shortLength', 'in'), 1)
        : value;
      break;
    case DRILLSTRING_KEYS.motorBend:
      convertedValue = !Number.isNaN(Number.parseFloat(value)) ? removeZero(value, 2) : value;
      break;
    default:
      convertedValue = !Number.isNaN(Number.parseFloat(value)) ? Math.floor(value) : value;
  }
  return convertedValue;
};

// NOTE: Get error text when inputted value exceeds max limit
const getLimitErrorText = incOrDepth => {
  const maxLimit =
    incOrDepth === 'inc'
      ? MAX_INC_LIMIT
      : parseInt(convertValue(MAX_DEPTH_LIMIT, 'length', 'ft'), 10);

  return `Must be within 0 ~ ${maxLimit}`;
};

export const getErrors = (minValue, maxValue, incOrDepth) => {
  const maxLimit =
    incOrDepth === 'inc'
      ? MAX_INC_LIMIT
      : parseInt(convertValue(MAX_DEPTH_LIMIT, 'length', 'ft'), 10);

  const [errorTextForMin, errorTextForMax] = [minValue, maxValue].reduce((result, value) => {
    let errorText;
    if (Number.isFinite(value)) {
      errorText = maxLimit >= value ? null : getLimitErrorText(incOrDepth);
    } else {
      errorText = 'Invalid value';
    }
    return result.concat([errorText]);
  }, []);

  if (Number.isFinite(minValue) && Number.isFinite(maxValue) && minValue >= maxValue) {
    return ['Should be less than max value', 'Should be greater than min value'];
  }

  return [errorTextForMin, errorTextForMax];
};

export const getBHASchematic = components => {
  const schematic = [];

  components.forEach(component => {
    const { family, material, stabilizer } = component;
    if (['bit', 'pdm', 'rss', 'stabilizer', 'ur'].includes(family)) {
      schematic.push({
        family,
        hasStabilizer: !!stabilizer,
        bitType: get(component, 'bit_type'),
      });
    } else if (
      material === 'Non Magnetic' &&
      (schematic.length === 0 || schematic.slice(-1)[0].material !== material)
    ) {
      schematic.push({
        family: 'other',
        material,
      });
    }
  });

  return schematic;
};
