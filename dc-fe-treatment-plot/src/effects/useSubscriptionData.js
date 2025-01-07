import { useEffect, useState, useMemo } from 'react';
import { socketClient } from '@corva/ui/clients';
import { noop } from 'lodash';

import {
  convertFullWitItem,
  convertFullPredictionItem,
  convertTrackingItem,
} from '../utils/conversionUtils';
import { initialDataFetcher } from '../utils/initialDataFetcher';

// NOTE: All app subscription info
const [witsSubscription, predictionsSubscription, trackingSubscription] = [
  {
    provider: 'corva',
    collection: 'completion.wits',
    event: '',
    params: {
      limit: 1,
      sort: '{ timestamp: -1 }',
    },
  },
  {
    provider: 'corva',
    collection: 'completion.predictions',
    event: 'update',
    params: {
      limit: 1,
      sort: '{ timestamp: -1 }',
    },
  },
  {
    provider: 'corva',
    collection: 'completion.tracking',
    event: 'update',
    params: {
      limit: 100,
      sort: '{ timestamp: -1 }',
    },
  },
];

// NOTE: Subcribe to collections with initial data fetch
export function useASubscription(assetId, endTimestamp, subscriptionInfo, returnEmptyData = false) {
  const [loading, setLoading] = useState(true);
  const [subData, setSubData] = useState([]);

  useEffect(() => {
    if (returnEmptyData || returnEmptyData === null) {
      setLoading(false);
      return;
    }
    let unsubscribe = noop;

    setLoading(true);

    // NOTE: Subscribe along with initial data fetch
    const fetchInitialData = initialDataFetcher(subscriptionInfo);
    if (!assetId) return;
    fetchInitialData(assetId, endTimestamp).then(res => {
      setSubData(res);
      setLoading(false);

      const onDataReceive = event => {
        // NOTE: Accept subscription only for active
        if (!endTimestamp) {
          setSubData(event.data || []);
        }
      };

      const subscription = { ...subscriptionInfo, assetId }; // Subscription params
      unsubscribe = socketClient.subscribe(subscription, { onDataReceive });
    });

    // NOTE: Unsubscribe to prevent memory leaks in your app
    return () => unsubscribe();
  }, [assetId, endTimestamp, subscriptionInfo]);

  return [loading, subData];
}

// NOTE: Subscribe to all collections used in the app
export function useAppSubscriptions(currentAsset, queryTimestamp, appScaleSetting, isAssetViewer) {
  const assetId = currentAsset?.asset_id;

  const [isWitsSubLoading, witsSubData] = useASubscription(
    assetId,
    queryTimestamp,
    witsSubscription
  );
  const [isPredictionSubLoading, predictionsSubData] = useASubscription(
    assetId,
    queryTimestamp,
    predictionsSubscription,
    isAssetViewer
  );
  const [isTrackingSubLoading, trackingSubData] = useASubscription(
    assetId,
    queryTimestamp,
    trackingSubscription,
    isAssetViewer
  );

  const convertedWitsSubData = useMemo(() => {
    const allSeriesTypes = appScaleSetting.reduce((result, setting) => {
      return [...result, ...setting.series];
    }, []);

    if (!witsSubData.length) return {};
    return convertFullWitItem(witsSubData[0], allSeriesTypes);
  }, [witsSubData, appScaleSetting]);

  const convertedPredictionsData = useMemo(() => {
    if (!predictionsSubData.length) return {};
    return convertFullPredictionItem(predictionsSubData[0]);
  }, [predictionsSubData]);

  const convertedTrackingSubData = useMemo(() => {
    if (!trackingSubData[0]) return {};
    return convertTrackingItem(trackingSubData[0]);
  }, [trackingSubData]);

  return {
    loading: isWitsSubLoading || isPredictionSubLoading || isTrackingSubLoading,
    witsSubData: witsSubData[0],
    predictionsSubData: predictionsSubData[0],
    trackingSubData: trackingSubData[0],
    convertedWitsSubData,
    convertedPredictionsData,
    convertedTrackingSubData,
  };
}
