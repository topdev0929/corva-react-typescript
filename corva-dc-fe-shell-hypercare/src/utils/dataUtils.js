import { concat, first, flatten, get, isEmpty, range, round, sortBy } from 'lodash';
import {
  resolveActiveFracAsset,
  resolveActiveWirelineAsset,
  resolveActivePumpdownAsset,
} from '@corva/ui/utils/completion';
import { convertValue, getDefaultImperialUnit, getUnitDisplay } from '@corva/ui/utils';
import {
  EMPTY_STATE,
  HIGH_DIFF_SECONDS,
  LOW_DIFF_SECONDS,
  MEDIUM_DIFF_SECONDS,
  SOURCE_TYPE,
} from '~/constants';

export const resolveCurrentAssetByPadMode = (assets, padModeSetting) => {
  const { mode, selectedAssets } = padModeSetting;

  if (mode === 'pad') {
    // Note: first asset is the latest well by its stream last_updated_at
    return first(assets);
  } else if (mode === 'active_frac') {
    return resolveActiveFracAsset(assets);
  } else if (mode === 'active_wireline') {
    return resolveActiveWirelineAsset(assets);
  } else if (mode === 'active_pumpdown') {
    return resolveActivePumpdownAsset(assets);
  } else if (mode === 'custom') {
    const targetAssetId = first(selectedAssets);

    return assets.find(asset => Number(asset.id) === Number(targetAssetId));
  }

  return null;
};

export const getOpacityRange = n => {
  const min = 0.2;
  const max = 1.0;
  const values = range(n).map(i => round(min + (i / (n - 1)) * (max - min), 2));
  return values.reverse();
};

export const getSourceType = (startTime, endTime) => {
  if (!endTime) return SOURCE_TYPE.xhigh;

  const diff = endTime - startTime;
  if (diff > HIGH_DIFF_SECONDS) return SOURCE_TYPE.xhigh;
  else if (diff > MEDIUM_DIFF_SECONDS) return SOURCE_TYPE.high;
  else if (diff > LOW_DIFF_SECONDS) return SOURCE_TYPE.medium;
  else return SOURCE_TYPE.low;
};

export const getEmptyState = (data, timeRange) => {
  if (!timeRange || !isEmpty(data)) return '';
  if (timeRange.min === timeRange.start && timeRange.max === timeRange.end) {
    return EMPTY_STATE.noAsset;
  }
  return EMPTY_STATE.noDataAvailable;
};

export const convertToValue = (value, unitType, from, to) => {
  const imperialUnit = getDefaultImperialUnit(unitType);
  try {
    let imperialValue = value;
    if (from && from !== imperialUnit) {
      imperialValue = convertValue(value, unitType, from, imperialUnit);
    }
    return convertValue(imperialValue, unitType, imperialUnit, to);
  } catch (err) {
    return value;
  }
};

export const convertSumLogData = (witsData, sensorData) => {
  const data = concat(witsData, flatten(sensorData));
  const combined = sortBy(data, 'timestamp');

  // let minDiff;
  // if (sourceType === SOURCE_TYPE.low) minDiff = 600;
  // else if (sourceType === SOURCE_TYPE.medium) minDiff = 600;
  // else if (sourceType === SOURCE_TYPE.high) minDiff = 30 * 60;
  // else minDiff = 6 * 3600;
  // const sensorLen = sensorData.length - 1;
  // const startItem = minBy(witsData, _ => Math.abs(_.timestamp - sensorData[0].timestamp));
  // const startIndex = witsData.findIndex(item => get(item, '_id') === get(startItem, '_id'));
  // const endItem = minBy(witsData, _ => Math.abs(_.timestamp - sensorData[sensorLen].timestamp));
  // let endIndex = witsData.findIndex(item => get(item, '_id') === get(endItem, '_id'));
  // let sensorBreakpointIndex = -1;

  // if (Math.abs(witsData[startIndex].timestamp - sensorData[0].timestamp) > minDiff) {
  //   return [...witsData, ...sensorData];
  // }

  // if (Math.abs(witsData[endIndex].timestamp - sensorData[sensorLen].timestamp) > minDiff) {
  //   endIndex = witsData.length - 1;
  //   const matched = minBy(sensorData, _ => Math.abs(_.timestamp - witsData[endIndex].timestamp));
  //   sensorBreakpointIndex = sensorData.findIndex(item => get(item, '_id') === get(matched, '_id'));
  // }

  // let combined = witsData.slice(0, startIndex);
  // for (let idx = startIndex; idx < endIndex; idx += 1) {
  //   combined = combined.concat([
  //     {
  //       ...witsData[idx],
  //       data: {
  //         ...witsData[idx].data,
  //         ...(idx - startIndex <= sensorLen && sensorData[idx - startIndex].data),
  //       },
  //     },
  //   ]);
  // }

  // if (sensorBreakpointIndex !== -1) {
  //   combined = combined.concat(sensorData.slice(sensorBreakpointIndex));
  // } else {
  //   combined = combined.concat(witsData.slice(endIndex));
  // }

  return combined;
};

export const convertSumData = (
  witsData,
  sensorData,
  witsRanges,
  temperatureRange,
  pressureRange
) => {
  const flattenedData = flatten(sensorData);
  const formattedSensorData = flattenedData.map(item => {
    if (item?.data) {
      let dataObj;
      if (item.data.pressure && pressureRange && pressureRange !== 0) {
        dataObj = { ...item.data, pressure: item.data.pressure / pressureRange };
      } else if (item.data.temperature && temperatureRange && temperatureRange !== 0)
        dataObj = { ...item.data, temperature: item.data.temperature / temperatureRange };
      else dataObj = { ...item.data };

      delete dataObj.header_id;
      delete dataObj.timestamp;
      return { ...item, data: dataObj };
    }
    return item;
  });

  const formattedWitsData = witsData.map(item => {
    if (item?.data) {
      const dataObj = Object.entries(item.data).reduce((acc, [key, value]) => {
        return witsRanges[key] && witsRanges[key] !== 0
          ? {
              ...acc,
              [key]: value / witsRanges[key],
            }
          : { ...acc, [key]: value };
      }, {});
      return { ...item, data: dataObj };
    }
    return item;
  });

  const data = concat(formattedWitsData, formattedSensorData);
  const combined = sortBy(data, 'timestamp');

  return combined;
};

export const convertLogValue = (record, traces) => {
  const data = traces.reduce((acc, { traceName, unitType, unit }) => {
    const raw = record.data[traceName];
    const convertedValue = convertToValue(raw, unitType, getUnitDisplay(unitType), unit);
    return { ...acc, [traceName]: convertedValue, sensorId: record.data.header_id };
  }, {});

  return {
    _id: get(record, '_id'),
    timestamp: record.timestamp,
    data,
  };
};
