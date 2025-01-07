import { getAppStorage } from '@corva/ui/clients/jsonApi';
import { COLLECTIONS, DATASET } from '~/constants';

export const fetchSubWits = async (assetId, witsSource) => {
  try {
    const { provider } = COLLECTIONS.witsLastData;
    const result = await getAppStorage(provider, DATASET[witsSource].wits, assetId, { limit: 1 });

    if (result.length > 0) return result[0];
    return null;
  } catch (e) {
    return null;
  }
};

export const loadWitsChannels = async assetId => {
  const provider = 'corva';
  const collection = 'wits.summary-6h';

  const stages = [
    { $match: { asset_id: assetId } },
    { $project: { data: { $objectToArray: '$data' } } },
    { $unwind: '$data' },
    { $group: { _id: null, channels: { $addToSet: '$data.k' } } },
  ];
  const params = { aggregate: JSON.stringify(stages) };

  try {
    const records = await getAppStorage(provider, collection, assetId, params);
    return records?.[0]?.channels ?? [];
  } catch (e) {
    return [];
  }
};

export const fetchLastWit = async assetId => {
  try {
    const { provider, collection, params } = COLLECTIONS.witsLastData;
    const result = await getAppStorage(provider, collection, assetId, params);

    if (result.length > 0) return result[0];
    return null;
  } catch (e) {
    return null;
  }
};

export const fetchFirstWit = async assetId => {
  try {
    const { provider, collection, params } = COLLECTIONS.witsFirstData;
    const result = await getAppStorage(provider, collection, assetId, params);

    if (result.length > 0) return result[0];
    return null;
  } catch (e) {
    return null;
  }
};

export const fetchWitsData = async (sourceType, assetId, channels, startTime, endTime) => {
  try {
    if (channels.length === 0) return [];

    const { provider, params } = COLLECTIONS.wits;

    let query;
    if (startTime && endTime) {
      query = `{timestamp#gte#${startTime}}AND{timestamp#lte#${endTime}}`;
    } else {
      query = '';
    }

    const channelFields = channels.map(channel => `data.${channel.traceName}`).join(',');
    const extendedParams = {
      ...params,
      query,
      fields: `timestamp,${channelFields}`,
    };
    const result = await getAppStorage(provider, DATASET[sourceType].wits, assetId, extendedParams);
    return result;
  } catch (e) {
    return null;
  }
};
