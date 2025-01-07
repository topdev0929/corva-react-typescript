import { useEffect, useState, useRef } from 'react';
import { isEmpty } from 'lodash';
import { jsonApi } from '~/clients';

import { PER_PAGE } from '../constants';

const getRequestOptions = (assetType, assetFields = []) => ({
  sort: 'name',
  order: 'asc',
  fields: [`${assetType}.name`, `${assetType}.asset_id`, ...assetFields],
});

const deserializeAsset = asset => ({
  ...asset.attributes,
  id: +asset.id,
  programId: +asset.relationships?.program?.data?.id,
});

export function useAssetSelectData({
  appKey,
  assetType,
  assetId,
  parentAssetType,
  parentAssetId,
  queryParams,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function loadAssets() {
      const response = await jsonApi.mapAssetGetRequest(assetType)({
        ...getRequestOptions(assetType),
        per_page: 10000,
        [parentAssetType]: parentAssetId,
        ...(appKey && { app_key: appKey }),
        ...queryParams,
      });

      setAssets(response.data.map(deserializeAsset));
      setLoading(false);
    }
    loadAssets();
  }, [assetType, assetId, parentAssetType, parentAssetId, appKey]);

  return { assets, loading };
}

export function useAssetAutoCompleteSelectData({
  appKey,
  assetType,
  companyId,
  currentValue,
  isMultiple,
  parentAssetId,
  parentAssetType,
  scrollPage,
  searchText,
  setCurrentOption,
  queryParams,
  assetFields,
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const previousTypeRef = useRef();
  const lastLoadAssetsReqPromise = useRef();

  // NOTE: Fetch currently selected option
  useEffect(() => {
    async function loadCurrentOption() {
      let response = await jsonApi.mapAssetGetRequest(assetType)({
        ...getRequestOptions(assetType, assetFields),
        ids: isMultiple ? currentValue : [currentValue],
        ...queryParams,
      });
      if (isEmpty(response.data)) {
        // NOTE: Try fetch current option from v2/assets
        response = await jsonApi.getAssets({
          ...getRequestOptions(assetType, assetFields),
          ids: isMultiple ? currentValue : [currentValue],
          ...queryParams,
        });
      }

      setCurrentOption(() => {
        if (isMultiple) return response.data.map(deserializeAsset);
        const option = response.data[0];
        return option ? deserializeAsset(option) : null;
      });
    }
    if (isMultiple ? currentValue.length : currentValue) loadCurrentOption();
  }, []);

  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true);
        const requestParams = { per_page: PER_PAGE, page: scrollPage };
        if (parentAssetType && parentAssetId) requestParams[parentAssetType] = parentAssetId;
        if (companyId) requestParams.company = companyId;
        if (searchText) requestParams.search = searchText;
        if (appKey) requestParams.app_key = appKey;

        const requestPromise = jsonApi.mapAssetGetRequest(assetType)({
          ...getRequestOptions(assetType, assetFields),
          ...requestParams,
          ...queryParams,
        });

        lastLoadAssetsReqPromise.current = requestPromise;
        const response = await requestPromise;

        if (lastLoadAssetsReqPromise.current !== requestPromise) {
          return;
        }

        const responseAssets = response.data.map(deserializeAsset);
        const isPaginationDisabled = previousTypeRef.current !== assetType || scrollPage === 1;

        setAssets(
          isPaginationDisabled ? responseAssets : prevState => prevState.concat(responseAssets)
        );

        previousTypeRef.current = assetType;
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadAssets();
  }, [assetType, parentAssetType, parentAssetId, companyId, searchText, scrollPage, appKey]);

  return { assets, loading };
}
