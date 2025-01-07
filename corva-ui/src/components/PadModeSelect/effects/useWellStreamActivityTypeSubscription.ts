import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { socketClient } from '~/clients';

import useWellStreamsData from './useWellStreamsData';
import { AssetStreamStatus, StreamDataItem } from '../types';
import { initialDataFetcher } from '../utils/initialDataFetcher';

const FRAC_SUBSCRIPTION = {
  provider: 'corva',
  collection: 'completion.wits',
  event: '',
  params: {
    fields: 'timestamp,collection,asset_id',
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};

const WIRELINE_SUBSCRIPTION = {
  provider: 'corva',
  collection: 'wireline.wits',
  event: '',
  params: {
    fields: 'timestamp,collection,asset_id,data.state',
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};

type StreamSubscriptionProps = {
  isStatusShown: boolean;
  currentWellId: number;
  withSubscription?: boolean;
};

// subscribe for completion.wits and wireline.wits live data
export function useWellStreamActivityTypeSubscription({
  currentWellId,
  isStatusShown,
  withSubscription,
}: StreamSubscriptionProps): AssetStreamStatus {
  const [wirelineData, setWirelineData] = useState<StreamDataItem>({ timestamp: 0 });
  const [fracData, setFracData] = useState<StreamDataItem>({ timestamp: 0 });

  const unsubscribeFunctions = useRef([]);

  const wellStreams = useWellStreamsData({
    isStatusShown,
    currentWellId,
    wirelineData,
    fracData,
  });

  const onDataReceive = ({ data: response }) => {
    const { collection, timestamp, data, stage_number: stageNumber } = response[0] || {};

    if (!timestamp) return;

    if (collection === WIRELINE_SUBSCRIPTION.collection) {
      setWirelineData(previousData => ({
        ...previousData,
        timestamp,
        stageNumber,
        data,
      }));
    } else if (collection === FRAC_SUBSCRIPTION.collection) {
      setFracData(previousData => ({ ...previousData, timestamp }));
    }
  };

  const subscribe = (assetId, subscriptionInfo) => {
    const subscription = { ...subscriptionInfo, assetId };
    const unsubscribe = socketClient.subscribe(subscription, { onDataReceive });
    unsubscribeFunctions.current.push(unsubscribe);
  };

  useLayoutEffect(() => {
    if (!currentWellId) {
      return;
    }

    const fetchInitialFrac = initialDataFetcher(FRAC_SUBSCRIPTION);
    const fetchInitialWireline = initialDataFetcher(WIRELINE_SUBSCRIPTION);

    const wellRequests = [
      fetchInitialFrac(currentWellId),
      fetchInitialWireline(currentWellId),
    ];
    
    if (withSubscription) {
      subscribe(currentWellId, FRAC_SUBSCRIPTION);
      subscribe(currentWellId, WIRELINE_SUBSCRIPTION);
    }

    Promise.all(wellRequests).then(response => {
      response.forEach(data => {
        onDataReceive({ data });
      });
    });

    // cleanup subscriptions for pad mode open/close 
    return () => {
      unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe());
      unsubscribeFunctions.current = [];
      setWirelineData({ timestamp: 0 });
      setFracData({ timestamp: 0 });
    };
  }, [currentWellId]);

  return wellStreams;
}
