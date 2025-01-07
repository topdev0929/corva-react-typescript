import { round, identity } from 'lodash';
import { convertValue, getUnitDisplay } from '~/utils/convert';

const DEFAULT_PRECISION = 2;

/**
 * Metrics-config specific unit display.
 * Retrieves the unit display name for a given unit type
 * @param  {Function} formatUnitDisplay=identity
 * @param  {String} to
 * @param  {String} unitType
 */
export function getMetricUnitDisplay({ formatUnitDisplay = identity, to, unitType } = {}) {
  // NOTE: If no unitType provided - show `to` value as unitDisplay
  if (!to && !unitType) return '';
  return formatUnitDisplay(to || getUnitDisplay(unitType));
}

/**
 * Converts a single value. Metrics-config specific.
 * @param  {Number} metricApiValue
 * @param  {Object<{
 *    unitType: String,
 *    from: String,
 *    to: String,
 *    customConvert: Function,
 *    precision: Number,
 *    allowNegativeValue: Boolean
 * }>} metricConfig
 * @returns {Number}
 */
export function getConvertedMetricValue(metricApiValue, metricConfig) {
  // NOTE: Metric api value must be numeric
  if (!Number.isFinite(metricApiValue) || !metricConfig) return null;

  const {
    unitType, // The class of unit such as volume, length, mass, etc.
    from, // The specific unit such as m, gal, lb, etc. API returns metric in this unit
    to, // To (optional) the unit that we want to convert the value to.
    customConvert, // Use custom conversion if provided
    precision = 2, // Round metric with this precision
    allowNegativeValue = false,
  } = metricConfig;

  if (customConvert) return customConvert(metricApiValue, metricConfig);

  // NOTE: Scale, convert and round value
  let value = unitType
    ? convertValue(metricApiValue, unitType, from, to, precision)
    : metricApiValue;
  // NOTE: Convert's round sometimes skip rounding
  value = round(value, precision);

  // NOTE: Metrics should be non-negative by default
  value = allowNegativeValue ? value : Math.max(value, 0);
  return value;
}

/**
 * Round down all values between 100-101.50% to 100.00%. Leave all values above 101.50%.
 * @param  {Number} value
 * @param  {Object<{precision: Number}>} precision
 * @returns {Number}
 */
export function convertPercentageMetrics(value, { precision = DEFAULT_PRECISION } = {}) {
  const convertedValue = value * 100;
  return round(convertedValue > 100 && convertedValue < 101.5 ? 100 : convertedValue, precision);
}
