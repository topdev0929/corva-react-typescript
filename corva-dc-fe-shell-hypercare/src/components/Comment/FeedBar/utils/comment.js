export function getFeedItemCreatedAtSec(feedItem) {
  return Math.round(new Date(feedItem.get('created_at')).getTime() / 1000);
}
