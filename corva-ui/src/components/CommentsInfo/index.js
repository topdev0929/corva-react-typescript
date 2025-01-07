import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
/*
 * Using Tooltip from material-ui here because MuiTooltipDcWrapper is broken when used inside popover
 * Here it makes no sense to use that wrapper, because tooltip doesn't go out of parent bounds
 * Bug ticket: https://corvaqa.atlassian.net/browse/DC-3803
 */
import { Typography, Tooltip } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import { isNativeDetected } from '~/utils/mobileDetect';

import Avatar from '~components/Avatar';
import UserCardPopover from '~components/UserCardPopover';

import styles from './styles.css';

const PAGE_NAME = 'FeedPo';

const REACTIONS_VISIBLE_AMOUNT = 19; // NOTE: Max 20 lines

const getUserFullName = user => (user ? `${user.first_name} ${user.last_name}` : '');

const ReactionsTooltip = ({ users, noReactionsText }) => {
  const reactionsAmount = users.length;
  if (!reactionsAmount) {
    return noReactionsText;
  }

  let reactionsInvisibleText = '';

  if (reactionsAmount > REACTIONS_VISIBLE_AMOUNT) {
    const reactionsInvisibleAmount = reactionsAmount - REACTIONS_VISIBLE_AMOUNT;
    reactionsInvisibleText = `\nand ${reactionsInvisibleAmount} more...`;
  }

  const reactionsVisibleText = users.slice(0, REACTIONS_VISIBLE_AMOUNT).join('\n');

  return `${reactionsVisibleText}${reactionsInvisibleText}`;
};

const NO_LIKES_TEXT = 'Nobody likes this yet...';
const NO_COMMENTS_TEXT = 'Nobody commented this yet...';

const CommentsInfo = ({
  likesCount,
  usersWhoLike,
  commentsCount,
  usersWhoCommented,
  onCommentsClick,
  currentUser,
  activeUsersList,
  classes,
  isNative,
  small,
}) => (
  <>
    {!!likesCount && (
      <Tooltip
        title={<ReactionsTooltip users={usersWhoLike} noReactionsText={NO_LIKES_TEXT} />}
        enterTouchDelay={0}
        classes={{ popper: classes.tooltip }}
        placement="top"
      >
        <Typography
          data-testid={`${PAGE_NAME}_likesCounter_${likesCount}`}
          className={classes.reactionTypographyRoot}
          variant="caption"
        >
          Likes {likesCount}
        </Typography>
      </Tooltip>
    )}

    {!!commentsCount && (
      <span onClick={onCommentsClick}>
        <Tooltip
          title={<ReactionsTooltip users={usersWhoCommented} noReactionsText={NO_COMMENTS_TEXT} />}
          enterTouchDelay={0}
          classes={{ popper: classes.tooltip }}
          placement="top"
        >
          <Typography
            data-testid={`${PAGE_NAME}_commentsCounter_${commentsCount}`}
            className={classes.reactionTypographyRoot}
            variant="caption"
          >
            Comments {commentsCount}
          </Typography>
        </Tooltip>
      </span>
    )}
    <div
      data-testid={`${PAGE_NAME}_activeUsersCounter_${activeUsersList && activeUsersList.length}`}
      className={styles.cCommentsInfoActiveUsersList}
    >
      {activeUsersList.map(user =>
        isNative ? (
          <Avatar
            key={user.id}
            displayName={getUserFullName(user)}
            imgSrc={user.profile_photo}
            className={classes.avatarInList}
            size={small ? 24 : 32}
          />
        ) : (
          <UserCardPopover key={user.id} user={user} currentUser={currentUser}>
            <Avatar
              displayName={getUserFullName(user)}
              imgSrc={user.profile_photo}
              size={small ? 24 : 32}
              className={classes.avatarInList}
            />
          </UserCardPopover>
        )
      )}
    </div>
  </>
);

const muiStyles = {
  reactionTypographyRoot: {
    color: grey[400],
    margin: '0 8px',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
      textUnderlineOffset: '4px',
      color: '#fff',
    },
  },
  avatarInList: {
    marginRight: 3,
    borderWidth: 1,
  },
  tooltip: {
    whiteSpace: 'pre-line',
  },
};

CommentsInfo.propTypes = {
  likesCount: PropTypes.number,
  usersWhoLike: PropTypes.arrayOf(PropTypes.shape({})),
  commentsCount: PropTypes.number,
  usersWhoCommented: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCommentsClick: PropTypes.func,
  activeUsersList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
  isNative: PropTypes.bool,
  small: PropTypes.bool,
  currentUser: PropTypes.shape({}),
};

CommentsInfo.defaultProps = {
  likesCount: 0,
  usersWhoLike: [],
  commentsCount: 0,
  onCommentsClick: () => {},
  small: false,
  isNative: isNativeDetected,
  currentUser: {},
};

export default withStyles(muiStyles)(CommentsInfo);
