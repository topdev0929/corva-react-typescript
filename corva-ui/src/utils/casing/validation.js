import moment from 'moment';
import { getUnitPreference, getUnitDisplay, convertValue } from '../convert';

import {
  MIN_ID,
  MAX_ID,
  MIN_OD,
  MAX_OD,
  MIN_TOP_DEPTH,
  MAX_TOP_DEPTH,
  MIN_BOTTOM_DEPTH,
  MAX_BOTTOM_DEPTH,
  DP_MIN_ID,
  DP_MAX_ID,
  DP_MIN_OD,
  DP_MAX_OD,
  DP_MIN_TJ_ID,
  DP_MAX_TJ_ID,
  DP_MIN_TJ_OD,
  DP_MAX_TJ_OD,
  DP_MIN_LENGTH,
  DP_MAX_LENGTH,
  HWDP_MIN_ID,
  HWDP_MAX_ID,
  HWDP_MIN_OD,
  HWDP_MAX_OD,
  HWDP_MIN_TJ_ID,
  HWDP_MAX_TJ_ID,
  HWDP_MIN_TJ_OD,
  HWDP_MAX_TJ_OD,
  HWDP_MIN_LENGTH,
  HWDP_MAX_LENGTH,
} from '~/constants/casing';

const ERROR_NON_NUMERIC = 'It must be a number.';

const shortLengthDisplayUnit = getUnitDisplay('shortLength');
const lengthDisplayUnit = getUnitDisplay('length');

function parseComponent(component) {
  return {
    ...component,
    inner_diameter: parseFloat(component.inner_diameter),
    outer_diameter: parseFloat(component.outer_diameter),
    linear_weight: parseFloat(component.linear_weight),
    number_of_joints: parseFloat(component.number_of_joints),
    component_length: parseFloat(component.component_length),
    length: parseFloat(component.length),
    weight: parseFloat(component.weight),
    outer_diameter_tooljoint: parseFloat(component.outer_diameter_tooljoint),
    inner_diameter_tooljoint: parseFloat(component.inner_diameter_tooljoint),
    length_tooljoint: parseFloat(component.length_tooljoint),
  };
}

function getRangeErrorMessage(min, max, precision, displayUnit) {
  const lowerVal = precision ? min.toFixed(precision) : min;
  const upperVal = precision ? max.toFixed(precision) : max;

  return `${lowerVal}~${upperVal}${displayUnit ? ` (${displayUnit})` : ''}`;
}

function isOutOfRange(val, min, max) {
  if (!Number.isFinite(val) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return true;
  }

  return val < min || val > max;
}

export function calculateLinearWeight(outer, inner) {
  const shortLengthPrefUnit = getUnitPreference('shortLength');
  const cOuter =
    shortLengthPrefUnit !== 'in'
      ? convertValue(outer, 'shortLength', shortLengthPrefUnit, 'in')
      : outer;
  const cInner =
    shortLengthPrefUnit !== 'in'
      ? convertValue(inner, 'shortLength', shortLengthPrefUnit, 'in')
      : inner;

  const linearWeight = 2.673 * (cOuter * cOuter - cInner * cInner);
  return shortLengthPrefUnit !== 'in'
    ? convertValue(linearWeight, 'massPerLength', 'lb-ft')
    : linearWeight;
}

export function isValidLinearWeight(od, id, lw) {
  const calculated = calculateLinearWeight(od, id);
  return lw >= calculated * 0.5 && lw <= calculated * 1.5;
}

function validateCommonFields(component) {
  const errors = {};

  if (!Number.isFinite(component.inner_diameter)) {
    errors.inner_diameter = ERROR_NON_NUMERIC;
  }
  if (!Number.isFinite(component.outer_diameter)) {
    errors.outer_diameter = ERROR_NON_NUMERIC;
  }

  if (!Number.isFinite(component.linear_weight)) {
    errors.linear_weight = ERROR_NON_NUMERIC;
  }

  if (!errors.inner_diameter && !errors.outer_diameter) {
    if (component.outer_diameter < component.inner_diameter) {
      errors.outer_diameter = 'O.D > I.D';
    } else if (
      !errors.linear_weight &&
      !isValidLinearWeight(
        component.outer_diameter,
        component.inner_diameter,
        component.linear_weight
      )
    ) {
      errors.linear_weight = 'Invalid linear weight';
    }
  }

  if (!Number.isFinite(component.number_of_joints)) {
    errors.number_of_joints = ERROR_NON_NUMERIC;
  }

  if (!Number.isFinite(component.component_length)) {
    errors.component_length = ERROR_NON_NUMERIC;
  }

  if (!Number.isFinite(component.length)) {
    errors.length = ERROR_NON_NUMERIC;
  }

  if (!Number.isFinite(component.weight)) {
    errors.weight = ERROR_NON_NUMERIC;
  }

  return errors;
}

function validateComponentSpecificFields(component) {
  const { family } = component;
  const errors = {};

  if (family !== 'dp' && family !== 'hwdp') {
    return errors;
  }

  let minId;
  let minOd;
  let maxId;
  let maxOd;
  let minTjId;
  let minTjOd;
  let maxTjId;
  let maxTjOd;
  let minLength;
  let maxLength;

  if (family === 'dp') {
    minId = DP_MIN_ID;
    minOd = DP_MIN_OD;
    maxId = DP_MAX_ID;
    maxOd = DP_MAX_OD;
    minTjId = DP_MIN_TJ_ID;
    minTjOd = DP_MIN_TJ_OD;
    maxTjId = DP_MAX_TJ_ID;
    maxTjOd = DP_MAX_TJ_OD;
    minLength = DP_MIN_LENGTH;
    maxLength = DP_MAX_LENGTH;
  } else {
    minId = HWDP_MIN_ID;
    minOd = HWDP_MIN_OD;
    maxId = HWDP_MAX_ID;
    maxOd = HWDP_MAX_OD;
    minTjId = HWDP_MIN_TJ_ID;
    minTjOd = HWDP_MIN_TJ_OD;
    maxTjId = HWDP_MAX_TJ_ID;
    maxTjOd = HWDP_MAX_TJ_OD;
    minLength = HWDP_MIN_LENGTH;
    maxLength = HWDP_MAX_LENGTH;
  }

  minId = convertValue(minId, 'shortLength', 'in');
  minOd = convertValue(minOd, 'shortLength', 'in');
  maxId = convertValue(maxId, 'shortLength', 'in');
  maxOd = convertValue(maxOd, 'shortLength', 'in');
  minTjId = convertValue(minTjId, 'shortLength', 'in');
  minTjOd = convertValue(minTjOd, 'shortLength', 'in');
  maxTjId = convertValue(maxTjId, 'shortLength', 'in');
  maxTjOd = convertValue(maxTjOd, 'shortLength', 'in');
  minLength = convertValue(minLength, 'length', 'ft');
  maxLength = convertValue(maxLength, 'length', 'ft');

  if (isOutOfRange(component.inner_diameter, minId, maxId)) {
    errors.inner_diameter = getRangeErrorMessage(minId, maxId, 2, shortLengthDisplayUnit);
  }

  if (isOutOfRange(component.outer_diameter, minOd, maxOd)) {
    errors.outer_diameter = getRangeErrorMessage(minOd, maxOd, 2, shortLengthDisplayUnit);
  }

  if (isOutOfRange(component.inner_diameter_tooljoint, minTjId, maxTjId)) {
    errors.inner_diameter_tooljoint = getRangeErrorMessage(
      minTjId,
      maxTjId,
      2,
      shortLengthDisplayUnit
    );
  }

  if (isOutOfRange(component.outer_diameter_tooljoint, minTjOd, maxTjOd)) {
    errors.outer_diameter_tooljoint = getRangeErrorMessage(
      minTjOd,
      maxTjOd,
      2,
      shortLengthDisplayUnit
    );
  }

  if (isOutOfRange(component.length, minLength, maxLength)) {
    errors.length = getRangeErrorMessage(minLength, maxLength, 2, lengthDisplayUnit);
  }

  if (
    !errors.outer_diameter_tooljoint &&
    component.outer_diameter_tooljoint < component.outer_diameter
  ) {
    errors.outer_diameter_tooljoint = 'Tool Joint O.D >= O.D';
  }

  if (component.length_tooljoint > component.component_length) {
    errors.length_tooljoint = 'Tool Joint Length < Component Length';
  }

  return errors;
}

export function validateComponent(component) {
  const parsedComponent = parseComponent(component);

  const errors = {
    ...validateCommonFields(parsedComponent),
    ...validateComponentSpecificFields(parsedComponent),
  };

  const fieldsWithError = Object.keys(errors);

  return fieldsWithError.length > 0 ? { isValid: false, errors } : { isValid: true };
}

export function validateInterComponents(isRiser, components) {
  const errors = [];

  if (components.length && !isRiser) {
    const casingJoints = components.filter(component => component.family === 'casing_joints');
    const floatShoes = components.filter(component => component.family === 'float_shoe');
    const lastComponent = components[components.length - 1];
    const firstComponent = components[0];

    if (casingJoints.length < 1) {
      errors.push('At least one casing joints required.');
    }

    if (floatShoes.length === 0) {
      errors.push('At least one float shoe required.');
    } else if (floatShoes.length > 1) {
      errors.push('Only one float shoe required.');
    } else if (firstComponent.family !== 'float_shoe' && lastComponent.family !== 'float_shoe') {
      errors.push('Float Shoe should be on the bottom of the list');
    }
  }

  if (isRiser) {
    const risers = components.filter(component => component.family === 'riser');

    if (risers.length === 0) {
      errors.push('At least one riser required.');
    } else if (risers.length > 1) {
      errors.push('Only one riser required.');
    }
  }

  return errors.length > 0 ? { isValid: false, errors } : { isValid: true };
}

export function validateMainFields(record) {
  const { data } = record;

  const errors = {};

  const minId = convertValue(MIN_ID, 'shortLength', 'in');
  const maxId = convertValue(MAX_ID, 'shortLength', 'in');
  const minOd = convertValue(MIN_OD, 'shortLength', 'in');
  const maxOd = convertValue(MAX_OD, 'shortLength', 'in');
  const minTopDepth = convertValue(MIN_TOP_DEPTH, 'length', 'ft');
  const maxTopDepth = convertValue(MAX_TOP_DEPTH, 'length', 'ft');
  const minBottomDepth = convertValue(MIN_BOTTOM_DEPTH, 'length', 'ft');
  const maxBottomDepth = convertValue(MAX_BOTTOM_DEPTH, 'length', 'ft');

  if (data.start_timestamp && !moment(new Date(data.start_timestamp)).isValid()) {
    errors.start_timestamp = 'Invalid Date.';
  }

  if (isOutOfRange(data.inner_diameter, minId, maxId)) {
    errors.inner_diameter = getRangeErrorMessage(minId, maxId, 2, shortLengthDisplayUnit);
  }

  if (isOutOfRange(data.outer_diameter, minOd, maxOd)) {
    errors.outer_diameter = getRangeErrorMessage(minOd, maxOd, 2, shortLengthDisplayUnit);
  }

  if (!errors.inner_diameter && !errors.outer_diamter && data.inner_diamter > data.outer_diameter) {
    errors.outer_diameter = 'O.D > I.D';
  }

  if (isOutOfRange(data.top_depth, minTopDepth, maxTopDepth)) {
    errors.top_depth = getRangeErrorMessage(minTopDepth, maxTopDepth, 2, lengthDisplayUnit);
  }

  if (isOutOfRange(data.bottom_depth, minBottomDepth, maxBottomDepth)) {
    errors.bottom_depth = getRangeErrorMessage(
      minBottomDepth,
      maxBottomDepth,
      2,
      lengthDisplayUnit
    );
  }

  if (!errors.top_depth && !errors.bottom_depth && data.top_depth > data.bottom_depth) {
    errors.bottom_depth = 'Bottom Depth > Top Depth';
  }

  if (
    !errors.inner_diameter &&
    !errors.outer_diameter &&
    isValidLinearWeight(data.outer_diameter, data.inner_diameter, data.linear_weight)
  ) {
    errors.linear_weight = 'Invalid Linear Weight';
  }

  const fieldsWithError = Object.keys(errors);

  return fieldsWithError.length > 0 ? { isValid: false, errors } : { isValid: true };
}
