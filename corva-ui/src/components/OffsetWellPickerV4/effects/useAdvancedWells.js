import { useState, useEffect, useRef } from 'react';
import { get, groupBy } from 'lodash';
import { mapbox } from '~/utils';
import { fetchMetricsData } from '../utils/apiCalls';
import { ColumnType, ALL_SECTION_KEY } from '../constants';

const { getAssetV2Coordinates, getDistanceByCoordinates } = mapbox;

const parseMetricValue = value => (Number.isFinite(value) ? parseFloat(value.toFixed(2)) : null);

export function useAdvancedWells(
  companyId,
  rawWells,
  wellSections,
  offsetWellsBySection,
  subjectWellId,
  metricsKeys
) {
  const [wells, setWells] = useState(null);
  const [coordinatedWells, setCoordinatedWells] = useState(null);
  const [sectionizedWells, setSectionizedWells] = useState(null);
  const fetchedData = useRef({});

  // NOTE: Add coordinate in wells

  async function handleCoordinatedWells() {
    const subjectWell = rawWells.find(well => well.id === subjectWellId);
    const subjectWellCoord = subjectWell && getAssetV2Coordinates(subjectWell, 'topHole');
    if (!subjectWellCoord) {
      setCoordinatedWells(rawWells);
    }

    const result = await Promise.all(
      rawWells.map(async well => {
        try {
          const coord = await getAssetV2Coordinates(well, 'topHole');
          if (coord) {
            const distance = parseFloat(await getDistanceByCoordinates(subjectWellCoord, coord));
            return { ...well, distance: parseFloat(distance.toFixed(2)) };
          } else {
            return well;
          }
        } catch {
          return well;
        }
      })
    );
    setCoordinatedWells(result);
  }

  useEffect(() => {
    if (rawWells) {
      handleCoordinatedWells();
    }
  }, [rawWells, subjectWellId]);

  // NOTE: Add offset well section names in wells

  function handleSectionizedWells() {
    const filteredSections = wellSections.filter(item => item.value !== ALL_SECTION_KEY);
    const result = coordinatedWells.map(well => {
      const sectionNames = filteredSections
        .filter(section => (offsetWellsBySection[section.value] || []).includes(well.id))
        .map(section => section.label);
      if (sectionNames.length > 0) return { ...well, [ColumnType.wellSection]: sectionNames };
      return well;
    });

    setSectionizedWells(result);
  }

  useEffect(() => {
    if (coordinatedWells && wellSections && offsetWellsBySection) {
      handleSectionizedWells();
    }
  }, [coordinatedWells, wellSections, offsetWellsBySection]);

  // NOTE: Add metrics fields

  async function handleFetchMetricsData(wellIdsToFetch) {
    const records = await fetchMetricsData(companyId, wellIdsToFetch, metricsKeys);
    const wellsMetrics = {};
    const recordsPerAsset = groupBy(records, 'asset_id');

    wellIdsToFetch.forEach(wellId => {
      const wellMetrics = recordsPerAsset[wellId]?.reduce((acc, record) => {
        const value = get(record, 'data.value');
        const key = get(record, 'data.key');

        return { ...acc, [key]: parseMetricValue(value) };
      }, {});

      wellsMetrics[wellId] = wellMetrics;
    });
    // NOTE: Store previous fetching result
    fetchedData.current = {
      ...fetchedData.current,
      ...wellsMetrics,
    };
    const result = [];
    sectionizedWells.forEach(well => {
      result.push({
        ...well,
        ...fetchedData.current[well.id],
      });
    });
    setWells(result);
  }

  useEffect(() => {
    if (sectionizedWells) {
      // NOTE: Make api calls for only missing wells
      const missingWellIds = [];
      sectionizedWells.forEach(well => {
        if (!fetchedData.current[well.id]) {
          missingWellIds.push(well.id);
        }
      });
      handleFetchMetricsData(missingWellIds);
    }
  }, [sectionizedWells]);

  useEffect(() => {
    if (wells) {
      const wellIdsToFetch = wells.map(well => well.id);
      handleFetchMetricsData(wellIdsToFetch);
    }
  }, [metricsKeys]);

  return wells;
}
