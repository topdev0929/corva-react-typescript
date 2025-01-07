/* eslint-disable react/prop-types */

// TODO: Fix styles shit
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';
import { getIconForFeedItemType, AVATAR_ICON } from '~/utils/feed';
import { FEED_ITEM_TYPES_BY_KEY } from '~/constants/feed';
import { ALERT_LEVEL_COLOR } from '~/constants/alerts';

import AvatarIcon from './AvatarIcon';
import LessonsLearnedLeafIcon from './LessonsLearnedLeafIcon';

const useStyles = makeStyles({
  icon: {
    width: 32,
    height: 32,
    backgroundColor: 'grey',
    borderRadius: 23,
    position: 'absolute',
    top: 18,
    left: -16,
    padding: 6,
  },
  iconWrapper: {
    display: 'inline-block',
    height: 20,
    width: 20,
    overflow: 'hidden',
  },
  iconImg: {
    height: 20,
    width: 20,
  },
  iconNative: {
    left: 'auto',
  },
});

const TypeIcon = ({ feedItem, feedItemType, icon }) => {
  const classes = useStyles();

  const label = FEED_ITEM_TYPES_BY_KEY[feedItemType]
    ? FEED_ITEM_TYPES_BY_KEY[feedItemType].label
    : 'Other';

  let backgroundColorContainer;
  if (feedItemType === FEED_ITEM_TYPES_BY_KEY.alert.type) {
    const level = feedItem.context?.alert?.level;
    backgroundColorContainer = { backgroundColor: ALERT_LEVEL_COLOR[level] };
  }

  return (
    <div
      className={classNames(classes.icon, {
        [classes.iconNative]: isNativeDetected,
      })}
      style={backgroundColorContainer}
    >
      <div className={classes.iconWrapper}>
        <img src={icon} alt={`${label} icon`} className={classes.iconImg} />
      </div>
    </div>
  );
};

const Icon = ({ feedItem, displayName, isRecommended, currentUser }) => {
  const feedItemType = feedItem.type;

  const icon = getIconForFeedItemType(feedItemType);

  if (icon === AVATAR_ICON) {
    return (
      <>
        <AvatarIcon
          displayName={displayName}
          feedItem={feedItem}
          isRecommended={isRecommended}
          currentUser={currentUser}
        />

        {feedItemType === 'lessons_learned' && (
          <LessonsLearnedLeafIcon offsetX={-22} offsetY={32} />
        )}
      </>
    );
  }

  return <TypeIcon icon={icon} feedItem={feedItem} feedItemType={feedItemType} />;
};

export default Icon;
