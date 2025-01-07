import { useEffect, useState, useRef } from 'react';
import { socketClient } from '@corva/ui/clients';

import { initialDataFetcher } from '@/utils/initialDataFetcher';
import { StreamData, AssetStreamStatus, Well } from '@/types/Stream';
import useWellStreamsData from './useWellStreamsData';
import useActiveWells from './useActiveWells';

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
    fields: 'timestamp,collection,asset_id,stage_number,data.measured_depth,data.state',
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};

const WIRELINE_ACTIVITY_SUBSCRIPTION = {
  provider: 'corva',
  collection: 'wireline.activity.summary-stage',
  event: '',
  params: {
    fields: 'timestamp,collection,asset_id,stage_number,data',
    limit: 1,
    sort: '{ timestamp: -1 }',
  },
};

type StreamSubscriptionProps = {
  isAssetDashboard: boolean;
  isPadMode: boolean;
  showStreamboxStatus: boolean;
  isLive: boolean;
  currentWellId: number;
  selectedWells: Well[];
  latestWits: {
    timestamp: number;
  };
};

// subscribe for completion.wits and wireline.wits live data
// latestWits is used to prevent double subscription for selected asset
export function useWellsStreamSubscription(props: StreamSubscriptionProps): AssetStreamStatus[] {
  const { latestWits, currentWellId, isLive, showStreamboxStatus } = props;
  const selectedWells = useActiveWells(props);

  const [wirelineData, setWirelineData] = useState<StreamData>({});
  const [wirelineActivityData, setWirelineActivityData] = useState<StreamData>({});
  const [fracData, setFracData] = useState<StreamData>({});

  const unsubscribeFunctions = useRef([]);
  const wellIds = selectedWells.map(well => well.asset_id);

  const wellStreams = useWellStreamsData({
    wellIds,
    currentWellId,
    fracData,
    wirelineData,
    wirelineActivityData,
    isLive,
    latestWits,
  });

  const onDataReceive = ({ data: response }) => {
    const { collection, asset_id, timestamp, data, stage_number: stageNumber } = response[0] || {};
    if (!timestamp) return;

    if (collection === FRAC_SUBSCRIPTION.collection) {
      setFracData(previousData => {
        const prevTimestamp = previousData[asset_id]?.timestamp;

        return {
          ...previousData,
          [asset_id]: {
            timestamp: Math.max(Number.isInteger(prevTimestamp) ? prevTimestamp : 0, timestamp),
          },
        };
      });
    } else if (collection === WIRELINE_SUBSCRIPTION.collection) {
      setWirelineData(previousData => ({
        ...previousData,
        [asset_id]: { timestamp, stageNumber, data },
      }));
    } else {
      setWirelineActivityData(previousData => ({
        ...previousData,
        [asset_id]: { timestamp, stageNumber, data },
      }));
    }
  };

  // WS realtime subscription
  const subscribe = (assetId, subscriptionInfo) => {
    const subscription = { ...subscriptionInfo, assetId };
    const unsubscribe = socketClient.subscribe(subscription, { onDataReceive });
    unsubscribeFunctions.current.push(unsubscribe);
  };

  useEffect(() => {
    if (!wellIds.length || !showStreamboxStatus) {
      return;
    }

    const requests = wellIds.reduce((result, wellId) => {
      const fetchInitialFrac = initialDataFetcher(FRAC_SUBSCRIPTION);
      const fetchInitialWireline = initialDataFetcher(WIRELINE_SUBSCRIPTION);
      const fetchInitialWirelineActivity = initialDataFetcher(WIRELINE_ACTIVITY_SUBSCRIPTION);

      const wellRequests = [fetchInitialWireline(wellId), fetchInitialWirelineActivity(wellId)];

      // preventing duplicate request
      if (wellId !== currentWellId) {
        wellRequests.push(fetchInitialFrac(wellId));
      }

      return result.concat(wellRequests);
    }, []);

    Promise.all(requests).then(response => {
      response.forEach(data => {
        onDataReceive({ data });
      });

      wellIds.forEach(id => {
        // preventing duplicate subscription
        if (id !== currentWellId) {
          subscribe(id, FRAC_SUBSCRIPTION);
        }
        subscribe(id, WIRELINE_SUBSCRIPTION);
        subscribe(id, WIRELINE_ACTIVITY_SUBSCRIPTION);
      });
    });

    // cleanup subscriptions in case selected well is changed, or pad is updated
    return () => {
      unsubscribeFunctions.current.forEach(unsubscribe => unsubscribe());
      unsubscribeFunctions.current = [];
    };
  }, [JSON.stringify(wellIds), currentWellId, isLive, showStreamboxStatus]);

  return wellStreams;
}
