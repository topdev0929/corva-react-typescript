import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { get, isEmpty, sortBy } from 'lodash';
import { useSubscriptions } from '@corva/ui/effects';

// import { jsonApi } from '@corva/ui/clients';
import { corvaAPI } from '@corva/ui/clients';

import useFeedSubscriptionHandler from './useFeedSubscriptionHandler';
// import { METADATA } from '../../../meta';

export async function getFeedItems({
  page,
  perPage,
  start,
  end,
  assets,
  type,
  segment,
  users,
  id,
  companyId,
} = {}) {
  if (id) return corvaAPI.get(`/v1/activities/${id}`);

  return corvaAPI.get('/v1/activities', {
    page,
    per_page: perPage,
    start: start ? start + 60000 : undefined,
    end: end ? end + 60000 : undefined,
    assets,
    users,
    type,
    segment,
    company_id: companyId,
  });
}

function getFeedItemCreatedAtSec(feedItem) {
  if (
    get(feedItem, 'type') === 'app_annotation' &&
    get(feedItem, ['context', 'app_annotation', 'data_timestamp'])
  )
    return moment(get(feedItem, ['context', 'app_annotation', 'data_timestamp'])).unix();
  if (get(feedItem, 'type') === 'completion_npt_event')
    return get(feedItem, ['context', 'completion_npt_event', 'data', 'start_time']);
  // if (feedItem.get('type') === 'completion_actual_stage')
  //   return feedItem.getIn(['context', 'completion_actual_stage', 'timestamp']);
  return moment(get(feedItem, 'created_at')).unix();
}

const BASE_FEED_SUBSCRIPTION = {
  collection: 'feed',
  subscribeOnly: true,
  alwaysSubscribe: true,
  params: {},
};

const getFeedSubscriptionConfig = params => ({
  ...BASE_FEED_SUBSCRIPTION,
  ...params,
});

export default function useFeedItems({
  assetId,
  app,
  assets,
  timeRange,
  userId,
  userCompanyId,
  feedLoadTimestamp,
}) {
  const [feedItems, setFeedItems] = useState([]);
  const [isFeedItemsLoading, setIsFeedItemsLoading] = useState(true);
  const [{ data: feedSubscriptionData }, { data: userFeedSubscriptionData }] = useSubscriptions([
    getFeedSubscriptionConfig({
      assetId,
      companyId: userCompanyId,
    }),
    getFeedSubscriptionConfig({
      assetId,
      companyId: userCompanyId,
      userId,
    }),
  ]);

  async function loadFeedItems() {
    try {
      const assetIds = assets.map(asset => asset.id);
      const baseRequestParams = {
        assets: assetIds,
        page: 1,
        perPage: 10000,
        segment: 'drilling',
      };

      const feedItemsRes = await getFeedItems({
        ...baseRequestParams,
      });

      setFeedItems(feedItemsRes);
    } catch (error) {
      console.error(error);
    }
    setIsFeedItemsLoading(false);
  }

  const currentRangeIndexedFeedItems = useMemo(() => {
    if (!feedItems || !timeRange || isEmpty(timeRange)) {
      return [];
    }
    const startValue = timeRange.startTimestamp;
    const endValue = timeRange.endTimestamp;
    const filteredFeedItems = feedItems.filter(feedItem => {
      const adjustedTimestamp = getFeedItemCreatedAtSec(feedItem);
      const appKey = get(feedItem, ['context', 'app_annotation', 'app_key']);
      return (
        adjustedTimestamp > startValue &&
        adjustedTimestamp < endValue &&
        (feedItem.type !== 'app_annotation' || appKey === app?.app?.app_key)
      );
    });

    return sortBy(
      filteredFeedItems.map(feedItem => {
        const adjustedTimestamp = getFeedItemCreatedAtSec(feedItem);

        return {
          ...feedItem,
          positionTimestamp: adjustedTimestamp - startValue,
          adjustedTimestamp,
        };
      }),
      item => item.adjustedTimestamp
    );
  }, [feedItems, timeRange]);

  useEffect(() => {
    loadFeedItems();
  }, [feedLoadTimestamp]);

  useFeedSubscriptionHandler({
    feedSubscriptionData,
    setFeedItems,
    assetId,
  });

  useFeedSubscriptionHandler({
    feedSubscriptionData: userFeedSubscriptionData,
    setFeedItems,
    assetId,
  });

  return {
    feedItems: currentRangeIndexedFeedItems,
    isFeedItemsLoading,
  };
}
