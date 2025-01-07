/* eslint-disable react/prop-types */
// NOTE: CHECK utils
import classNames from 'classnames';
import moment from 'moment';
import { uniq, uniqBy } from 'lodash';
import { makeStyles, useTheme, IconButton } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';

import { notifyOpenFeedCommentInput } from '~/utils/nativeMessages';
import { isNativeDetected } from '~utils/mobileDetect';
import CommentsInfo from '~/components/CommentsInfo';
import utils from '~/utils/main';

const PAGE_NAME = 'FeedPo';

const useStyles = makeStyles({
  reactionButton: { padding: 8 },
  reactions: {
    minHeight: 48,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px 8px 24px',
    flexWrap: 'wrap',
  },
  reactionsNative: {
    padding: '0 16px',
  },
  actions: {
    display: 'flex',
    marginRight: 30,
    alignItems: 'center',
  },
});

const AVATARS_VISIBLE_AMOUNT = isNativeDetected ? 2 : 3;

const Reactions = ({
  feedItem,
  currentUser,
  setOpenCommentInput,
  setOpenCommentList,
  openCommentInput,
  openCommentList,
  handleToggleLike,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const likesCount = feedItem.likes_count;
  const commentsCount = feedItem.comments.length;

  const isLikedByCurrentUser = (feedItem.likes || []).find(
    like => like.user?.id === currentUser.id
  );

  const usersWhoLike = (feedItem.likes || []).map(like => utils.getUserFullName(like.user));

  const usersWhoCommented = uniq(
    (feedItem.comments || []).map(comment => utils.getUserFullName(comment.user))
  );

  const activeUsersList = uniqBy(
    (feedItem.comments || [])
      .concat(feedItem.likes || [])
      .map(item => item.user)
      .sort(item => moment(item.created_at).unix()),
    'id'
  ).slice(0, AVATARS_VISIBLE_AMOUNT);

  const isListOrInputClosed = !openCommentInput || !openCommentList;

  const handleCommentIconClick = () => {
    if (isNativeDetected) {
      notifyOpenFeedCommentInput(feedItem.id);
    } else {
      setOpenCommentInput(isListOrInputClosed);
      setOpenCommentList(isListOrInputClosed);
    }
  };

  return (
    <div
      className={classNames(classes.reactions, {
        [classes.reactionsNative]: isNativeDetected,
      })}
    >
      <div className={classes.actions}>
        <IconButton
          data-testid={`${PAGE_NAME}_likeButton`}
          aria-label="Like"
          onClick={handleToggleLike}
          className={classes.reactionButton}
        >
          <ThumbUpIcon
            htmlColor={isLikedByCurrentUser ? theme.palette.primary.main : theme.palette.grey[400]}
          />
        </IconButton>

        <IconButton
          data-testid={`${PAGE_NAME}_commentButton`}
          aria-label="Comment"
          onClick={handleCommentIconClick}
          className={classes.reactionButton}
        >
          <CommentIcon htmlColor={theme.palette.grey[400]} />
        </IconButton>

        <CommentsInfo
          likesCount={likesCount}
          usersWhoLike={usersWhoLike}
          commentsCount={commentsCount}
          usersWhoCommented={usersWhoCommented}
          activeUsersList={activeUsersList}
          onCommentsClick={() => setOpenCommentList(!openCommentList)}
          small
        />
      </div>
    </div>
  );
};

export default Reactions;
