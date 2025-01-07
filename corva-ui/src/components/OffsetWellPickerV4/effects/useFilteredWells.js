import { uniqBy } from 'lodash';
import { useState, useEffect } from 'react';
import { FilterType } from '../constants';
import { getTimestampByPeriod } from '../utils/timePeriod';

export function useFilteredWells(wells, filters) {
  const [filteredWells, setFilteredWells] = useState(null);
  const sideTrackStrRegex = /\sST0/g;

  // NOTE: Filter Wells
  useEffect(() => {
    if (!wells) return;

    // Apply filter setting
    const filteredWells = wells.filter(well =>
      Object.keys(filters).every(filterKey => {
        if (typeof filters[filterKey] !== 'object') {
          return true;
        }
        if (filters[filterKey].length > 0 && !filters[filterKey].includes(well[filterKey])) {
          return false;
        }
        return true;
      })
    );

    // Sidetracks filter
    let sideTracks = filteredWells;
    if (typeof filters[FilterType.sideTracks] !== 'undefined') {
      sideTracks = filteredWells.filter(
        well => !filters[FilterType.sideTracks] || !well.name.match(sideTrackStrRegex)
      );
    }

    // Time period filter
    const { period, timeRangeFrom, timeRangeTo } = filters;
    const [startTimestamp, endTimestamp] = getTimestampByPeriod(period, timeRangeFrom, timeRangeTo);
    const filteredWellsByTime =
      Number.isFinite(startTimestamp) && Number.isFinite(endTimestamp)
        ? sideTracks.filter(
            well => well.lastActive >= startTimestamp && well.lastActive <= endTimestamp
          )
        : sideTracks;

    // Radius filter
    const { radius } = filters;
    const filteredWellsByRadius = Number.isFinite(radius)
      ? filteredWellsByTime.filter(well => well.distance <= radius)
      : filteredWellsByTime;

    setFilteredWells(uniqBy(filteredWellsByRadius, 'id'));
  }, [wells, filters]);

  return filteredWells;
}
