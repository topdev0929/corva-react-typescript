/* eslint-disable no-unreachable */
import { useEffect, useMemo, useState } from 'react';
import { corvaAPI, socketClient } from '@corva/ui/clients';
import { get, uniq } from 'lodash';
import { convertAbraItem } from '@/utils/conversionUtils';
import { getAbraKeyForAssetName } from '@/utils/dataUtils';
import { METADATA } from '@/meta';

const subscription = {
  provider: 'corva',
  collection: METADATA.collections.abra,
  event: '',
  params: {
    limit: 1000,
    sort: '{ timestamp: -1 }',
  },
};

const fetchAbraAssets = async companyId => {
  let result = [];

  if (!companyId) {
    return result;
  }

  try {
    result =
      (await corvaAPI.get(`/v1/data/corva/${METADATA.collections.abraMetadata}`, {
        company_id: companyId,
        limit: 1000,
      })) || [];
  } catch (error) {
    console.error(error);
  }

  return uniq(result.map(item => item.asset_id));
};

export const fetchWells = async (companyId, assetIds) => {
  let result = [];

  if (!assetIds.length) {
    return result;
  }

  try {
    const params = {
      company_id: companyId,
      ids: assetIds,
      types: ['well'],
      fields: ['asset.name'],
    };
    result = await corvaAPI.get('/v2/assets', params);
  } catch (error) {
    console.error(error);
  }

  return result;
};

export function useAbraData({ fracFleet, well, padId, dataSetting, appRtValuessetSetting }) {
  const [subData, setSubData] = useState(null);
  const [assets, setAssets] = useState({});
  const [channels, setChannels] = useState([]);
  const wells = useMemo(() => Object.keys(assets).map(n => Number(n)), [assets]);
  const subWells = wells.filter(assetId => {
    const key = assets[assetId].key;
    return dataSetting.selectedOffsetPressure.includes(key) || appRtValuessetSetting.includes(key);
  });
  let companyId = null;
  if (fracFleet) {
    const selectedPadId = fracFleet.current_pad_id || padId;
    const selectedPad = fracFleet.pad_frac_fleets.find(({ pad }) => pad.id === selectedPadId)?.pad;
    companyId = get(selectedPad, 'company_id');
  } else if (well) {
    companyId = get(well, ['companyId']);
  }

  useEffect(() => {
    if (!companyId) {
      return;
    }
    let update = true;
    fetchAbraAssets(companyId)
      .then(result => fetchWells(companyId, result))
      .then(({ data }) => {
        if (!update || !data) return;
        const newAssets = data.reduce(
          (acc, { id, attributes }) => ({
            ...acc,
            [id]: {
              ...attributes,
              key: getAbraKeyForAssetName(attributes.name),
              data: [],
            },
          }),
          {}
        );
        const newChannels = data.reduce(
          (acc, { attributes }) => ({
            ...acc,
            [getAbraKeyForAssetName(attributes.name)]: undefined,
          }),
          {}
        );
        setAssets(assets => ({
          ...assets,
          ...newAssets,
        }));
        setChannels(data => ({
          ...data,
          ...newChannels,
        }));
      });

    return () => {
      update = false;
    };
  }, [companyId]);

  const updateByItem = (key, item) => {
    setChannels(data => ({
      ...data,
      [key]: item.pressure,
    }));
  };

  useEffect(() => {
    const subscriptions = [];

    subWells.forEach(assetId => {
      if (!assets[assetId]) return;
      if (!assetId) return;

      const onDataReceive = event => {
        // NOTE: Accept subscription only for active
        const item = convertAbraItem(event.data[0]);
        updateByItem(assets[assetId].key, item);
        setSubData(item);
      };

      subscriptions.push(socketClient.subscribe({ ...subscription, assetId }, { onDataReceive }));
    });

    // NOTE: Unsubscribe to prevent memory leaks in your app
    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
      setSubData([]);
    };
  }, [subWells.join(), Object.keys(assets).join(), subscription]);

  const abraWells = useMemo(
    () =>
      wells.map(assetId => ({
        assetId,
        name: assets[assetId].name,
        key: getAbraKeyForAssetName(assets[assetId].name),
      })),
    [wells.join(), assets]
  );

  return { wells: abraWells, subData, channels };
}

export default useAbraData;
