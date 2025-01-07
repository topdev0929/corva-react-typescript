import { getAppStorage } from './index';

/**
 * Returns most recent wits record for given timestamp. Useful when you need to get depth, tf or something at certain point in time
 * @param {number} assetId Asset id
 * @param {string|number} time Either timestamp or time sting (the one that's being added to URL query by well timeline
 * @param {string[]} fields Wits fields to fetch
 * @returns {Promise<*>} Wits record
 */
export const fetchWitsAtTimestamp = async (assetId, time, fields = ['hole_depth', 'bit_depth']) => {
  const timestamp = typeof time === 'string' ? +new Date(time) / 1000 : time;

  const [record] = await getAppStorage('corva', 'wits', assetId, {
    aggregate: JSON.stringify([
      {
        $match: {
          asset_id: assetId,
          timestamp: {
            $lte: timestamp,
          },
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          timestamp: true,
          ...fields.reduce((memo, field) => ({ ...memo, [`data.${field}`]: true }), {}),
        },
      },
    ]),
  });
  return record;
};
