/* eslint-disable react/prop-types */
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import Avatar from '~components/Avatar';
import UserCardPopover from '~components/UserCardPopover';

import { isNativeDetected } from '~utils/mobileDetect';
import RecommendationIcon from '~components/Icons/RecommendationIcon';

const useStyles = makeStyles({
  avatarWrapper: {
    width: 32,
    height: 32,
    backgroundColor: 'grey',
    borderRadius: '100%',
    position: 'absolute',
    top: 22,
    left: -16,
  },
  avatarWrapperNative: {
    left: 'auto',
  },
  recommendationWrapper: {
    position: 'absolute',
    bottom: -8,
    right: -6,
  },
});

const AvatarIcon = ({ displayName, feedItem, isRecommended, currentUser }) => {
  const classes = useStyles();
  return (
    <div
      className={classNames(classes.avatarWrapper, {
        [classes.avatarWrapperNative]: isNativeDetected,
      })}
    >
      {isNativeDetected ? (
        <Avatar
          displayName={displayName}
          imgSrc={feedItem.user?.profile_photo}
          size={32}
        />
      ) : (
        <UserCardPopover user={feedItem.user} currentUser={currentUser}>
          <Avatar
            displayName={displayName}
            imgSrc={feedItem.user?.profile_photo}
            size={32}
            className={classes.avatar}
          />
        </UserCardPopover>
      )}
      {isRecommended && (
        <div className={classes.recommendationWrapper}>
          <RecommendationIcon />
        </div>
      )}
    </div>
  );
};

export default AvatarIcon;
