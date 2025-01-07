import { sortBy } from 'lodash';
import numeral from 'numeral';

export function calcGradientStyle(stops) {
  if (!stops || stops.length === 0) {
    return 'none';
  }
  return sortBy(stops, 'pos')
    .map(({ color, pos }) => `${color} ${pos}%`)
    .join(',');
};

export const getStopText = (position, { fromValue, toValue}) => {
  if (fromValue === toValue) {
    return String(fromValue);
  }

  const range = toValue - fromValue;

  const step = getRangeStep(range);
  const value = fromValue + range * (position / 100);
  const roundedToStep = roundToStep(value, step);

  if (Math.abs(step) >= 1) {
    return numeral(roundedToStep).format('0,00');
  }

  const scale = Math.ceil(-Math.log10(step));

  return roundedToStep.toFixed(Math.max(scale, 0));
};

export const getRangeStep = (range) => {
  let step = Math.pow(10, Math.floor(Math.log10(range))) / 100;

  if (range / step >= 500) {
    step = step * 5;
  }
  if (range / step > 250) {
    step = step * 2;
  }

  const rounded = step > 1 ? Math.round(step) : 1 / Math.round(1 / step);

  return rounded;
};

export const roundToStep = (value: number, step: number) => {
  return reasonableRealValue(Math.round(value / step) * step);
};

const maxSafeIntegerDigitCount = 15;

export const reasonableRealValue = value => {
  if (!value) {
    return value;
  }
  const valueMagnitude = Math.ceil(Math.log10(Math.abs(value)));
  const multiplier = Math.round(Math.pow(10, maxSafeIntegerDigitCount - valueMagnitude));
  return Math.round(value * multiplier) / multiplier;
};
