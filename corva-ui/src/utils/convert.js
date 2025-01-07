/* eslint-disable no-param-reassign */
import convert from 'corva-convert-units';
import { sortBy, uniqBy } from 'lodash';

import { UNIT_DEFINITIONS, IMPERIAL_UNITS, METRIC_UNITS } from './constants/units';

const DEFAULT_PRECISION = 2;
const UNIT_SYSTEM_TYPES = {
  custom: 'custom',
  default: 'imperial',
};

const units = {
  imperial: IMPERIAL_UNITS,
  metric: METRIC_UNITS,
  custom: {},
};

let unitSystem = UNIT_SYSTEM_TYPES.default;
let userUnitsUpdatesSubscribers = [];

export const getAllUnitTypes = () => UNIT_DEFINITIONS;

export const getDefaultUnits = () => units[unitSystem];

/**
 * Adds platform notification toast
 * @param  {Object<{}>} newUnits
 */
function notifyAboutUserUnitsUpdate(newUnits) {
  userUnitsUpdatesSubscribers.forEach(callback => callback(newUnits));
}

/**
 * Updates current custom unit system with user data
 * If no user data - should use imperial unit system by default
 * @param {Object<{}>} userData
 * {
 *    unit_system: {
 *      oilFlowRate: 'bbl/min',
 *      massFlowRate: 'lb/min',
 *      shortLength: 'in',
 *      msePressure: 'ksi',
 *    },
 *    company: {
 *      unit_system: {
 *        oilFlowRate: 'm3/min',
 *        massFlowRate: 'kg/min',
 *        shortLength: 'mm'
 *      }
 *    }
 * }
 */
export const updateUserUnits = ({ userUnits, companyUnits }) => {
  if (!userUnits && !companyUnits) {
    units.custom = {};
    unitSystem = UNIT_SYSTEM_TYPES.default;
  } else {
    units.custom = {
      ...IMPERIAL_UNITS,
      ...companyUnits,
      ...userUnits,
    };
    unitSystem = UNIT_SYSTEM_TYPES.custom;
  }

  notifyAboutUserUnitsUpdate(units.custom);
};

export function getUserUnits() {
  return units.custom;
}

/**
 * Used for DC Isolated App container
 * @param  {Function} newCallback
 */
export function subscribeForUserUnitsUpdates(newCallback) {
  userUnitsUpdatesSubscribers.push(newCallback);

  return () => {
    userUnitsUpdatesSubscribers = userUnitsUpdatesSubscribers.filter(
      callback => callback !== newCallback
    );
  };
}

/**
 * Retrieves a unit of a given type by current unit system
 * @param {String} unitType length, mass, volume, etc
 * @returns {String}
 */
export const getUnitPreference = unitType => units[unitSystem][unitType];

/**
 * Lists all the units of a specific type
 * @param {String} type
 * @returns {String[]}
 */
export const getUnitsByType = type => {
  const definition = UNIT_DEFINITIONS.find(item => item.type === type);

  return definition ? sortBy(convert().list(definition.origin), 'abbr') : [];
};

/**
 * Returns unique units list for some measurements that use same units for imperial and metric system
 * @param {String} type
 * @returns {String[]}
 */
export const getUniqueUnitsByType = type => {
  const definition = getUnitsByType(type);

  return uniqBy(definition, 'abbr');
};

/**
 * @deprecated - unit system can be custom, better to use convert functions
 */
export const getUnitSystem = () => unitSystem;

/**
 * Retrieves the unit display name for a given unit type
 * @param unitType length, mass, volume, etc
 * @returns string
 */
export const getUnitDisplay = (unitType, unitTo = null) => {
  const { getUnit, describe } = convert();
  if (unitTo === null) {
    unitTo = units.custom[unitType];
  }
  if (getUnit(unitTo)) {
    return describe(unitTo).display;
  }
  return unitTo;
};

/**
 * @deprecated - should not depends on imperial system only, because we have mixed unit system
 * Retrieves the unit display name for imperial unit type
 * @param unitType length, mass, volume, etc
 * @returns string
 */
export const getDefaultImperialUnit = unitType => units.imperial[unitType];

/**
 * Converts a single value
 * @param {Number} value The value we want converted.
 * @param {String} unitType The class of unit such as volume, length, mass, etc.
 * @param {String} from The specific unit such as m, gal, lb, etc.
 * @param {String} to (optional) the unit that we want to convert the value to.
 * @param {Number} precision to round to the value
 * May be passed in my ConvertList
 * @return {Number}
 */
export const convertValue = (value, unitType, from, to = null, precision = DEFAULT_PRECISION) => {
  if (!value || !from || from === to) {
    return value;
  }

  if (to === null) {
    to = getUnitPreference(unitType);
    if (!to || from === to) {
      return value;
    }
  }

  const convertedValue = convert(value).from(from).to(to);

  return Number.isFinite(convertedValue)
    ? Math.round(convertedValue * 10 ** precision) / 10 ** precision
    : convertedValue;
};

/**
 * Converts a key in an immutable list of immutables.
 * @param {*} immt The list of maps/lists containing values that we want to convert
 * @param {String} key The key in each sub-iterable that we want to convert
 * @param {String} unitType The class of unit such as volume, length, mass, etc.
 * @param {String} from The specific unit such as m, gal, lb, etc.
 * @param {String} to (optional) the unit that we want to convert the value to.
 * @param {Number} precision to round to the value
 * @returns {*} Immutable
 */
export const convertImmutables = (
  immt,
  key,
  unitType,
  from,
  to = null,
  precision = DEFAULT_PRECISION
) =>
  immt.map(currentUnitMap => {
    const convertedValue = convertValue(currentUnitMap.get(key), unitType, from, to, precision);
    return currentUnitMap.set(key, convertedValue);
  });

/**
 * convertImmutablesByBatch is the expansion of convertImmutables
 * It allows you to convert the immutables by multiple keys/units at once.
 *
 * @param {*} immt immutable you want to convert
 * @param {*} convertionRules is the array of convertion to be done { key, unitType, from, to }
 */
export const convertImmutablesByBatch = (immt, convertionRules) =>
  immt.map(item =>
    convertionRules.reduce((convertingItem, convertionRule) => {
      const { key, unitType, from, to, precision } = convertionRule;
      const val = convertingItem.get(key);
      const convertedValue = convertValue(val, unitType, from, to, precision);
      return convertingItem.set(key, convertedValue);
    }, item)
  );

/**
 * Converts a property in a simple array of js objects or arrays.
 * @param {Number[][]} iterable The array of iterables containing values that we want to convert
 * @param {String} key The key in each sub-element that we want to convert
 * @param {String} unitType The class of unit such as volume, length, mass, etc.
 * @param {String} from The specific unit such as m, gal, lb, etc.
 * @param {String} to (optional) the unit that we want to convert the value to.
 * @returns {Number[][]}
 */
export const convertArray = (
  iterable = [],
  key,
  unitType,
  from,
  to = null,
  precision = DEFAULT_PRECISION
) => {
  for (let i = 0; i < iterable.length; i += 1) {
    iterable[i][key] = convertValue(iterable[i][key], unitType, from, to, precision);
  }

  return iterable;
};

/**
 * Retrieves the full name for a given unit type, singular
 * @param {String} unitType length, mass, volume, etc
 * @returns {String}
 */
export const getUnitSingular = unitType => convert().describe(getUnitPreference(unitType)).singular;

/**
 * Retrieves the full name for a given unit type, plural
 * @param {String} unitType length, mass, volume, etc
 * @returns {String}
 */
export const getUnitPlural = unitType => convert().describe(getUnitPreference(unitType)).plural;

/**
 * Retriends unit data
 *
 * @param {String} unitType length, mass, volume, etc
 * @return {Object<{
 *    abbr: String,
 *    measure: String,
 *    system: String,
 *    singular: String,
 *    plural: String,
 *    display: String
 * }>}
 */
export const getUnitDescription = unitType => convert().describe(unitType);
