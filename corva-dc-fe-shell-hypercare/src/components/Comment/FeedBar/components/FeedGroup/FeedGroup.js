import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get, first } from 'lodash';

import { Avatar as MuiAvatar, Badge, makeStyles, Popover } from '@material-ui/core';
import { Avatar, FeedItem } from '@corva/ui/components';
import utils from '@corva/ui/utils/main';
import { components } from '@corva/ui/utils';

import {
  AVATAR_ICON,
  getIconForFeedItemType,
  isAvatarIcon,
} from '../../utils/getIconForFeedItemType';

import FeedContext from '../../../FeedContext';
import { COMMENT_BADGE_SIZES, COMMENT_GROUP_ICON_SIZE } from '../../constants';
import LazyListRenderer from '../LazyListRenderer';
import AppAnnotationHoc from '../FeedItem/AppAnnotationHoc';

import styles from './FeedGroup.css';

const { stopPropagation } = components;

function getAvatarContent(comments) {
  let topComment = first(comments);

  if (comments.size > 1) {
    const avatarComment = comments.find(comment => isAvatarIcon(comment.type));
    topComment = avatarComment || topComment;
  }

  const feedItemIcon = getIconForFeedItemType(topComment.type);

  if (feedItemIcon !== AVATAR_ICON) {
    return <img className={styles.feedGroupTypeIcon} alt="feed group" src={feedItemIcon} />;
  }

  const userName = utils.getUserFullName(topComment.user);

  return (
    <Avatar
      className={styles.feedGroupAvatar}
      displayName={userName}
      imgSrc={get(topComment, ['user', 'profile_photo'])}
      size={COMMENT_GROUP_ICON_SIZE}
    />
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    width: 460,
    maxWidth: '100%',
  },
  badge: {
    top: 1,
    right: 3,
    backgroundColor: theme.palette.background.b9,
    color: theme.palette.primary.text6,
    fontSize: 11,
    height: 16,
    minWidth: 14,
    minHeight: 16,
    lineHeight: 14,
    verticalAlign: 'middle',
    textAlign: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    border: `2px solid ${theme.palette.background.b5}`,
    padding: '0 1px',
    boxSizing: 'content-box',
  },
}));

function FeedGroup({ comments, position, isTooltipOpened, onTooltipOpened, currentUser }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [groupContainerElem, setGroupContainerElem] = useState(null);
  const classes = useStyles();

  const handleDeleteFeedItem = () => {
    onTooltipOpened(null);
  };

  const feedContext = useContext(FeedContext);

  const handleHover = e => {
    onTooltipOpened(get(comments, [0, 'id']));
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    onTooltipOpened(null);
    setAnchorEl(null);
  };

  const handleActivityLeave = event => {
    // Prevents tooltip closing when comment attachment file select window is opened
    if (event.type === 'mouseleave') {
      return;
    }

    if (
      event.type === 'mouseleave' &&
      event.currentTarget === null &&
      event.relatedTarget === window
    ) {
      return;
    }

    handleClose();
  };

  const renderGroupItem = comment => (
    <div className={styles.feedItemContainer}>
      <FeedItem
        key={comment.id}
        feedItem={{
          ...comment,
          app: {
            ...comment.app,
            platform: 'dev_center',
            // We need to pass original app key because some of feed items were made for an old platform app.
            // And FeedItem needs specific props structure
            app_key: feedContext.appKey,
          },
          settings: {
            ...comment.app?.settings,
          },
          package: { url: '-', ...feedContext.package },
          appId: feedContext.appId,
          allowed_actions: ['destroy'],
          currentUser,
        }}
        timestamp={comment.adjustedTimestamp}
        customFeedItemTypeTemplates={{
          app_annotation: AppAnnotationHoc,
        }}
        well={comment.well}
        currentUser={currentUser}
        paperClassName={classes.paper}
        removeFeedItem={handleDeleteFeedItem}
      />
    </div>
  );

  return (
    <>
      <Badge
        style={{ left: position, position: 'absolute' }}
        overlap="circle"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        badgeContent={comments.length}
        invisible={comments.length === 1}
        classes={{ badge: classes.badge }}
      >
        <MuiAvatar
          className={classNames(styles.feedGroupIcon, {
            [styles.feedGroupIconActive]: isTooltipOpened,
          })}
          style={{ ...COMMENT_BADGE_SIZES }}
          onMouseOver={handleHover}
        >
          {getAvatarContent(comments)}
        </MuiAvatar>
      </Badge>
      <Popover
        id={anchorEl ? 'feed-popover' : undefined}
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && isTooltipOpened}
        container={document.getElementById('app')}
        onClose={handleActivityLeave}
        onExit={handleClose}
      >
        <div
          className={styles.feedGroupItemsContainer}
          ref={elem => setGroupContainerElem(elem)}
          onWheel={stopPropagation}
          onTouchMove={stopPropagation}
        >
          <LazyListRenderer
            data={comments}
            renderItem={renderGroupItem}
            scrollableContainerElem={groupContainerElem && groupContainerElem.parentElement}
          />
        </div>
      </Popover>
    </>
  );
}

FeedGroup.propTypes = {
  currentUser: PropTypes.shape({}).isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isTooltipOpened: PropTypes.bool.isRequired,
  onTooltipOpened: PropTypes.func.isRequired,
};

export default FeedGroup;
