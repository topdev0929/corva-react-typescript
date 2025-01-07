import { useState, useEffect } from 'react';
import { goals } from '~/utils';
import { goals as goalsConstants } from '~/constants';
import { fetchCompanyGoals } from '../utils/apiCalls';
import { DEFAULT_METRICS_KEY } from '../constants';

export function useCompanyMetricKey(companyId, savedMetricsKeys) {
  const [metricKeys, setMetricKeys] = useState([]);

  useEffect(() => {
    async function handleFetchCompanyMetric() {
      const companyGoals = await fetchCompanyGoals(companyId);
      const companyMetricKey = goals.getCompanyGoalSetting(
        companyGoals,
        goalsConstants.BENCHMARK_METRIC_GOAL
      );

      if (companyMetricKey) {
        setMetricKeys([companyMetricKey]);
      } else {
        setMetricKeys([]);
      }
    }

    if (savedMetricsKeys) {
      setMetricKeys(savedMetricsKeys);
    } else if (companyId) {
      handleFetchCompanyMetric();
    }
  }, [companyId, savedMetricsKeys]);
  // set 'Total Distance drilled' to default metric
  if (!metricKeys.includes(DEFAULT_METRICS_KEY)) {
    setMetricKeys(prev => [DEFAULT_METRICS_KEY, ...prev].slice(0, 3));
  }
  return [metricKeys, setMetricKeys];
}
