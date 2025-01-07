import { jsonApi } from '@corva/ui/clients';

import { METADATA } from '../meta';

export async function loadAssetWitsData(assetId) {
  const { provider, collections } = METADATA;
  let result;
  try {
    result = await jsonApi.getAppStorage(provider, collections.wits, assetId, {
      sort: '{timestamp: 1}',
      limit: 1,
    });
  } catch (e) {
    result = [];
  }

  return result;
}

export async function loadAssetStageTimesData(assetId, limit = 1000) {
  const { provider, collections } = METADATA;
  let result;
  try {
    result = await jsonApi.getAppStorage(provider, collections.stageTimes, assetId, {
      sort: '{stage_number: 1}',
      limit,
    });
  } catch (e) {
    result = [];
  }

  return result;
}
