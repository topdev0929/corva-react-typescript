import { useEffect, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';
import { socketClient } from '@corva/ui/clients';
import { COLLECTIONS } from '~/constants';
import { convertLogValue } from '~/utils/dataUtils';

export const useAppSubscriptions = (subjectWellId, channels, liveCondition, setIsLive) => {
  const [validSubs, setValidSubs] = useState([]);
  const buffer = useRef([]);
  const subscriptionInfo = COLLECTIONS.witsSubscription;
  const timerRef = useRef(null);

  useEffect(() => {
    setValidSubs([]);
  }, [subjectWellId]);

  useEffect(() => {
    const unsubscribes = [];

    const onDataReceive = event => {
      const subs = event.data || [];
      const convertedData = subs.map(item => ({
        assetId: item.asset_id,
        data: convertLogValue(item, channels),
      }));
      buffer.current.push(...convertedData);
    };
    const subscription = { ...subscriptionInfo, assetId: subjectWellId };
    unsubscribes.push(socketClient.subscribe(subscription, { onDataReceive }));

    // NOTE: Unsubscribe to prevent memory leaks in your app
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [subjectWellId, channels]);

  useEffect(() => {
    if (!liveCondition) {
      setIsLive(false);
    }

    const intervalId = setInterval(() => {
      if (buffer.current.length && liveCondition) {
        setValidSubs(cloneDeep(buffer.current));
        setIsLive(true);
        buffer.current = [];

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setIsLive(false);
        }, 60 * 1000);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [liveCondition]);

  return [validSubs, setValidSubs];
};
