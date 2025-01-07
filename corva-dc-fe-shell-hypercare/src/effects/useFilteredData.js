import { first, inRange, last, minBy, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { getOpacityRange } from '~/utils/dataUtils';

export function useFilteredData({
  mainData,
  manualPhases,
  selectedPhases,
  selectedZones,
  isOverlay,
  timeRange,
  criticalPoints,
  refPoint,
}) {
  const [filteredPhases, setFilteredPhases] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredTimeRange, setFilteredTimeRange] = useState([]);

  useEffect(() => {
    if (!timeRange) return;

    let filtered;
    if (selectedPhases.length === 0) {
      filtered = Object.entries(manualPhases).reduce((acc, [name, phaseInfo]) => {
        const region = phaseInfo.map(item => ({ name, ...item }));
        return acc.concat(region);
      }, []);
    } else {
      filtered = selectedPhases.reduce((acc, name) => {
        const region = manualPhases[name]?.map(item => ({ name, ...item }));
        return acc.concat(region);
      }, []);
    }

    filtered = filtered.filter(item => {
      const withinStartRange = inRange(item.start_time, timeRange.start, timeRange.end);
      const withinEndRange = inRange(item.end_time, timeRange.start, timeRange.end);
      return withinStartRange || withinEndRange;
    });

    filtered = selectedZones.length
      ? filtered.filter(item => selectedZones.includes(item.zone))
      : filtered;

    setFilteredPhases(filtered);
  }, [manualPhases, selectedPhases, selectedZones, timeRange]);

  useEffect(() => {
    if (!mainData) {
      setFilteredData([]);
      setFilteredTimeRange([{ min: null, max: null }]);
      return;
    }

    if (selectedPhases.length === 0 && selectedZones.length === 0) {
      setFilteredData(mainData);
      const timeRanges = mainData.map(item => ({
        min: first(item.wits)?.timestamp,
        max: last(item.wits)?.timestamp,
      }));
      setFilteredTimeRange(timeRanges);
      return;
    }

    const filteredTimeRange = [];
    const filteredData = [];
    const opacityRange = getOpacityRange(filteredPhases?.length);
    const sortFilteredPhases = sortBy(filteredPhases, 'start_time').reverse();

    mainData.forEach(stageData => {
      let opacityIndex = 0;
      sortFilteredPhases.forEach(phase => {
        const filteredWits = stageData.wits.filter(item => {
          const { timestamp } = item;
          const { start_time: startTime, end_time: endTime } = phase ?? {};
          return startTime <= timestamp && (timestamp <= endTime || !endTime);
        });
        if (filteredWits.length) {
          const startTime = filteredWits[0].timestamp;
          const endTime = filteredWits[filteredWits.length - 1].timestamp;

          let refTimeDiff = 0;
          let opacity = 1;
          if (isOverlay) {
            const filteredPoints = criticalPoints
              .filter(item => item.title === refPoint)
              .filter(item => item.timestamp >= startTime && item.timestamp <= endTime);
            const firstPoint = minBy(filteredPoints, 'timestamp');

            refTimeDiff = firstPoint?.timestamp || startTime;
            opacity = opacityRange[opacityIndex];
            opacityIndex += 1;
          }

          filteredData.push({
            ...stageData,
            wits: filteredWits.map(item => ({
              ...item,
              timestamp: item.timestamp - refTimeDiff,
            })),
            range: [startTime, endTime],
            refTimeDiff,
            opacity,
          });

          filteredTimeRange.push({
            min: startTime,
            max: endTime,
            assetId: stageData.assetId,
          });
        }
      });
    });

    setFilteredData(filteredData);
    setFilteredTimeRange(filteredTimeRange);
  }, [
    selectedPhases,
    selectedZones,
    filteredPhases,
    mainData,
    isOverlay,
    criticalPoints,
    refPoint,
  ]);

  return [filteredPhases, filteredData, filteredTimeRange];
}
