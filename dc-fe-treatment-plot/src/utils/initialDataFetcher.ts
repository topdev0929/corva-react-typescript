import { getAppStorage } from '@corva/ui/clients/jsonApi';

// NOTE: Make initial data fetcher function
export function initialDataFetcher(subscriptionInfo) {
  return async function (assetId: number, timestamp?: number) {
    let response = null;
    try {
      response = await getAppStorage(
        subscriptionInfo.provider,
        subscriptionInfo.collection,
        assetId,
        {
          ...subscriptionInfo.params,
          query: timestamp ? `{timestamp#lt#${timestamp}}` : null,
          sort: '{timestamp: -1}',
          limit: 1,
        }
      );
    } catch (err) {
      console.error(err);
    }
    return response;
  };
}
