import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { first, tail, last } from 'lodash';

import FeedsDataSection from './FeedsDataSection';
import { COMMENT_GROUP_ICON_SIZE } from '../../constants';

function FeedsDataSectionContainer({
  currentUser,
  isDataLoading,
  feedItems,
  width,
  timeRange: { startTimestamp, endTimestamp },
}) {
  const commentsGroups = useMemo(() => {
    const displayedFeedItems = feedItems.filter(
      item => item.positionTimestamp >= 0 && item.adjustedTimestamp < endTimestamp
    );
    if (!displayedFeedItems.length || !width) return [];
    const pixelPerSec = width / (endTimestamp - startTimestamp);
    const positionedFeedItems = displayedFeedItems.map(feedItem => {
      const feedPosition = pixelPerSec * feedItem.positionTimestamp;
      let position = feedPosition;
      if (feedPosition + COMMENT_GROUP_ICON_SIZE > width)
        position = width - COMMENT_GROUP_ICON_SIZE;

      return {
        ...feedItem,
        position,
      };
    });

    const firstGroup = [first(positionedFeedItems)];

    return tail(positionedFeedItems).reduce(
      (groups, comment) => {
        const lastGroup = last(groups);
        const baseFeed = first(lastGroup);

        if (comment.position - baseFeed.position <= COMMENT_GROUP_ICON_SIZE) {
          return [...groups.slice(0, -1), [...lastGroup, comment]];
        }

        return [...groups, [comment]];
      },
      [firstGroup]
    );
  }, [feedItems, width, startTimestamp, endTimestamp]);

  return (
    <FeedsDataSection
      currentUser={currentUser}
      isDataLoading={isDataLoading}
      commentGroups={commentsGroups}
    />
  );
}

FeedsDataSectionContainer.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  isDataLoading: PropTypes.bool.isRequired,
  feedItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  timeRange: PropTypes.shape({
    startTimestamp: PropTypes.number,
    endTimestamp: PropTypes.number,
  }).isRequired,
  size: PropTypes.shape({
    width: PropTypes.number,
  }).isRequired,
  width: PropTypes.number.isRequired,
};

FeedsDataSectionContainer.defaultProps = {};

export default FeedsDataSectionContainer;
