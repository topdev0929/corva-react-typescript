import { useEffect, useRef, useState } from 'react';
import { isEqual, sortBy, startCase, uniq } from 'lodash';

import { fetchFirstWit, fetchLastWit, fetchSubWits, loadWitsChannels } from '~/api/wits';
import { loadColumnMapper } from '~/api/streams';
import { SOURCE_TYPE, SUPPORTED_TRACES, TRACE_SOURCES } from '~/constants';

export function useTimeRange({
  assetId,
  setAllChannels,
  setColumnMapping,
  timeRange,
  setTimeRange,
  setLastTimestamp,
  savedTimeRange,
  onAppSettingChange,
  sensorHeaderData,
  traces,
  sensorTimeDiff,
}) {
  const [witsTimeRange, setWitsTimeRange] = useState(null);
  const timeRangeSettings = useRef(savedTimeRange);

  useEffect(() => {
    const getSupportedSensorTraces = async (record = null) => {
      if (!record) {
        return sortBy(SUPPORTED_TRACES, ['label']);
      }

      const supportedTraceNames = SUPPORTED_TRACES.map(({ trace }) => trace);
      const recordSensorTraces = Object.keys(record.data);

      const [witsChannels, columnMapping] = await Promise.all([
        loadWitsChannels(assetId),
        loadColumnMapper(assetId),
      ]);
      setColumnMapping(columnMapping);
      const sensorTraces = recordSensorTraces.concat(witsChannels);

      const allSupportedSensorTraces = sensorTraces.reduce((allTraces, recordTrace) => {
        if (supportedTraceNames.includes(recordTrace)) {
          return allTraces;
        }

        return allTraces.concat({ label: startCase(recordTrace), trace: recordTrace });
      }, SUPPORTED_TRACES);

      const columnMappingTraces = Object.keys(columnMapping).map(trace => ({
        trace,
        label: startCase(trace),
      }));

      return sortBy([...allSupportedSensorTraces, ...columnMappingTraces], ['label']);
    };

    const getTimestampByWits = async () => {
      // Get Wits Min/Max Time
      const current1mData = await fetchSubWits(assetId, SOURCE_TYPE.medium);
      const supportedSensorTraces = await getSupportedSensorTraces(current1mData);
      const allChannels = uniq(supportedSensorTraces.map(({ trace }) => trace));
      setAllChannels(allChannels);

      const [lastWit, firstWit] = await Promise.all([
        fetchLastWit(assetId),
        fetchFirstWit(assetId),
      ]);

      setWitsTimeRange({
        min: firstWit?.timestamp,
        max: lastWit?.timestamp,
      });
    };

    if (assetId) {
      setTimeRange(null);
      setWitsTimeRange(null);
      getTimestampByWits();
    }
  }, [assetId]);

  useEffect(() => {
    if (!witsTimeRange || sensorTimeDiff === null) return;

    // Get min/max time of sensors to be added
    let sensorMinTime = Infinity;
    let sensorMaxTime = -Infinity;
    const sensorChannels = traces.filter(item => item.trackType === TRACE_SOURCES.DOWNHOLE);
    if (sensorChannels.length && sensorHeaderData) {
      sensorChannels.forEach(channel => {
        const header = sensorHeaderData.find(item => item.id === channel.sensorId);
        if (header && header.minTimestamp < sensorMinTime) {
          sensorMinTime = header.minTimestamp + (sensorTimeDiff[channel.sensorId] ?? 0);
        }
        if (header && header.maxTimestamp > sensorMaxTime) {
          sensorMaxTime = header.maxTimestamp + (sensorTimeDiff[channel.sensorId] ?? 0);
        }
      });
    }

    // Cacluate min/max time of wits and sensor
    const firstTime = Math.min(witsTimeRange.min, sensorMinTime);
    const lastTime = Math.max(witsTimeRange.max, sensorMaxTime);
    const { start_time: startTime, end_time: endTime, max } = timeRangeSettings.current;
    setTimeRange({
      min: firstTime,
      max: lastTime,
      start: startTime || firstTime,
      // Update the end_time when asset is live
      end: !endTime || endTime >= max ? lastTime : endTime,
    });
    setLastTimestamp(lastTime);
  }, [sensorHeaderData, traces, sensorTimeDiff, witsTimeRange]);

  useEffect(() => {
    if (!timeRange) return;

    const newValue = {
      min: timeRange.min,
      max: timeRange.max,
      start_time: timeRange.start,
      end_time: timeRange.end,
    };

    if (!isEqual(newValue, timeRangeSettings.current)) {
      onAppSettingChange('time_range', newValue);
      timeRangeSettings.current = newValue;
    }
  }, [timeRange]);
}
