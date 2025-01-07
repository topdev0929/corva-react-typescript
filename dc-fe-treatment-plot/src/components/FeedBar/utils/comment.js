export function getFeedDataField(comment, field) {
  return comment.get(field) || comment.getIn(['data', field]);
}

export function isOldFormatFeeds(commentsSubscriptionData) {
  return commentsSubscriptionData.hasIn(['data', 'records']);
}

export function getFeedItemCreatedAtSec(feedItem) {
  return Math.round(new Date(feedItem.get('created_at')).getTime() / 1000);
}

export function setRangeDataRelativeIndex({ item, itemValue, rangeDataField, rangeData }) {
  const nearestRangeRecord = rangeData.minBy(record => {
    const recordValue = record.get(rangeDataField);
    return Math.abs(recordValue - itemValue);
  });

  const itemIndex = rangeData.indexOf(nearestRangeRecord);

  return item.set('relativeIndex', itemIndex / rangeData.size);
}

export const getPositionedFeedKey = comment => `${comment.position}`;
