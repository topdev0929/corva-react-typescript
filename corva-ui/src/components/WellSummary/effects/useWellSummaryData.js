import { useEffect, useState } from 'react';
import { get, sortBy, omit } from 'lodash';
import { getAppStorage } from '~/clients/jsonApi';
import { DRILLING_WELL_SUMMARY, COMPLETION_WELL_SUMMARY } from '~/constants';
import { RIG_ACTIVITY_COLORS } from '~/constants/rigActivity';
import { DRILLOUT_WELL_SUMMARY } from '../../../constants';

async function fetchLast24RigActivities(assetIds) {
  const response = await Promise.all(
    assetIds.map(async assetId => {
      try {
        const response = await getAppStorage('corva', 'activities.summary-continuous', assetId, {
          fields: ['data.activities', 'data.start_timestamp', 'data.end_timestamp'].join(','),
          limit: 1,
          query: `{timestamp#lte#${Math.floor(Date.now() / 1000)}}`,
          sort: '{timestamp:-1}',
        });
        return (get(response, '0.data.activities') || []).map(item => ({
          ...item,
          duration: (item.day || 0) + (item.night || 0),
          color: RIG_ACTIVITY_COLORS[item.name],
        }));
      } catch (e) {
        console.error(e);
      }
      return [];
    })
  );
  const groupedData = {};
  response.forEach((data, index) => {
    groupedData[assetIds[index]] = data;
  });
  return groupedData;
}

async function fetchCompletionActivitySum(assetId, collection, timestamp, omitFields) {
  try {
    const res = await getAppStorage('corva', collection, assetId, {
      aggregate: JSON.stringify([
        {
          $match: {
            asset_id: assetId,
            timestamp: { $lte: timestamp, $gte: timestamp - 3600 * 24 },
          },
        },
        {
          $project: { _id: -1, stage_number: 1, data: 1, timestamp: 1 },
        },
        {
          $group: {
            _id: '$stage_number',
            timestamp: { $first: '$timestamp' },
            stage_number: { $last: '$stage_number' },
            first_data: { $first: '$data' },
            last_data: { $last: '$data' },
          },
        },
      ]),
    });

    let sum = 0;
    sortBy(res, 'timestamp').forEach((stage, index) => {
      if (index === 0) {
        const firstData = omit(get(stage, 'first_data'), omitFields);
        const lastData = omit(get(stage, 'last_data'), omitFields);
        Object.keys(lastData).forEach(activity => {
          sum += lastData[activity] - (firstData[activity] || 0);
        });
      } else {
        const lastData = omit(get(stage, 'last_data'), omitFields);
        Object.keys(lastData).forEach(activity => {
          sum += lastData[activity];
        });
      }
    });
    return sum;
  } catch (e) {
    console.error(e);
  }
  return 0;
}

async function fetchLast24CompletionActivities(assetIds) {
  const response = await Promise.all(
    assetIds.map(async assetId => {
      try {
        const [fracWits, wirelineWits] = await Promise.all([
          await getAppStorage('corva', 'completion.wits', assetId, {
            limit: 1,
            fields: 'timestamp',
          }),
          await getAppStorage('corva', 'wireline.wits', assetId, {
            limit: 1,
            fields: 'timestamp',
          }),
        ]);

        const fracTimestamp = get(fracWits, '0.timestamp');
        const wirelineTimestamp = get(wirelineWits, '0.timestamp');
        let timestamp = null;
        if (fracTimestamp && wirelineTimestamp) {
          timestamp = fracTimestamp > wirelineTimestamp ? fracTimestamp : wirelineTimestamp;
        } else if (fracTimestamp) {
          timestamp = fracTimestamp;
        } else if (wirelineTimestamp) {
          timestamp = wirelineTimestamp;
        }

        if (!timestamp) {
          return [];
        }

        const [fracSum, wirelineSum] = await Promise.all([
          fetchCompletionActivitySum(assetId, 'completion.activity.summary-stage', timestamp, [
            'activities',
          ]),
          fetchCompletionActivitySum(assetId, 'wireline.activity.summary-stage', timestamp, [
            'durations',
          ]),
        ]);

        return [
          {
            name: 'frac',
            duration: fracSum,
            color: '#7177FF',
          },
          {
            name: 'wireline',
            duration: wirelineSum,
            color: '#FF9C00',
          },
        ];
      } catch (e) {
        console.error(e);
      }
      return [];
    })
  );
  const groupedData = {};
  response.forEach((data, index) => {
    groupedData[assetIds[index]] = data;
  });
  return groupedData;
}

export function useWellSummaryData(assetIds, segment, summaryItems = null) {
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({});

  // NOTE: Will switch to v2/data/latest
  const [activityLoading, setActivityLoading] = useState(true);
  const [last24Activities, setLast24Activities] = useState({});

  const isDrillingSegment = segment === 'drilling';

  useEffect(() => {
    async function fetchWellSummary() {
      const validItems = (
        summaryItems ||
        Object.values(
          isDrillingSegment
            ? DRILLING_WELL_SUMMARY
            : // Drillout is actually a completions thing, but uses own type collection prefix;
              { ...COMPLETION_WELL_SUMMARY, ...DRILLOUT_WELL_SUMMARY }
        )
      ).filter(item => item.dataSource && item.dataSource.length);
      // NOTE: Extract all fields to fetch
      const allFields = [];
      validItems.forEach(item => {
        item.dataSource.forEach(({ provider, collection, fields }) => {
          if (provider && collection && fields && fields.length) {
            fields.forEach(field => allFields.push(`${provider}#${collection}.${field}`));
          } else if (collection) {
            allFields.push(collection);
          }
        });
      });
      allFields.push('well_id');

      try {
        const $match = { asset_id: { $in: assetIds } };
        const $project = allFields.reduce(
          (acc, item) => {
            acc[item] = 1;
            return acc;
          },
          { asset_id: 1 }
        );
        const queryJson = {
          aggregate: JSON.stringify([{ $match }, { $project }]),
        };

        const wellSummaryResponse = await getAppStorage('corva', 'well_cache', null, queryJson);

        // NOTE: Group data by asset_id, summary item (collection name)
        const groupedData = {};
        wellSummaryResponse.forEach(assetData => {
          const { asset_id } = assetData;
          groupedData[asset_id] = assetData;
        });
        setSummaryData(groupedData);
      } catch (e) {
        console.error(e);
      }
      setSummaryLoading(false);
    }

    async function fetchActivities() {
      try {
        const activityRes =
          segment === 'drilling'
            ? await fetchLast24RigActivities(assetIds)
            : await fetchLast24CompletionActivities(assetIds);
        setLast24Activities(activityRes);
      } catch (e) {
        console.error(e);
      }
      setActivityLoading(false);
    }

    setSummaryLoading(true);
    setActivityLoading(true);
    fetchWellSummary();
    fetchActivities();
  }, []);

  return [summaryLoading || activityLoading, summaryData, last24Activities];
}
