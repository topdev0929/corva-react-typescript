import isNumber from 'lodash/isNumber';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';

import moment from 'moment';

import { convertValue, getUnitPreference } from './convert';

const DEFAULT_PRECISION = 5;

export const isValueEmpty = val => val !== 0 && !val;

export const isValueValid = (val, min, max, emptyAllowed) => {
  if (isValueEmpty(val)) {
    if (emptyAllowed) {
      return true;
    }
    return false;
  }
  return isNumber(val) && val > min && val < max;
};

export const ctop = (val, unitType, fromUnit) => {
  if (!isNumber(val)) {
    return null;
  }
  return unitType && fromUnit ? convertValue(val, unitType, fromUnit) : parseFloat(val);
};

export const ctoi = (val, unitType, toUnit, precision = DEFAULT_PRECISION) => {
  if (!isNumber(val)) {
    return null;
  }
  return unitType && toUnit
    ? convertValue(val, unitType, getUnitPreference(unitType), toUnit, precision)
    : parseFloat(val);
};

export const convertToPrefUnit = (record, mudProperties = []) => {
  const mudDensity = ctop(get(record, ['data', 'mud_density']), 'density', 'ppg');
  const depth = ctop(get(record, ['data', 'depth']), 'length', 'ft');
  const tvd = ctop(get(record, ['data', 'tvd']), 'length', 'ft');

  let convertedRecord = {
    ...record,
    data: {
      ...record.data,
      mud_density: mudDensity,
      depth,
      tvd,
    },
  };

  convertedRecord = mudProperties.reduce((result, mudProperty) => {
    const path = ['data', ...mudProperty.key.split('.')];
    if (!has(record, path)) return result;

    const convertedProperty = ctop(get(record, path), mudProperty.unitType, mudProperty.unit);

    return set(result, path, convertedProperty);
  }, convertedRecord);

  return convertedRecord;
};

export const convertToImperialUnit = (record, mudProperties = []) => {
  let newRecord = record;
  const dateStr = get(record, ['data', 'date_str']);
  if (dateStr) {
    const objDate = moment(new Date(dateStr));
    if (objDate.isValid()) {
      newRecord = set(newRecord, ['data', 'date'], objDate.unix());
    }
  }

  const mudDensity = ctoi(get(record, ['data', 'mud_density']), 'density', 'ppg');
  const depth = ctoi(get(record, ['data', 'depth']), 'length', 'ft');
  const tvd = ctoi(get(record, ['data', 'tvd']), 'length', 'ft');

  let convertedRecord = {
    ...newRecord,
    data: {
      ...newRecord.data,
      mud_density: mudDensity,
      depth,
      tvd,
      date_str: null,
    },
  };

  convertedRecord = mudProperties.reduce((result, mudProperty) => {
    const path = ['data', ...mudProperty.key.split('.')];
    if (!has(record, path)) return result;

    const convertedProperty = ctoi(get(record, path), mudProperty.unitType, mudProperty.unit);

    return set(result, path, convertedProperty);
  }, convertedRecord);

  return convertedRecord;
};

export const validate = record => {
  const {
    date_str: dateStr,
    mud_density: mudDensity,
    viscosity: { pv, yp, rpm_readings: rpmReadings },
  } = record.data;

  let hasErrors = false;
  const errors = {
    viscosity: {
      rpm_readings: [],
    },
  };

  if (dateStr && !moment(new Date(dateStr)).isValid()) {
    hasErrors = true;
    errors.date = 'Invalid Date.';
  }

  const lowerMudDensity = ctop(5, 'density', 'ppg');
  const upperMudDensity = ctop(20, 'density', 'ppg');
  if (!isValueValid(mudDensity, lowerMudDensity, upperMudDensity, false)) {
    hasErrors = true;
    errors.mud_density = `It should be ${lowerMudDensity} ~ ${upperMudDensity}`;
  }

  if ((isValueEmpty(pv) || isValueEmpty(yp)) && rpmReadings.length < 2) {
    hasErrors = true;
    errors.viscosity.rpm_readings_required = 'At least 2 paris of rpm and dial_reading required.';
  }

  if (!isValueValid(pv, 0, 200, !errors.viscosity.rpm_readings_required)) {
    hasErrors = true;
    errors['viscosity.pv'] = 'It should be 0~200';
  }

  if (!isValueValid(yp, 0, 200, !errors.viscosity.rpm_readings_required)) {
    hasErrors = true;
    errors['viscosity.yp'] = 'It should be 0~200';
  }

  const existingRPMs = [];
  for (let i = 0; i < rpmReadings.length; i += 1) {
    errors.viscosity.rpm_readings[i] = {};
    const rpmReadingsError = errors.viscosity.rpm_readings[i];
    if (!isValueValid(rpmReadings[i].rpm, 0, 1000)) {
      hasErrors = true;
      rpmReadingsError.rpm = 'It should be 0~1000';
    }
    if (!isValueValid(rpmReadings[i].dial_reading, 0, 300)) {
      hasErrors = true;
      rpmReadingsError.dial_reading = 'It should be 0~300';
    }

    // Note: Validation for duplicated RPMs
    if (existingRPMs.indexOf(rpmReadings[i].rpm) !== -1) {
      hasErrors = true;
      rpmReadingsError.rpm = 'Duplicated RPM value';
    }

    existingRPMs.push(rpmReadings[i].rpm);

    // NOTE: Saving index for next validation for Dial Readings order
    rpmReadings[i].originalIndex = i;
  }

  // NOTE: Validation to make sure that Dial Readings validation in order. Steps:
  // 1) sort the pairs by RPM in ascending order;
  // 2) check if the Dial Readings are in increasing order as well it is valid;
  // 3) if previous Dial Reading is equal to the current one, it is still fine

  const sortedReadingsByRpm = rpmReadings.sort((a, b) => a.rpm - b.rpm);
  sortedReadingsByRpm.forEach((reading, i) => {
    const rpmReadingsError = errors.viscosity.rpm_readings[reading.originalIndex];

    if (
      sortedReadingsByRpm[i - 1] &&
      reading.dial_reading < sortedReadingsByRpm[i - 1].dial_reading
    ) {
      hasErrors = true;
      rpmReadingsError.dial_reading = 'Dial Readings should be in increasing order';
    }
  });

  return {
    hasErrors,
    errors,
  };
};
