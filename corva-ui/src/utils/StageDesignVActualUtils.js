import { convertValue } from '~/utils/convert';
import {
  FLUIDS_TYPES,
  CHEMICALS_TYPES,
  PROPPANTS_TYPES,
  STAGE_ACTUAL_PARAM_COLORS,
} from '~/constants/completion';

const TEN_PERCENT = 10; // NOTE: 10 percent

export const getAggreElems = (stageElems, summaryElems) =>
  stageElems.reduce((agg, elem) => {
    const { type } = elem;
    const amount = elem.amount ? parseFloat(elem.amount) : 0;
    const aggAmount = agg[type] ? agg[type].amount + amount : amount;
    return {
      ...agg,
      [type]: {
        amount: aggAmount,
        unit_type: elem.unit_type,
        unit: elem.unit,
      },
    };
  }, summaryElems);

export const getDifference = (designValue, actualValue) => {
  if (!Number.isFinite(designValue) || !designValue) {
    return '-';
  }

  if (!Number.isFinite(actualValue)) {
    return 0;
  }

  return Math.round((actualValue / designValue) * 1000) / 10;
};

export const getElemActualColor = (category, elemKey) => {
  let categoryTypes;
  if (category === 'proppants') {
    categoryTypes = PROPPANTS_TYPES;
  } else if (category === 'fluids') {
    categoryTypes = FLUIDS_TYPES;
  } else if (category === 'volumeChemicals' || category === 'massChemicals') {
    categoryTypes = CHEMICALS_TYPES;
  }

  if (categoryTypes) {
    const targetElem = categoryTypes.find(elem => elem.name === elemKey);
    return targetElem && targetElem.color;
  }

  return STAGE_ACTUAL_PARAM_COLORS[category];
};

export const getStageSummary = (summary, stage) => {
  const stageData = stage.data || {};
  const fluids = stageData.fluids || [];
  const chemicals = stageData.chemicals || [];
  const proppants = stageData.proppants || [];

  const topPerforation = convertValue(
    Math.min(stageData.top_perforation, summary.top_perforation),
    'length',
    'ft'
  );
  const bottomPerforation = convertValue(
    Math.max(stageData.bottom_perforation, summary.bottom_perforation),
    'length',
    'ft'
  );
  const perforatedLength = convertValue(
    summary.perforated_length + stageData.perforated_length,
    'length',
    'ft'
  );
  const flushVolume = convertValue(summary.flush_volume + stageData.flush_volume, 'oil', 'bbl');
  const totalShots = summary.total_shots + stageData.total_shots;

  return {
    top_perforation: topPerforation,
    bottom_perforation: bottomPerforation,
    perforated_length: perforatedLength,
    total_shots: totalShots,
    flush_volume: flushVolume,
    chemicals: getAggreElems(chemicals, summary.chemicals),
    proppants: getAggreElems(proppants, summary.proppants),
    fluids: getAggreElems(fluids, summary.fluids),
  };
};

export const getFormattedValue = value => {
  let formattedValue;
  if (Number.isFinite(value)) {
    formattedValue =
      Math.floor(value) === value ? value.formatNumeral('0,0') : value.formatNumeral('0,0.0');
  } else {
    formattedValue = '';
  }

  return formattedValue;
};

export const getIsGreaterThanTenPercent = difference => {
  if (!Number.isFinite(difference)) {
    return true;
  }

  return Math.abs(difference - 100) >= TEN_PERCENT;
};
