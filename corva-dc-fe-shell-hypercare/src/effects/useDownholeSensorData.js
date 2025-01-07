import { useEffect, useRef, useState } from 'react';
import { get, omit } from 'lodash';
import {
  fetchDownHoleSensorHeaderData,
  fetchSensorAdjustment,
  postSensorAdjustment,
  putSensorAdjustment,
} from '~/api/sensor';

export function useDownHoleSensorData(provider, assetId, companyId) {
  const [sensorDataChangeToggle, setSensorDataChangeToggle] = useState(false);
  const [sensorHeaderData, setSensorHeaderData] = useState(null);
  const [sensorTimeDiff, setSensorTimeDiff] = useState(null);
  const sensorAdjustmentRecordId = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchDownHoleSensorHeaderData(provider, assetId);
      if (response) {
        setSensorHeaderData(
          response.map(item => ({
            id: get(item, '_id'),
            sensorName: item.data.sensor_name,
            minTimestamp: item.data.min_timestamp,
            maxTimestamp: item.data.max_timestamp,
          }))
        );
      }
    };

    if (assetId && provider) {
      setSensorHeaderData(null);
      fetchData();
    }
  }, [provider, assetId, sensorDataChangeToggle]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchSensorAdjustment(provider, assetId);
      if (response) {
        setSensorTimeDiff(omit(response.data, 'time_diff'));
        sensorAdjustmentRecordId.current = get(response, '_id');
      } else {
        setSensorTimeDiff({});
      }
    };

    if (assetId) {
      fetchData();
    }
  }, [provider, assetId]);

  const saveSensorTimeAdjustment = (timeDiff, sensorId) => {
    const newTimeDiff = {
      ...sensorTimeDiff,
      [sensorId]: timeDiff ? timeDiff + (sensorTimeDiff[sensorId] ?? 0) : 0,
    };
    const record = {
      version: 1,
      asset_id: assetId,
      company_id: companyId,
      timestamp: Math.round(new Date().getTime() / 1000),
      data: Object.keys(newTimeDiff).reduce(
        (acc, key) => ({
          ...acc,
          [key]: newTimeDiff[key],
        }),
        {}
      ),
    };
    if (sensorAdjustmentRecordId.current) {
      putSensorAdjustment(provider, sensorAdjustmentRecordId.current, record);
    } else {
      postSensorAdjustment(provider, [record]);
    }
    setSensorTimeDiff(newTimeDiff);
  };

  return [sensorHeaderData, sensorTimeDiff, saveSensorTimeAdjustment, setSensorDataChangeToggle];
}
