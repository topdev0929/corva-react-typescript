import { jsonApi } from '@corva/ui/clients';

import { METADATA } from '../meta';

async function loadAssetWitsData(assetId) {
  const { provider, collections } = METADATA;
  let result;
  try {
    result = await jsonApi.getAppStorage(provider, collections.wits, assetId, {
      sort: '{timestamp: -1}',
      limit: 0,
    });
  } catch (e) {
    result = [];
  }

  return result;
}

export function fetchWitsData(wellIds) {
  const apiRequests = wellIds.map(wellId => loadAssetWitsData(wellId));
  return Promise.all(apiRequests);
}
