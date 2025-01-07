import { corvaDataAPI, jsonApi } from '@corva/ui/clients';

import { difference, groupBy, mapKeys, omit } from 'lodash';
import { COLLECTIONS, DATASET, DEFAULT_SENSOR_SERIES, SOURCE_TYPE } from '~/constants';

export const fetchDownHoleSensorHeaderData = async (provider, assetId) => {
  try {
    const response = await corvaDataAPI.get(
      `/api/v1/data/${provider}/downhole.sensor.data.header/`,
      {
        sort: JSON.stringify({
          timestamp: -1,
        }),
        query: JSON.stringify({
          asset_id: assetId,
        }),
        limit: 100,
      }
    );

    return response.length ? response : null;
  } catch (e) {
    return null;
  }
};

export const delDownHoleSensorHeaderData = async (provider, headerId) => {
  try {
    return await corvaDataAPI.del(
      `/api/v1/data/${provider}/downhole.sensor.data.header/${headerId}/`
    );
  } catch (e) {
    return null;
  }
};

export const fetchDownHoleSensorData = async (
  provider,
  sourceType,
  assetId,
  channels,
  sensorHeaderData,
  sensorTimeDiff,
  startTime = null,
  endTime = null
) => {
  try {
    if (channels.length === 0) return [];
    const fieldsMap = channels.map(
      channel => `data.${channel.traceName}${sourceType !== SOURCE_TYPE.low ? '_mean' : ''}`
    );

    let query = [];
    if (startTime && endTime) {
      sensorHeaderData.forEach(header => {
        if (channels.findIndex(channel => channel.sensorId === header.id) !== -1) {
          query.push({
            $and: [
              { 'data.header_id': header.id },
              {
                'data.timestamp': {
                  $gte: startTime - (sensorTimeDiff[header.id] ?? 0),
                  $lte: endTime - (sensorTimeDiff[header.id] ?? 0),
                },
              },
            ],
          });
        }
      });
      query = { $or: query };
    } else {
      query = {};
    }

    const response = await corvaDataAPI.get(
      `/api/v1/data/${provider}/${DATASET[sourceType].sensor}/`,
      {
        sort: JSON.stringify({
          timestamp: 1,
        }),
        query: JSON.stringify({
          asset_id: assetId,
          ...query,
        }),
        fields: `data.timestamp,data.header_id,${fieldsMap.join(',')}`,
        limit: 10000,
      }
    );

    let transformedData;
    if (sourceType === SOURCE_TYPE.low) {
      transformedData = response;
    } else {
      transformedData = response.map(item => {
        const newData = mapKeys(item.data, (value, key) => {
          if (key === 'pressure_mean') return 'pressure';
          if (key === 'temperature_mean') return 'temperature';
          return key;
        });

        return {
          ...item,
          data: newData,
        };
      });
    }

    const allTraceNames = DEFAULT_SENSOR_SERIES.map(item => item.traceName);
    const nonAddedTraces = [];
    sensorHeaderData?.forEach(head => {
      const traces = channels.filter(c => c.sensorName === head.sensorName).map(c => c.traceName);
      const nonAddedTraceNames = difference(allTraceNames, traces);
      if (nonAddedTraceNames.length) {
        nonAddedTraces.push({ ...head, traceNames: nonAddedTraceNames });
      }
    });

    transformedData = response.map(item => {
      let newData = mapKeys(item.data, (value, key) => {
        if (key === 'pressure_mean') return 'pressure';
        if (key === 'temperature_mean') return 'temperature';
        return key;
      });

      const nonAddedTrace = nonAddedTraces.find(
        _ =>
          _.id === item.data.header_id &&
          _.minTimestamp <= item.data.timestamp &&
          item.data.timestamp <= _.maxTimestamp + 1
      );
      if (nonAddedTrace) {
        newData = omit(newData, nonAddedTrace.traceNames);
      }

      return {
        ...item,
        timestamp: item.data.timestamp + (sensorTimeDiff?.[item.data.header_id] ?? 0),
        data: newData,
      };
    });

    const grouped = groupBy(transformedData, 'data.header_id');
    const sensorData = channels.map(channel => {
      const headerId = sensorHeaderData.find(item => item.sensorName === channel.sensorName).id;
      return grouped[headerId] ?? [];
    });

    return sensorData;
  } catch (e) {
    return null;
  }
};

export async function fetchSensorAdjustment(provider, assetId) {
  try {
    const response = await jsonApi.getDataAppStorage(
      provider,
      COLLECTIONS.downholeSensorAdjustment.collection,
      {
        sort: JSON.stringify({
          timestamp: -1,
        }),
        query: JSON.stringify({
          asset_id: assetId,
        }),
        limit: 1,
      }
    );

    return response?.[0] ?? null;
  } catch (err) {
    return null;
  }
}

export async function postSensorAdjustment(provider, record) {
  try {
    return await jsonApi.postDataAppStorage(
      provider,
      `${COLLECTIONS.downholeSensorAdjustment.collection}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function putSensorAdjustment(provider, id, record) {
  try {
    return await corvaDataAPI.patch(
      `/api/v1/data/${provider}/${COLLECTIONS.downholeSensorAdjustment.collection}/${id}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}
