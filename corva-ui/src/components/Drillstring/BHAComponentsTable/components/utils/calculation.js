import { cloneDeep } from 'lodash';
import { getUnitPreference, convertValue } from '~/utils';

const LINEAR_WEIGHT_FACTOR = 2.673;
const NOZZLE_MULTIPLY_FACTOR = 32;

const calculateLinearWeight = (od, id) => {
  const prefShortLengthUnit = getUnitPreference('shortLength');
  let parsedId = parseFloat(id);
  let parsedOd = parseFloat(od);

  if (Number.isNaN(parsedId) || Number.isNaN(parsedOd) || parsedOd < parsedId) {
    return null;
  }

  if (prefShortLengthUnit !== 'in') {
    parsedId = convertValue(parsedId, 'shortLength', prefShortLengthUnit, 'in');
    parsedOd = convertValue(parsedOd, 'shortLength', prefShortLengthUnit, 'in');
  }

  const linearWeight = LINEAR_WEIGHT_FACTOR * (parsedOd * parsedOd - parsedId * parsedId);

  return prefShortLengthUnit !== 'in'
    ? convertValue(linearWeight, 'massPerLength', 'lb-ft')
    : linearWeight.fixFloat(2);
};

const calculateLength = (joints, componentLength) => {
  const parsedNumberJoints = parseFloat(joints);
  const parsedComponentLength = parseFloat(componentLength);
  if (!Number.isFinite(parsedNumberJoints) || !Number.isFinite(parsedComponentLength)) {
    return null;
  }

  return (parsedNumberJoints * parsedComponentLength).fixFloat(2);
};

const calculateWeight = (linearWeight, length) => {
  const parsedLinearWeight = parseFloat(linearWeight);
  const parsedLength = parseFloat(length);
  if (Number.isNaN(parsedLinearWeight) || Number.isNaN(parsedLength)) {
    return null;
  }

  return (parsedLinearWeight * parsedLength).fixFloat(2);
};

const calculateComponentLength = (length, numberJoints) => {
  const parsedLength = parseFloat(length);
  const parsedNumberJoints = parseFloat(numberJoints);

  if (!Number.isFinite(parsedLength) || !Number.isFinite(parsedNumberJoints)) {
    return null;
  }

  return (parsedLength / parsedNumberJoints).fixFloat(2);
};

const calculateTfa = nozzleSizes => {
  const shortLengthPrefUnit = getUnitPreference('shortLength');
  const tfa =
    (Math.PI / 4) *
    nozzleSizes.reduce((sum, nozzle) => {
      const count = nozzle.count || 0;
      const size = nozzle.size || 0;
      const cSize =
        shortLengthPrefUnit !== 'in'
          ? convertValue(size, 'shortLength', shortLengthPrefUnit, 'in') * NOZZLE_MULTIPLY_FACTOR
          : size;
      return sum + count * ((cSize / NOZZLE_MULTIPLY_FACTOR) * (cSize / NOZZLE_MULTIPLY_FACTOR));
    }, 0);

  const ratio = convertValue(1, 'shortLength', 'in', shortLengthPrefUnit);
  const cTfa = ratio * ratio * tfa;

  return cTfa;
};

export const calculateComponent = (component, key, value) => {
  const { family } = component;
  const result = cloneDeep(component);
  result[key] = value;

  if (family === 'bit') {
    if (key === 'nozzle_sizes') {
      result.tfa = calculateTfa(result.nozzle_sizes || []);
    }
    return result;
  }

  switch (key) {
    case 'inner_diameter':
    case 'outer_diameter':
      result.linear_weight = calculateLinearWeight(result.outer_diameter, result.inner_diameter);
      result.weight = calculateWeight(result.linear_weight, result.length);
      break;
    case 'number_of_joints':
    case 'component_length':
      result.length = calculateLength(result.number_of_joints, result.component_length);
      result.weight = calculateWeight(result.linear_weight, result.length);
      break;
    case 'linear_weight':
      result.weight = calculateWeight(result.linear_weight, result.length);
      break;
    case 'length':
      result.weight = calculateWeight(result.linear_weight, result.length);
      result.component_length = calculateComponentLength(result.length, result.number_of_joints);
      break;
    default:
      break;
  }

  return result;
};
