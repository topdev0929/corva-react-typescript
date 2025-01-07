import { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { noop, sortBy } from 'lodash';
import moment from 'moment';
import { Typography, makeStyles } from '@material-ui/core';

import Comment from '~/components/Comment';
import CommentLoader from '~/components/CommentLoader';
import CommentInput from '~/components/CommentInput';
import { postFeedItemComment } from '~/clients/jsonApi';
import { useIsInsideDcApp } from '~/components/DevCenter/DevCenterAppContainer/components';

import { isNativeDetected } from '~utils/mobileDetect';

const PAGE_NAME = 'FeedComments';

const useStyles = makeStyles({
  showMore: {
    cursor: 'pointer',
  },
  feedCommentsContainer: { padding: '0 16px 0 24px' },
  feedCommentsList: { marginTop: 24 },
  feedCommentsListContent: {
    height: ({ commentsListHeight }) => commentsListHeight && commentsListHeight - 8,
    overflow: ({ commentsListHeight }) => commentsListHeight && 'scroll',
  },
  feedCommentsListContentWrapper: {
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 16,
    background: ({ isInsideDcApp }) =>
      `linear-gradient(180deg, rgba(61, 61, 61, 0) 0%, ${
        isInsideDcApp ? '#414141' : '3b3b3b'
      } 100%)`,
  },
});

// If there are  more than 3 comments, we show only last 3, other comments are hidden.
// To see all comments, user clicks ‘SEE ALL COMMENTS’.
// To hide all comments back, user clicks ‘HIDE OLDER COMMENTS’
// After clicking on a ‘SEE ALL COMMENTS’:
// Height of the comments pop-over changes to show 5 comments instead of 3.
// If all comments to initial comment can’t fit into comment pop-over, than User needs to scroll down to see them.
// If there are more than 5 comments (so 6th+ comments in not seen at the moment, we cover bottom comment with gradient, to show that there is more to see.
// The height of the Comments pop-over remains the same (to show first 5 comments), we don’t change it to show all possible 1000 comments. Only 5.

const INITIAL_VISIBLE_COMMENTS_COUNT = 3;
const COUNT_OF_COMMENTS_IN_SCROLLABLE_CONTAINER = 5;
function FeedComments({ openCommentInput, openCommentList, feedItem, currentUser }) {
  const { comments } = feedItem;

  const commentsCount = comments.length;
  const moreCommentsExist = commentsCount > INITIAL_VISIBLE_COMMENTS_COUNT;

  const [isPosting, setIsPosting] = useState(false);
  const [isVisibleCommentsAppeared, setIsVisibleCommentsAppeared] = useState(false);
  const [isAllCommentsVisibleKeyPressed, setIsAllCommentsVisibleKeyPressed] = useState(false);
  const [commentsListHeight, setCommentsListHeight] = useState(null);

  const inputEl = useRef();
  const commentsListRef = useRef();

  const toggleShowAllComments = () => {
    setIsAllCommentsVisibleKeyPressed(!isAllCommentsVisibleKeyPressed);
  };

  const postComment = comment => {
    postFeedItemComment(feedItem.id, comment);
  };

  const visibleComments = useMemo(() => {
    const sortedComments = sortBy(feedItem.comments, item => -moment(item.created_at).unix());

    if (!isAllCommentsVisibleKeyPressed)
      return sortedComments.slice(0, INITIAL_VISIBLE_COMMENTS_COUNT);

    if (isAllCommentsVisibleKeyPressed && !isVisibleCommentsAppeared) {
      return sortedComments.slice(0, COUNT_OF_COMMENTS_IN_SCROLLABLE_CONTAINER);
    }

    if (isAllCommentsVisibleKeyPressed && isVisibleCommentsAppeared) return sortedComments;

    return [];
  }, [comments, isVisibleCommentsAppeared, isAllCommentsVisibleKeyPressed]);

  useEffect(() => {
    if (
      visibleComments.length === COUNT_OF_COMMENTS_IN_SCROLLABLE_CONTAINER &&
      !commentsListHeight
    ) {
      const divHeight = commentsListRef.current.clientHeight;
      setCommentsListHeight(divHeight);
      setIsVisibleCommentsAppeared(true);
    }

    if (commentsListHeight && !isAllCommentsVisibleKeyPressed) {
      setCommentsListHeight(null);
      setIsVisibleCommentsAppeared(false);
    }
  }, [visibleComments.length, commentsListHeight, isAllCommentsVisibleKeyPressed]);

  const isInsideDcApp = useIsInsideDcApp();
  const classes = useStyles({ commentsListHeight, isAllCommentsVisibleKeyPressed, isInsideDcApp });

  return (
    <div className={(openCommentInput || !!commentsCount) && classes.feedCommentsContainer}>
      {openCommentInput && !isNativeDetected && (
        <CommentInput
          inputRef={inputEl}
          postComment={postComment}
          setIsPosting={setIsPosting}
          companyId={feedItem.company_id}
          autoFocus={false}
          currentUser={currentUser}
          parentId={`${feedItem.id}-${feedItem.comments?.size}`}
        />
      )}
      {openCommentList && (
        <div className={classes.feedCommentsList}>
          <div className={classes.feedCommentsListContentWrapper}>
            <div className={classes.feedCommentsListContent} ref={commentsListRef}>
              {visibleComments.map(comment => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  handleDeleteCallback={noop /* NOTE: Received through subscription */}
                  patchCommentCallback={noop}
                  companyId={feedItem.company_id}
                  currentUser={currentUser}
                />
              ))}
              {commentsListHeight && <div className={classes.gradient} />}
            </div>
          </div>
          {moreCommentsExist && (
            <Typography
              variant="caption"
              color="primary"
              data-testid={`${PAGE_NAME}_viewMoreComments`}
              className={classes.showMore}
              onClick={toggleShowAllComments}
            >
              {isAllCommentsVisibleKeyPressed ? 'Hide older comments' : 'See all comments'}
            </Typography>
          )}
        </div>
      )}

      {isPosting && <CommentLoader />}
    </div>
  );
}

FeedComments.propTypes = {
  openCommentInput: PropTypes.bool.isRequired,
  feedItem: PropTypes.shape().isRequired,
  currentUser: PropTypes.shape().isRequired,
};

export default FeedComments;
