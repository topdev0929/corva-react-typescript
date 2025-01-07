import { useMemo } from 'react';
import { useSubscriptions } from '@corva/ui/effects';

const activitiesUpdateSubscription = {
  provider: 'corva',
  collection: 'completion.activity.summary-stage',
  event: 'update',
  params: {
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};
const activitiesCreateSubscription = {
  provider: 'corva',
  collection: 'completion.activity.summary-stage',
  event: '',
  params: {
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};

// NOTE: Subscribe to activity collections used in the app
export function useActivitySubscriptions(currentAsset, queryTimestamp, isAssetViewer) {
  const assetIds = isAssetViewer !== false ? [] : [currentAsset.asset_id];

  const activityUpdateSubscriptions = assetIds.map(assetId => ({
    assetId,
    ...activitiesUpdateSubscription,
  }));
  const activityCreateSubscriptions = assetIds.map(assetId => ({
    assetId,
    ...activitiesCreateSubscription,
  }));

  const assetsUpdateSubData = useSubscriptions(activityUpdateSubscriptions, {
    timestamp: queryTimestamp,
    isOldApiUsed: true,
  });
  const assetsCreateSubData = useSubscriptions(activityCreateSubscriptions, {
    timestamp: queryTimestamp,
    isOldApiUsed: true,
  });

  const createActivitySubData = useMemo(() => {
    return assetsCreateSubData.map(({ data }) => data && data[0]);
  }, [assetsCreateSubData]);

  const updateActivitySubData = useMemo(() => {
    return assetsUpdateSubData.map(({ data }) => data && data[0]);
  }, [assetsUpdateSubData]);

  return { createActivitySubData, updateActivitySubData };
}
