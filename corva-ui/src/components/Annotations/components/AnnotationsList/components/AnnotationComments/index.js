import { useEffect, useState, useRef } from 'react';
import { shape, string, bool, number, func } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Button, Typography } from '@material-ui/core';

import { getAnnotationComments, postAnnotationComment } from '~/clients/jsonApi';

import LoadingIndicator from '~components/LoadingIndicator';
import CommentInput from '~components/CommentInput';
import CommentLoader from '~components/CommentLoader';
import Comment from '~components/Comment';

import styles from './style.css';

const PAGE_NAME = 'annotationComments';

const INITIAL_VISIBLE_COMMENTS_COUNT = 3;
const MORE_COMMENTS_FIRST_INCREMENT = 7;
const MORE_COMMENTS_INCREMENT = 10;

const muiStyles = {
  showMore: {
    textTransform: 'none',
    backgroundColor: 'transparent!important',
    padding: 0,
  },
};

const AnnotationComments = ({
  annotationId,
  commentInputIsOpen,
  commentsCount,
  setCommentsCount,
  initialCommentsCount,
  classes,
  assetCompanyId,
  currentUser,
}) => {
  const inputRef = useRef();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const [nextPageToRequest, setNextPageToRequest] = useState(1);
  const [visibleCommentsСount, setVisibleCommentsCount] = useState(INITIAL_VISIBLE_COMMENTS_COUNT);

  const activateInput = () => {
    const { current } = inputRef;

    if (current) {
      current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      current.focus();
    }
  };

  const postCommentCallback = comment => {
    setComments([comment, ...comments]);
    setCommentsCount(commentsCount + 1);
  };

  const patchCommentCallback = comment => {
    const commentIndex = comments.findIndex(({ id }) => id === comment.id);

    const updatedComments = [...comments];
    updatedComments.splice(commentIndex, 1, comment);

    setComments(updatedComments);
  };

  const deleteCommentCallback = commentId => {
    setComments(comments.filter(({ id }) => id !== commentId));
    setCommentsCount(commentsCount - 1);
  };

  useEffect(() => {
    async function handleFetchComments() {
      if (!annotationId) return;

      setIsLoading(true);

      try {
        const response = await getAnnotationComments(annotationId, {
          page: nextPageToRequest,
          per_page: INITIAL_VISIBLE_COMMENTS_COUNT,
          order: 'desc',
        });
        setComments(response);
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
    }

    handleFetchComments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShowMoreComments = async () => {
    setIsLoading(true);

    const isFirstIncrement = visibleCommentsСount === INITIAL_VISIBLE_COMMENTS_COUNT;
    const perPage = isFirstIncrement ? MORE_COMMENTS_FIRST_INCREMENT : MORE_COMMENTS_INCREMENT;

    setVisibleCommentsCount(perPage + visibleCommentsСount);

    try {
      const response = await getAnnotationComments(annotationId, {
        page: isFirstIncrement ? 1 : nextPageToRequest,
        per_page: perPage,
        order: 'desc',
        offset:
          nextPageToRequest === 1
            ? comments.length
            : MORE_COMMENTS_INCREMENT + (commentsCount - initialCommentsCount),
      });
      setComments([...comments, ...response]);
      if (!isFirstIncrement) setNextPageToRequest(nextPageToRequest + 1);
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  // NOTE: Slice and show recent comments last
  const commentsToDisplay = comments.slice(0, visibleCommentsСount).reverse();
  const showShowMore = commentsCount > visibleCommentsСount;

  if (isLoading && !comments.length) return <LoadingIndicator fullscreen={false} />;

  return (
    <div className={styles.cAnnotationCommentsList}>
      {showShowMore && (
        <Button
          data-testid={`${PAGE_NAME}_viewMoreComments`}
          className={classes.showMore}
          onClick={handleShowMoreComments}
        >
          <Typography variant="caption" color="primary">
            View more comments
          </Typography>
        </Button>
      )}
      <div className={styles.cAnnotationCommentsListItems}>
        {isLoading && comments.length && <LoadingIndicator fullscreen={false} size={30} />}
        {commentsToDisplay.map(c => (
          <Comment
            key={c.id}
            comment={c}
            handleDeleteCallback={deleteCommentCallback}
            patchCommentCallback={patchCommentCallback}
            companyId={assetCompanyId}
            currentUser={currentUser}
          />
        ))}
      </div>

      {isPosting && <CommentLoader spaceAround />}

      {commentInputIsOpen && (
        <div className={styles.cAnnotationCommentsListInput}>
          <CommentInput
            inputRef={inputRef}
            postComment={comment => postAnnotationComment(annotationId, comment)}
            setIsPosting={setIsPosting}
            postCommentCallback={postCommentCallback}
            onMount={activateInput}
            companyId={assetCompanyId}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
};

AnnotationComments.propTypes = {
  annotationId: string.isRequired,
  commentInputIsOpen: bool.isRequired,
  commentsCount: number.isRequired,
  initialCommentsCount: number.isRequired,
  setCommentsCount: func.isRequired,
  classes: shape().isRequired,
  assetCompanyId: number.isRequired,
  currentUser: shape({}).isRequired,
};

export default withStyles(muiStyles)(AnnotationComments);
