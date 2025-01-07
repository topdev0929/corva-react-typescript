// NOTE: This is a deprecated module, but is still used in the codebase (some devcenter apps)
// We don't support it, dc devs should refactor their code to use socketClient directly
import { useState, useEffect, useRef, useMemo } from 'react';
import { parse } from 'querystring';
import uuidV1 from 'uuid/v1';
import { castArray, omit, differenceBy, concat, merge, mapValues } from 'lodash';
import { getAppKeyFromStackTrace } from '~/clients/utils';
import { getAppStorage, getDataAppStorage, getDataAppStorageAggregate } from '~/clients/jsonApi';

import { getSubscriptionId } from '../clients/subscriptions';

function getSubscriptionWithId(sub, hookId, appKey) {
  const subId = getSubscriptionId(sub, hookId);
  return { ...sub, hookId, subId, appInstanceId: subId, app_key: appKey };
}

async function fetchInitialSubscriptionsDataDeprecated(subscriptions, { timeQuery, appKey }) {
  const requests = subscriptions.map(
    async ({ provider, collection, assetId, subscribeOnly, params }) => {
      if (subscribeOnly) return null;
      const queryFromParameters = params.query;
      const queryFromTime = timeQuery ? `{timestamp#lte#${timeQuery.timestamp.$lte}` : '';
      const separator = queryFromParameters && queryFromTime ? 'AND' : '';
      const query = `${queryFromParameters}${separator}${queryFromTime}`;

      try {
        return await getAppStorage(provider, collection, assetId, {
          ...params,
          ...(query ? { query } : {}),
          appKey,
        });
      } catch (e) {
        return [];
      }
    }
  );
  return Promise.all(requests);
}

async function fetchInitialSubscriptionsData(subscriptions, { timeQuery, appKey }) {
  const requests = subscriptions.map(
    async ({ provider, collection, assetId, subscribeOnly, params = {} }) => {
      if (subscribeOnly) return null;

      // NOTE: Use different endpoint for aggregate queries
      // https://data.qa.corva.ai/docs#/default/aggregate_api_v1_data__provider___dataset__aggregate__get
      if (params.aggregate)
        return getDataAppStorageAggregate(provider, collection, {
          ...mapValues(params.aggregate, JSON.stringify),
        });

      const query = JSON.stringify(merge({ asset_id: assetId }, params.query, timeQuery));
      const { limit = 1, sort = '{"timestamp": 1}' } = params;

      try {
        const options = {
          ...params,
          limit,
          sort,
          query,
          appKey,
        };

        return await getDataAppStorage(provider, collection, options);
      } catch (e) {
        return [];
      }
    }
  );
  return Promise.all(requests);
}

/**
 * A hook to subscribe to the corva socket updates
 * @param {Object | Object[]} subscriptions - subscription params
 * @param {number} subscriptions.limit - only save given amount of records
 * @param {boolean} subscriptions.subscribeOnly - do NOT send initial requests for the data
 * @param {boolean} subscriptions.alwaysSubscribe - will always subscribe, even when well timeline used
 * and do NOT store previously received data if true
 * @param {Object | Object} options - various hook options
 * @param {Object | Object} options.timestamp - requested time (usually from well timeline).
 * If provided only the initial request is being sent with the {"timestamp": {"$lte":time}} query added.
 */
function useSubscriptions(subscriptions, { timestamp, isOldApiUsed } = {}) {
  const [data, setData] = useState({});
  // NOTE: Declare this hook id to differentiate between hooks
  const hookIdRef = useRef();
  if (!hookIdRef.current) hookIdRef.current = uuidV1();
  const { subscribe, unsubscribe, socket } = window[Symbol.for('socket')];
  const appKey = useMemo(() => getAppKeyFromStackTrace(), []);

  // NOTE: Save previous subscriptions to detect added/removed subscriptions
  const prevSubscriptionsRef = useRef([]);
  const currentSubscriptions = castArray(subscriptions).map(sub =>
    getSubscriptionWithId(sub, hookIdRef.current, appKey)
  );

  // NOTE: This string is used to trigger effects
  const currentSubscriptionsIdsJoined = currentSubscriptions.map(sub => sub.subId).join();
  const timeQuery = useMemo(() => {
    if (timestamp) return { timestamp: { $lte: timestamp } };
    const timeFromLocation = parse(window.location.search).time;
    return timeFromLocation ? { timestamp: { $lte: new Date(timeFromLocation) / 1000 } } : null;
  }, [window.location.search, timestamp]);

  useEffect(() => {
    const onDataReceive = event => {
      // NOTE: Skip other effects subscriptions' events
      if (event.hookId !== hookIdRef.current) return;
      setData(prevData => {
        let nextData = event.data;
        if (event.subId in prevData && !event.subscribeOnly) {
          nextData = concat(prevData[event.subId], event.data);
        }

        if (event.params && event.params.limit) nextData = nextData.slice(-event.params.limit);

        return {
          ...prevData,
          [event.subId]: nextData,
        };
      });
    };
    if (socket) socket.on('data', onDataReceive);
    // NOTE: Delete onDataReceive callback on unmounting
    return () => socket && socket.off('data', onDataReceive);
  }, []);

  useEffect(() => {
    const { current: prevSubscriptions } = prevSubscriptionsRef;
    prevSubscriptions.forEach(unsubscribe);
    prevSubscriptionsRef.current = [];
  }, [timeQuery]);

  useEffect(() => {
    const { current: prevSubscriptions } = prevSubscriptionsRef;
    const addedSubscriptions = differenceBy(currentSubscriptions, prevSubscriptions, 'subId');
    const deletedSubscriptions = differenceBy(prevSubscriptions, currentSubscriptions, 'subId');
    addedSubscriptions.forEach(subscription => {
      // NOTE: only subscribe when the timestamp wasn't provided (well timeline wasn't used)
      if (!timeQuery || subscription.alwaysSubscribe) subscribe(subscription);
    });
    deletedSubscriptions.forEach(unsubscribe);

    prevSubscriptionsRef.current = currentSubscriptions;

    // NOTE: Migrate to new api after https://corvaqa.atlassian.net/browse/DC-1090 is done
    const fetchFunc = isOldApiUsed
      ? fetchInitialSubscriptionsDataDeprecated
      : fetchInitialSubscriptionsData;
    fetchFunc(addedSubscriptions, { timeQuery, appKey, isOldApiUsed }).then(subsData =>
      setData(prevData => {
        // NOTE: Here we omit data from deleted subscriptions
        const nextData = omit(
          prevData,
          deletedSubscriptions.map(sub => sub.subId)
        );

        addedSubscriptions.forEach((sub, idx) => {
          if (subsData[idx] !== null) nextData[sub.subId] = subsData[idx];
        });
        return nextData;
      })
    );
  }, [currentSubscriptionsIdsJoined, timeQuery]);

  // NOTE: Clear all subscriptions on unmounting
  useEffect(() => () => prevSubscriptionsRef.current.forEach(unsubscribe), []);

  return useMemo(
    () =>
      currentSubscriptions.map(({ subId }) => ({
        loading: !(subId in data),
        data: data[subId],
      })),
    [data, currentSubscriptionsIdsJoined]
  );
}

export default useSubscriptions;
