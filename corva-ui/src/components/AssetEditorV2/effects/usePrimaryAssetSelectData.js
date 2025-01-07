import { useEffect, useState } from 'react';
import { isEmpty, uniqBy } from 'lodash';
import { jsonApi } from '~/clients';
import { jsonaDataFormatter } from '~/utils/jsonaDataFormatter';
import { PER_PAGE } from '~/components/AssetEditor/constants';
import { ASSET_TYPES } from '~/constants';
import { formatAsset, getRequestOptions, sortAsset } from '../utils';

export function usePrimaryAssetSelectData({
  appKey,
  assetType,
  company,
  groups,
  isRequiredAssetId,
  parentAssetId,
  parentAssetType,
  searchValue,
  assetFields,
  currentValue,
  setCurrentOption,
  scrollPage,
  onActiveAssetIdChange,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const assetFieldsByAssetType =
    assetType === ASSET_TYPES.pad.type
      ? [...assetFields, 'pad.active', 'pad.parent_frac_fleet_id']
      : assetFields;

  const loadAssets = async group => {
    try {
      const currentAssetType = group?.type || assetType;
      setLoading(true);
      const requestParams = { per_page: PER_PAGE, page: scrollPage };
      if (parentAssetType && parentAssetId) requestParams[parentAssetType] = parentAssetId;
      if (company) requestParams.company = company;
      if (searchValue) requestParams.search = searchValue;
      if (appKey) requestParams.app_key = appKey;

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

      setAssets(prevState => uniqBy([...prevState, ...responseAssets], 'id'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentOption = async () => {
    let response = await jsonApi.mapAssetGetRequest(assetType)({
      ...getRequestOptions(assetType, assetFieldsByAssetType),
      ids: currentValue,
    });
    if (isEmpty(response.data)) {
      // NOTE: Try fetch current option from v2/assets
      response = await jsonApi.getAssets({
        ...getRequestOptions(assetType, assetFieldsByAssetType),
        ids: currentValue,
      });
    }
    const deserializedResponse = jsonaDataFormatter.deserialize(response);
    const formattedAsset = formatAsset({
      asset: deserializedResponse[0],
      isPrimaryAsset: true,
    });

    setCurrentOption(formattedAsset);
    if (assetType === ASSET_TYPES.rig.type) {
      onActiveAssetIdChange(formattedAsset?.activeWellId);
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
  }, [
    assetType,
    parentAssetType,
    parentAssetId,
    company,
    appKey,
    groups?.length,
    searchValue,
    scrollPage,
  ]);

  useEffect(() => {
    if (currentValue) {
      loadCurrentOption();
    }
  }, []);

  return { assets, loading };
}
