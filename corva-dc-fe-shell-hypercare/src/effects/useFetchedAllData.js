import { useEffect, useRef, useState } from 'react';
import { cloneDeep, debounce, flatten, isEmpty, last, maxBy, minBy, isEqual } from 'lodash';
import { showSuccessNotification } from '@corva/ui/utils';

import { fetchWitsData } from '~/api/wits';
import { fetchDownHoleSensorData } from '~/api/sensor';
import {
  convertLogValue,
  convertSumLogData,
  getOpacityRange,
  convertSumData,
} from '~/utils/dataUtils';
import { SOURCE_TYPE, TRACE_SOURCES } from '~/constants';

const debouncedFunc = debounce(callback => {
  callback();
}, 200);

const debouncedInitLoadedFunc = debounce(callback => {
  callback();
}, 3000);

export function useFetchedAllData({
  provider,
  assetId,
  sourceType,
  offsetWells,
  subData,
  setSubData,
  isResetZoom,
  traces,
  timeRange,
  setLastTimestamp,
  isOverlay,
  isLive,
  sensorTimeDiff,
  onAppSettingChange,
  sensorHeaderData,
  setIsDetailLoading,
  onTimeAdjustment,
  setOnTimeAdjustment,
}) {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const initChannelsLoading = useRef(true);
  const [channels, setChannels] = useState([]);
  const [mainData, setMainData] = useState();
  const [throttledData, setThrottledData] = useState();
  const prevState = useRef();
  const [sensorValueRange, setSensorValueRange] = useState({});
  const [prevTimeRange, setPrevTimeRange] = useState();
  const [prevSensorTimeDiff, setPrevSensorTimeDiff] = useState();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    initChannelsLoading.current = true;
    prevState.current = '';
    setLoading(true);
  }, [assetId]);

  useEffect(() => {
    async function fetchAllData() {
      // Get Min/Max value of sensor data
      const sensorData = await fetchDownHoleSensorData(
        provider,
        SOURCE_TYPE.high,
        assetId,
        traces.filter(item => item.trackType === TRACE_SOURCES.DOWNHOLE),
        sensorHeaderData
      );
      const combinedData = flatten(sensorData);
      const pressureMin = minBy(combinedData, item => item.data.pressure)?.data?.pressure;
      const pressureMax = maxBy(combinedData, item => item.data.pressure)?.data?.pressure;
      const tempMin = minBy(combinedData, item => item.data.temperature)?.data?.temperature;
      const tempMax = maxBy(combinedData, item => item.data.temperature)?.data?.temperature;
      setSensorValueRange({
        pressure: { min: pressureMin, max: pressureMax },
        temperature: { min: tempMin, max: tempMax },
      });

      // Update channels with Min/Max value of wits data
      const witsData = await fetchWitsData(
        SOURCE_TYPE.xhigh,
        assetId,
        traces.filter(trace => trace.trackType !== TRACE_SOURCES.DOWNHOLE)
      );

      const witsRanges = witsData[0]?.data
        ? Object.keys(witsData[0]?.data).reduce((acc, key) => {
            const min = minBy(witsData, item => item.data[key])?.data?.[key];
            const max = maxBy(witsData, item => item.data[key])?.data?.[key];
            acc[key] = max - min;
            return acc;
          }, {})
        : null;

      const sensorsData = await fetchDownHoleSensorData(
        provider,
        sourceType,
        assetId,
        traces.filter(trace => trace.trackType === TRACE_SOURCES.DOWNHOLE),
        sensorHeaderData,
        sensorTimeDiff,
        timeRange?.start ?? 0,
        timeRange?.end ?? Infinity
      );

      const sumData = convertSumData(
        witsData,
        sensorsData,
        witsRanges,
        tempMax - tempMin,
        pressureMax - pressureMin
      );

      setAllData(sumData);

      const newChannels = traces.map(trace => {
        if (trace.trackType === TRACE_SOURCES.DOWNHOLE) return trace;

        // Get min and max value by impperial unit
        const traceMin = minBy(witsData, item => item.data[trace.traceName])?.data?.[
          trace.traceName
        ];
        const traceMax = maxBy(witsData, item => item.data[trace.traceName])?.data?.[
          trace.traceName
        ];

        return {
          ...trace,
          minValue: trace.minValue ?? traceMin,
          maxValue: trace.maxValue ?? traceMax,
          traceMin,
          traceMax,
        };
      });

      onAppSettingChange('traces', newChannels);
      setChannels(newChannels);
    }

    if (
      assetId &&
      timeRange &&
      (initChannelsLoading.current ||
        !isEqual(prevTimeRange?.min, timeRange?.min) ||
        !isEqual(prevTimeRange?.max, timeRange?.max) ||
        !isEqual(prevSensorTimeDiff, sensorTimeDiff))
    ) {
      initChannelsLoading.current = false;
      setPrevTimeRange(timeRange);
      setPrevSensorTimeDiff(sensorTimeDiff);
      fetchAllData();
    }
  }, [assetId, traces, sensorHeaderData, timeRange, sensorTimeDiff]);

  useEffect(() => {
    async function fetchData(endTime, startTime) {
      const opacityValues = getOpacityRange(offsetWells.length);
      let isDataExists = false;
      const extendStartTime = startTime - (endTime - startTime) / 3;
      const extendEndTime = endTime + (endTime - startTime) / 3;

      const requests = offsetWells.map(async (well, idx) => {
        const [witsData, sensorData] = await Promise.all([
          await fetchWitsData(
            sourceType,
            well.id,
            traces.filter(trace => trace.trackType !== TRACE_SOURCES.DOWNHOLE),
            extendStartTime,
            extendEndTime
          ),
          await fetchDownHoleSensorData(
            provider,
            sourceType,
            assetId,
            traces.filter(trace => trace.trackType === TRACE_SOURCES.DOWNHOLE),
            sensorHeaderData,
            sensorTimeDiff,
            extendStartTime,
            extendEndTime
          ),
        ]);

        const sumData = convertSumLogData(witsData, sensorData);
        if (sumData.length) isDataExists = true;

        return {
          assetId: well.id,
          wellName: well.name,
          opacity: opacityValues[idx],
          wits: sumData.map(item => convertLogValue(item, traces)),
        };
      });
      const result = await Promise.all(requests);
      setMainData(isDataExists ? result : []);
      setThrottledData(isDataExists ? result : []);
      setIsDetailLoading(false);
      setIsFetching(false);
      if (onTimeAdjustment) {
        showSuccessNotification('Time adjustment is successful');
        setOnTimeAdjustment(false);
      }
      debouncedInitLoadedFunc(() => setLoading(false));
    }

    const state = JSON.stringify({
      sourceType,
      offsetWells,
      traces,
      timeRange,
      isResetZoom,
      sensorTimeDiff,
    });
    if (
      !initChannelsLoading.current &&
      timeRange &&
      sensorTimeDiff !== null &&
      (!isOverlay || !isResetZoom) &&
      prevState.current !== state &&
      !isFetching
    ) {
      prevState.current = state;
      setIsFetching(true);
      setIsDetailLoading(true);
      fetchData(timeRange.end, timeRange.start);
    }
  }, [
    sourceType,
    offsetWells,
    traces,
    isResetZoom,
    timeRange,
    isOverlay,
    isLive,
    sensorTimeDiff,
    sensorHeaderData,
  ]);

  useEffect(() => {
    if (isLive && !isEmpty(mainData) && !isEmpty(subData)) {
      const newMainData = cloneDeep(mainData);
      const index = newMainData.findIndex(item => item.assetId === subData[0].assetId);
      if (index !== -1) {
        newMainData[index].wits = newMainData[index].wits.concat(subData.map(item => item.data));
        setLastTimestamp(last(subData).data.timestamp);
      }
      setSubData([]);
      setMainData(newMainData);
      debouncedFunc(() => setThrottledData(newMainData));
    }
  }, [mainData, subData, isLive]);

  return [loading, allData, throttledData, channels, setChannels, sensorValueRange];
}
