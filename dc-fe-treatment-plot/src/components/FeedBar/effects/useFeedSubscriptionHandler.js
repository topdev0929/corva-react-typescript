import { useEffect } from 'react';

export default function useFeedSubscriptionHandler({
  feedSubscriptionData,
  setFeedItems,
  assetId,
}) {
  useEffect(() => {
    if (!feedSubscriptionData || String(feedSubscriptionData?.well?.id) !== String(assetId)) {
      return;
    }

    setFeedItems(prevFeedItems => {
      const getUpdatedItemIndex = () =>
        prevFeedItems.findIndex(feedItem => feedItem.id === feedSubscriptionData.id);

      switch (feedSubscriptionData.action) {
        case 'create':
          return [...prevFeedItems, feedSubscriptionData];
        case 'update':
          return prevFeedItems.map((prevItem, index) =>
            index === getUpdatedItemIndex() ? feedSubscriptionData : prevItem
          );
        case 'destroy':
          return prevFeedItems.filter((_, index) => index !== getUpdatedItemIndex());
        default:
          return prevFeedItems;
      }
    });
  }, [assetId, feedSubscriptionData, setFeedItems]);
}
