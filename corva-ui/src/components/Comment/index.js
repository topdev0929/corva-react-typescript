/* eslint-disable react/prop-types */
import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, noop, includes } from 'lodash';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import CommentWrapper from '~components/CommentWrapper';
import CommentLoader from '~components/CommentLoader';
import CommentInput from '~components/CommentInput';
import Avatar from '~components/Avatar';
import Attachment from '~components/Attachment';
import IconButton from '~components/IconButton';
import ConfirmationDialog from '~components/ConfirmationDialog';
import UserCardPopover from '~components/UserCardPopover';

import { formatMentionText } from '~components/UserMention/utils';

import { isNativeDetected } from '~/utils/mobileDetect';

import { deleteFeedItemComment } from '../../clients/jsonApi';

import utils from '~utils/main';

import styles from './styles.css';

const PAGE_NAME = 'comment';

const CREATED_AT_FORMAT = 'MM/DD/YY HH:mm';
const CREATED_AT_FORMAT_NATIVE = 'MM/DD HH:mm';

const style = {
  chatAvatarWrapper: {
    paddingTop: 2,
    position: 'absolute',
    top: 6,
    left: 0,
  },
  commentInfoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: 5,
  },
  userNameWrapper: { overflow: 'hidden' },
  infoContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '100%',
    paddingLeft: 33,
  },
};

const muiStyles = theme => ({
  commentWrapper: { width: '100%' },
  timeRoot: {
    color: theme.palette.primary.text7,
    float: 'right',
    marginRight: 5,
    marginLeft: 8,
    fontSize: '12px',
  },
  textRoot: {
    marginTop: 5,
    color: '#CCC',
    fontWeight: 'normal',
    fontSize: '14px',
  },
  iconButtonRoot: {
    float: 'right',
    visibility: 'hidden',
    color: theme.palette.primary.text7,
  },
  userName: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
});

class Comment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      actionsMenuAnchorEl: null,
      isLoading: false,
      isEditing: false,
      openDeleteDialog: false,
    };
    this.inputEl = createRef();
    this.commentEl = createRef();
  }

  componentDidMount() {
    if (this.props.showOnMount) {
      this.showIntoView();
    }
  }

  get isCurrentUserCommentCreator() {
    return Number(get(this.props.comment, ['user', 'id'])) === Number(this.props.currentUser.id);
  }

  deleteComment = async (feedItemId, commentId) => {
    let commentResponse;

    try {
      commentResponse = await deleteFeedItemComment(feedItemId, commentId);
    } catch (e) {
      console.error(e);
    }

    return commentResponse;
  };

  showIntoView = () => {
    this.props.handleShowOnMount();
    this.commentEl.current.scrollIntoView({ block: 'end' });
  };

  handleToggleActionsMenu = event => {
    const currentT = event.currentTarget;
    this.setState(({ actionsMenuAnchorEl }) => ({
      actionsMenuAnchorEl: actionsMenuAnchorEl ? null : currentT,
    }));
  };

  handleKeyDown = event => {
    if (event.keyCode === 27) {
      this.setState({
        isEditing: false,
      });
    }
    document.removeEventListener('keydown', this.handleKeyDown, false);
  };

  handleEditMenuItem = () => {
    document.addEventListener('keydown', this.handleKeyDown, false);
    this.setState(
      {
        isEditing: true,
      },
      () => {
        if (this.inputEl.current) this.inputEl.current.focus();
      }
    );
  };

  // TODO: move to one prop, not multiple
  getEditCommentProps = () => {
    const { comment } = this.props;
    const editCommentId = comment.id;
    const editComment = comment.body;
    const editAttachment = comment.attachment;
    const editFeedItemId = comment.feed_activity_id;
    return {
      editFeedItemId,
      editCommentId,
      editComment,
      editAttachment,
    };
  };

  onEditFinish = () => {
    this.setState({ isEditing: false, isLoading: false });
  };

  handleDeleteMenuItem = () => {
    this.setState({ openDeleteDialog: true });
  };

  handleDelete = async () => {
    const { id } = this.props.comment;
    const feedItemId = this.props.comment.feed_activity_id;

    this.setState({ isLoading: true });

    const response = await this.deleteComment(feedItemId, id);

    this.setState({ isLoading: false, openDeleteDialog: false });
    if (response) this.props.handleDeleteCallback(id);
  };

  renderMenuIcon() {
    const showEdit = this.isCurrentUserCommentCreator;

    const showDelete =
      this.isCurrentUserCommentCreator || includes(this.props.comment.allowed_actions, 'destroy');

    if (!(showDelete || showEdit)) return null;

    return (
      <div className={styles.cCommentMenu}>
        <IconButton
          data-testid={`${PAGE_NAME}_menuButton`}
          aria-label="Actions"
          aria-owns={this.state.actionsMenuAnchorEl ? 'c-comment__actions-menu' : undefined}
          aria-haspopup="true"
          className={this.props.classes.iconButtonRoot}
          size="small"
          onClick={this.handleToggleActionsMenu}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="c-comment__actions-menu"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={this.state.actionsMenuAnchorEl}
          open={!!this.state.actionsMenuAnchorEl}
          onClick={this.handleToggleActionsMenu}
        >
          {showEdit && (
            <MenuItem data-testid={`${PAGE_NAME}_editMenuItem`} onClick={this.handleEditMenuItem}>
              Edit
            </MenuItem>
          )}

          {showDelete && (
            <MenuItem
              data-testid={`${PAGE_NAME}_deleteMenuItem`}
              onClick={this.handleDeleteMenuItem}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }

  render() {
    const { isLoading, isEditing } = this.state;

    if (isLoading) {
      const { spaceAround } = this.props;
      return <CommentLoader spaceAround={spaceAround} />;
    }

    const { comment, classes, spaceAround, isNative, patchCommentCallback, companyId } = this.props;

    if (isEditing) {
      return (
        <CommentInput
          inputRef={this.inputEl}
          postComment={noop}
          exitEditMode={this.onEditFinish}
          setIsEditting={() => this.setState({ isLoading: true })}
          patchCommentCallback={patchCommentCallback}
          companyId={companyId}
          currentUser={this.props.currentUser}
          {...this.getEditCommentProps()}
        />
      );
    }

    const userFullName = utils.getUserFullName(comment.user);

    const format = isNative ? CREATED_AT_FORMAT_NATIVE : CREATED_AT_FORMAT;
    const time = moment(comment.created_at).format(format);

    const attachmentUrl = comment?.attachment?.signed_url || comment?.attachment?.url;
    const attachmentSize = get(comment, ['attachment', 'size']);
    const attachmentFileName = get(comment, ['attachment', 'file_name']);

    return (
      <div
        data-testid={`${PAGE_NAME}_commentItem_${comment.body}`}
        className={classNames(styles.cComment, { [styles.cCommentNative]: isNative })}
        ref={this.commentEl}
      >
        <CommentWrapper spaceAround={spaceAround} className={this.props.classes.commentWrapper}>
          <div style={style.chatAvatarWrapper}>
            {isNative ? (
              <Avatar
                size={24}
                displayName={userFullName}
                imgSrc={get(comment, ['user', 'profile_photo'])}
                className={this.props.classes.avatar}
              />
            ) : (
              <UserCardPopover user={comment.user} currentUser={this.props.currentUser}>
                <Avatar
                  size={24}
                  displayName={userFullName}
                  imgSrc={get(comment, ['user', 'profile_photo'])}
                  className={this.props.classes.avatar}
                />
              </UserCardPopover>
            )}
          </div>

          <div style={style.infoContainer}>
            <div>
              <div style={style.commentInfoContainer}>
                <div style={style.userNameWrapper}>
                  <Typography
                    data-testid={`${PAGE_NAME}_userName`}
                    variant="subtitle2"
                    noWrap
                    className={classes.userName}
                  >
                    {userFullName}
                  </Typography>
                </div>

                <div style={style.timeWrapper}>
                  <Typography
                    data-testid={`${PAGE_NAME}_addTime`}
                    variant="caption"
                    classes={{ root: classes.timeRoot }}
                  >
                    {time}
                  </Typography>
                </div>
              </div>
            </div>

            <div className={styles.cCommentBody}>
              {this.renderMenuIcon()}
              <Typography
                data-testid={`${PAGE_NAME}_commentMessage`}
                variant="body1"
                classes={{ root: classes.textRoot }}
              >
                {formatMentionText(
                  comment.body,
                  comment.mentioned_users,
                  isNative,
                  '#00bcd4',
                  this.props.currentUser
                )}
              </Typography>

              {attachmentUrl && (
                <Attachment
                  attachmentUrl={attachmentUrl}
                  attachmentSize={attachmentSize}
                  size="small"
                  fileName={attachmentFileName}
                />
              )}
            </div>
          </div>
        </CommentWrapper>

        {this.state.openDeleteDialog && (
          <ConfirmationDialog
            open={this.state.openDeleteDialog}
            text="Do you really want to delete comment?"
            handleClose={() => this.setState({ openDeleteDialog: false })}
            handleOk={this.handleDelete}
            okText="Delete"
          />
        )}
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.shape({}).isRequired,
  showOnMount: PropTypes.bool,
  spaceAround: PropTypes.bool,
  handleShowOnMount: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDeleteCallback: PropTypes.func.isRequired,
  patchCommentCallback: PropTypes.func.isRequired,
  companyId: PropTypes.number,
  currentUser: PropTypes.shape(),

  classes: PropTypes.shape({}).isRequired,
  isNative: PropTypes.bool,
};

Comment.defaultProps = {
  showOnMount: false,
  spaceAround: false,
  handleShowOnMount: noop,
  handleEdit: noop,
  companyId: null,

  isNative: isNativeDetected,

  currentUser: {},
};

export default withStyles(muiStyles)(Comment);
