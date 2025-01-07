import { useEffect, useState, useRef } from 'react';
import { get } from 'lodash';
import { mapbox, goals } from '~/utils';
import { goals as goalsConstants } from '~/constants';

import { fetchWells, fetchCompanies, fetchMetricsData, fetchCompanyGoals } from '../utils/apiCalls';
import { FILTERS, METRICS_KEYS } from '../constants';

export { default as useBidirectionalFiltering } from './biDirectionalFiltering';

const { getAssetV2Coordinates, getDistanceByCoordinates } = mapbox;

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useCompanies(canViewCompanies, isAdvancedSearch, companyId) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function handleFetchCompanies() {
      if (!canViewCompanies) {
        setCompanies([]);
        return;
      }

      let data = await fetchCompanies();
      if (isAdvancedSearch) {
        data = data.filter(item => item.id === companyId);
      }
      setCompanies(data);
    }

    handleFetchCompanies();
  }, [canViewCompanies]);

  return companies;
}

export function useCompanyMetricKey(companyId) {
  const [metricKey, setMetricKey] = useState(null);

  useEffect(() => {
    async function handleFetchCompanyMetric() {
      const companyGoals = await fetchCompanyGoals(companyId);
      const companyMetricKey = goals.getCompanyGoalSetting(
        companyGoals,
        goalsConstants.BENCHMARK_METRIC_GOAL
      );

      setMetricKey(companyMetricKey);
    }

    setMetricKey(null);
    handleFetchCompanyMetric();
  }, [companyId]);

  return metricKey;
}

export function useWells(companyId, addWellsUsabilityInfo) {
  const [wells, setWells] = useState(null);

  useEffect(() => {
    async function handleFetchWells() {
      const data = companyId ? await fetchWells(companyId, addWellsUsabilityInfo) : null;
      setWells(data);
    }

    setWells(null);
    handleFetchWells();
  }, [companyId]);

  return wells;
}

export function useFilteredWells(
  dynamicFilters,
  excludeSideTrack,
  excludeNonEngineeredWells,
  allWells
) {
  const [filteredWells, setFilteredWells] = useState(null);
  const sideTrackStrRegex = /\sST0/g;
  const nonEngineeredNames = ['non-engineered', 'non engineered'];

  const filterWell = (field, filter) => {
    return !filter || filter.length === 0 || filter.includes(field);
  };
  useEffect(() => {
    if (!allWells) {
      setFilteredWells(null);
      return;
    }

    const filteredWells = Object.values(FILTERS).reduce((result, filterKey) => {
      return result.filter(well => filterWell(well[filterKey], dynamicFilters[filterKey]));
    }, allWells);

    const filteredWellsByNonEngineered = excludeNonEngineeredWells
      ? filteredWells.filter(well =>
          nonEngineeredNames.every(item => well.name?.toLowerCase().search(item) === -1)
        )
      : filteredWells;

    const sideTracks = filteredWellsByNonEngineered.filter(
      well => (excludeSideTrack && !well.name.match(sideTrackStrRegex)) || !excludeSideTrack
    );

    setFilteredWells(sideTracks);
  }, [allWells, dynamicFilters, excludeSideTrack, excludeNonEngineeredWells]);

  return filteredWells;
}

export function useWellsWithCoords(wells, subjectWell) {
  const [wellsWithCoords, setWellsWithCoords] = useState(null);

  useEffect(() => {
    if (!wells) {
      setWellsWithCoords(wells);
      return;
    }

    const subjectWellCoord = subjectWell && getAssetV2Coordinates(subjectWell, 'topHole');

    if (!subjectWellCoord) {
      setWellsWithCoords(wells);
      return;
    }
    const result = [];
    wells.forEach(well => {
      const coord = getAssetV2Coordinates(well, 'topHole');
      if (coord) {
        const distance = parseFloat(getDistanceByCoordinates(subjectWellCoord, coord));
        result.push({ ...well, distance });
      } else {
        result.push(well);
      }
    });

    setWellsWithCoords(result);
  }, [wells, subjectWell]);

  return wellsWithCoords;
}

export function useOffsetWells(radius, allWells, selectedWellIds) {
  const [offsetWells, setOffsetWells] = useState(null);

  useEffect(() => {
    if (!allWells) {
      // still loading...
      setOffsetWells(null);
      return;
    }

    const result = [];
    // NOTE: Add selected wells
    allWells.forEach(well => {
      if (selectedWellIds.includes(well.id) && well.is_usable) {
        result.push(well);
      }
    });

    setOffsetWells(result);
  }, [radius, allWells, selectedWellIds]);
  return offsetWells;
}

export function useMetricsData(companyId, wells) {
  const fetchedData = useRef({});

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function handleFetchMetricsData(wellIdsToFetch) {
      const records = await fetchMetricsData(companyId, wellIdsToFetch);

      const wellsMetrics = {};
      wellIdsToFetch.forEach(wellId => {
        const wellMetrics = {};

        const wellRecords = records.filter(item => get(item, 'asset_id') === wellId);
        METRICS_KEYS.forEach(metricsKey => {
          const record = wellRecords.find(item => get(item, 'data.key') === metricsKey);
          const value = get(record, 'data.value');
          wellMetrics[metricsKey] = Number.isFinite(value) ? parseFloat(value).toFixed(2) : null;
        });

        wellsMetrics[wellId] = wellMetrics;
      });

      // NOTE: Store previous fetching result
      fetchedData.current = {
        ...fetchedData.current,
        ...wellsMetrics,
      };

      const result = [];
      wells.forEach(well => {
        result.push({
          ...well,
          ...fetchedData.current[well.id],
        });
      });

      setLoading(false);
      setData(result);
    }

    if (!wells) {
      // still loading...
      setData(null);
      return;
    }

    if (wells.length === 0) {
      setData([]);
      return;
    }

    // NOTE: Make api calls for only missing wells
    const missingWellIds = [];
    wells.forEach(well => {
      if (!fetchedData.current[well.id]) {
        missingWellIds.push(well.id);
      }
    });

    setLoading(true);
    handleFetchMetricsData(missingWellIds);
  }, [wells]);

  return [loading, data];
}

export function useRadiusWells(radius, filteredWellsWithCoords, setSelectedWellIds) {
  const initLoadingRef = useRef(false);
  useEffect(() => {
    if (filteredWellsWithCoords) {
      if (initLoadingRef.current) {
        const radiusWellIds = [];
        filteredWellsWithCoords.forEach(well => {
          if (well.distance <= radius) {
            radiusWellIds.push(well.id);
          }
        });
        setSelectedWellIds(radiusWellIds);
      }
      initLoadingRef.current = true;
    }
  }, [radius, filteredWellsWithCoords]);
}
