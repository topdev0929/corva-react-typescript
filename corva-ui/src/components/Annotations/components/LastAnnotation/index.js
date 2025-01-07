import { memo, useMemo } from 'react';
import { shape, string, bool, arrayOf, func, number } from 'prop-types';
import classNames from 'classnames';
import { flowRight } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import CloseButton from '@material-ui/icons/Close';

import UserCardPopover from '~components/UserCardPopover';
import Avatar from '~components/Avatar';
import { formatMentionText } from '~components/UserMention/utils';

import { isNativeDetected } from '~/utils/mobileDetect';
import { closeLastAnnotation } from '../../../../clients/jsonApi';

import styles from './style.css';

const PAGE_NAME = 'lastAnnotation';

const muiStyles = theme => ({
  container: {
    height: 56,
    margin: '10px 0',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 'auto 1',
    width: '100%',
    cursor: 'pointer',
  },
  body: { margin: '0 16px ', minWidth: 100 },
  avatar: { border: '1px solid #909090' },
  commentIcon: { marginRight: 16, color: theme.palette.grey[500] },
  commentText: { marginRight: 16, color: theme.palette.grey[500] },
  closeButton: { color: theme.palette.grey[500] },
  avatarInList: { marginLeft: -4 },
});

/* eslint-disable react/prop-types */
const CreatorAvatar = ({ user, currentUser, isNative, className, size }) => {
  const children = (
    <Avatar
      displayName={`${user.first_name} ${user.last_name}`}
      imgSrc={user.profile_photo}
      size={size}
      className={className}
    />
  );

  if (isNative) return children;
  return (
    <UserCardPopover user={user} currentUser={currentUser}>
      {children}
    </UserCardPopover>
  );
};

const Reactions = ({ commentsCount, commentUsers, isSmallScreen, isNative, currentUser, classes }) => {
  if (!commentsCount) return null;

  return (
    <div className={styles.cTopAnnotationAdditionalReactions}>
      <CommentIcon className={classes.commentIcon} />
      {!isSmallScreen && (
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_comments`}
          noWrap
          className={classes.commentText}
          component="div"
        >
          Comments {commentsCount}
        </Typography>
      )}

      <div className={styles.cTopAnnotationAdditionalReactionsList}>
        {commentUsers.map(({ attributes }, index) => (
          <CreatorAvatar
            key={attributes.id}
            user={attributes}
            currentUser={currentUser}
            isNative={isNative}
            className={classNames(classes.avatar, { [classes.avatarInList]: index !== 0 })}
            size={25}
          />
        ))}
      </div>
    </div>
  );
};
/* eslint-enable */

const LastAnnotation = ({
  isNative,
  appId,
  annotation,
  openAnnotationsList,
  currentUser,
  updateCurrentDashboardAppLastAnnotation: updateLastAnnotation,
  width,
  classes,
}) => {
  const { data, included } = annotation;
  const creator = included.find(
    ({ id, type }) => id === data.relationships.user.data.id && type === 'user'
  );

  const mentionedUsers = useMemo(
    () =>
      data.relationships.mentioned_users.data.map(({ id: mentionedUserId }) =>
        included.find(({ id }) => id === mentionedUserId)
      ),
    [data.relationships.mentioned_users.data, included]
  );

  const commentUsers = useMemo(
    () =>
      data.relationships.comment_users.data.map(({ id: commentUserId }) =>
        included.find(({ id }) => id === commentUserId)
      ),
    [data.relationships.comment_users.data, included]
  );

  const isSmallScreen = !isWidthUp('sm', width);

  const handleCloseClick = async e => {
    e.stopPropagation();

    try {
      const response = await closeLastAnnotation(data.id);
      updateLastAnnotation(data.id, appId, response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper
      data-testid={`${PAGE_NAME}_lastAnnotation`}
      className={classes.container}
      onClick={openAnnotationsList}
    >
      <div className={styles.cTopAnnotationMain}>
        <CreatorAvatar
          user={creator.attributes}
          currentUser={currentUser}
          isNative={isNative}
          className={classes.avatar}
          size={38}
        />
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_message`}
          noWrap
          className={classes.body}
        >
          {formatMentionText(data.attributes.body, mentionedUsers, isNative, null, currentUser)}
        </Typography>
      </div>
      <div className={styles.cTopAnnotationAdditional}>
        <Reactions
          commentsCount={data.attributes.comments_count}
          commentUsers={commentUsers}
          classes={classes}
          isSmallScreen={isSmallScreen}
          currentUser={currentUser}
        />
        <CloseButton
          data-testid={`${PAGE_NAME}_closeButton`}
          fontSize="small"
          className={classes.closeButton}
          onClick={handleCloseClick}
        />
      </div>
    </Paper>
  );
};

LastAnnotation.propTypes = {
  appId: number.isRequired,
  annotation: shape({
    included: arrayOf(shape({})).isRequired,
    data: shape({
      relationships: shape({
        user: shape({ data: shape({ id: string.isRequired }).isRequired }).isRequired,
        mentioned_users: shape({ data: arrayOf(shape()).isRequired }).isRequired,
      }).isRequired,
      attributes: shape({ body: string.isRequired, created_at: string.isRequired }),
    }).isRequired,
  }).isRequired,
  classes: shape({}).isRequired,
  isNative: bool,
  width: string.isRequired,
  openAnnotationsList: func.isRequired,
  updateCurrentDashboardAppLastAnnotation: func,
  currentUser: shape({}),
};

LastAnnotation.defaultProps = {
  isNative: isNativeDetected,
  updateCurrentDashboardAppLastAnnotation: () => undefined,
  currentUser: {},
};

export default flowRight([withStyles(muiStyles), withWidth()])(memo(LastAnnotation));
