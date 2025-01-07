import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { jsonApi } from '~/clients';
import { jsonaDataFormatter } from '~/utils/jsonaDataFormatter';
import { ASSET_TYPES } from '~/constants';
import { formatAsset, getRequestOptions, sortAsset } from '../utils';

export function useSecondaryAssetSelectData({
  appKey,
  assetType,
  assetId,
  company,
  parentAssetType,
  parentAssetId,
  queryParams,
  assetFields,
  activeWellId,
  isRequiredAssetId,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function loadAssets() {
      const response = await jsonApi.mapAssetGetRequest(assetType)({
        ...getRequestOptions(assetType, assetFields),
        per_page: 10000,
        company,
        [parentAssetType]: parentAssetId,
        ...(appKey && { app_key: appKey }),
        ...queryParams,
      });

      const deserializedResponse = jsonaDataFormatter.deserialize(response);

      setAssets(
        deserializedResponse
          .map(asset => formatAsset({ asset, activeWellId, isRequiredAssetId }))
          .sort(sortAsset)
      );
      setLoading(false);
    }
    loadAssets();
  }, [assetType, assetId, parentAssetType, parentAssetId, appKey, activeWellId, company]);

  return { assets, loading };
}

export function usePrimaryAssetSelectData({
  appKey,
  assetType,
  company,
  groups,
  isRequiredAssetId,
  parentAssetId,
  parentAssetType,
  searchText,
  assetFields,
  currentValue,
  setCurrentOption,
  onActiveAssetIdChange,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAssets = async group => {
    try {
      const currentAssetType = group?.type || assetType;
      setLoading(true);
      const requestParams = { per_page: 10000 };
      if (parentAssetType && parentAssetId) requestParams[parentAssetType] = parentAssetId;
      if (company) requestParams.company = company;
      if (searchText) requestParams.search = searchText;
      if (appKey) requestParams.app_key = appKey;

      const assetFieldsByAssetType =
        currentAssetType === ASSET_TYPES.pad.type
          ? [...assetFields, 'pad.active', 'pad.parent_frac_fleet_id']
          : assetFields;

      const requestPromise = jsonApi.mapAssetGetRequest(currentAssetType)({
        ...getRequestOptions(currentAssetType, assetFieldsByAssetType),
        ...requestParams,
      });

      const response = await requestPromise;
      const deserializedResponse = jsonaDataFormatter.deserialize(response);

      const responseAssets = deserializedResponse
        .map(asset =>
          formatAsset({ asset, group: group?.name, isRequiredAssetId, isPrimaryAsset: true })
        )
        .sort(sortAsset);

      setAssets(prevState => [...prevState, ...responseAssets]);
      if (currentValue && currentAssetType === assetType) {
        const currentAsset = responseAssets.find(
          asset => currentValue === asset.id || (asset.assetId && currentValue === asset.assetId)
        );
        if (!isEmpty(currentAsset)) {
          setCurrentOption(currentAsset);
        }

        if (currentAssetType === ASSET_TYPES.rig.type) {
          onActiveAssetIdChange(currentAsset?.activeWellId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (company) {
      setAssets([]);
    }
  }, [company]);

  useEffect(() => {
    if (groups) {
      groups.forEach(group => {
        loadAssets(group);
      });
      return;
    }
    loadAssets();
  }, [assetType, parentAssetType, parentAssetId, company, appKey, groups?.length]);

  return { assets, loading };
}
