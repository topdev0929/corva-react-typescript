import * as metrics from './metricsConfig';
import { getMetricUnitDisplay } from './utils';

/**
 * Metric-specific unit display. Made for custom metric config conversions.
 * @param  {String} metricType
 * @returns {String}
 */
export function getMetricTypeUnitDisplay(metricType) {
  const metricConfig = metrics[metricType];
  return getMetricUnitDisplay(metricConfig);
}

export { getMetricUnitDisplay, getConvertedMetricValue, convertPercentageMetrics } from './utils';
export default metrics;
