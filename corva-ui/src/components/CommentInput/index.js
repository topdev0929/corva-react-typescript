import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withStyles } from '@material-ui/core/styles';
import { Collapse, Typography, TextField, InputAdornment, Paper } from '@material-ui/core';
import classNames from 'classnames';
import { get } from 'lodash';

import grey from '@material-ui/core/colors/grey';

import Avatar from '~components/Avatar';
import FileUploadIconButton from '~components/FileUploadIconButton';
import EmojiIconButton from '~components/EmojiIconButton';
import FailedFileUploading from '~components/FailedFileUploading';
import UserMention from '~components/UserMention';
import FilePreview from '~components/FilePreview';
import IconButton from '~components/IconButton';
import SendIcon from '~components/Icons/SendIcon';

import { isSuggestionsListOpened } from '~components/UserMention/utils';

import utils from '~utils/main';
import { isNativeDetected } from '~/utils/mobileDetect';
import { notifyCommentEdit, notifyCommentPost } from '~utils/nativeMessages'; // question here

import { patchFeedItemComment } from '../../clients/jsonApi';

import styles from './styles.css';

const PAGE_NAME = 'commentInput';

const INPUT_HEIGHT = 32;
const AVATAR_SIZE = 32;

const style = {
  chatAvatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    height: INPUT_HEIGHT,
  },
  commentTextFieldContainer: { position: 'relative', margin: '0' },
  commentTextFieldContainerSpaceAround: { position: 'relative', margin: '20px 10px' },
};

const muiStyles = theme => ({
  paperRoot: {
    width: 'calc(100% - 48px)',
    marginLeft: AVATAR_SIZE + 16,
    display: 'inline-block',
    height: INPUT_HEIGHT,
    border: '0',
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
    },
    boxShadow: 'none',
    background: '#4D4D4D',
  },
  input: {
    paddingLeft: 5,
    width: '100%',
  },
  inputRoot: {
    height: INPUT_HEIGHT,
    paddingRight: '8px',
    lineHeight: '29px',
    paddingLeft: '8px',
  },
  inputEl: { padding: '0 0 0 6px', height: '100%' },
  additionalActionButton: {
    padding: '6px',
  },
  nativeActionButton: {
    margin: '5px 10px',
    cursor: 'pointer',
  },
  fileUploadingError: {
    marginTop: 10,
    marginLeft: 24,
  },
  inputMain: {
    marginBottom: 0,
    fontSize: '11px',
    color: theme.palette.primary.text8,
  },
  inputHelper: {
    display: 'flex',
    paddingRight: 5,
  },
  cancelText: {
    cursor: 'pointer',
  },
  highlightedLabel: {
    color: theme.palette.primary.main,
  },
  iconTooltip: {
    marginTop: '3px',
  },
  sendButton: {
    '&:hover': {
      backgroundColor: 'rgba(3,188,212, 0.1)',
    },
    '&.MuiButtonBase-root': {
      padding: 7,
    },
  },
  inputAdornment: {
    marginBottom: '0!important',
    height: '100%',
  },
});

class CommentInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,

      attachmentLoadingError: null,
      isInputFocused: false,
    };
  }

  componentDidMount() {
    if (this.isEditMode) {
      this.setInitialCommentValue();
    }
  }

  componentDidUpdate(prevProps) {
    const enteredEditMode = this.isEditMode && !prevProps.editFeedItemId;
    if (
      enteredEditMode ||
      (this.props.editCommentId && this.props.editCommentId !== prevProps.editCommentId)
    ) {
      this.setInitialCommentValue();
    }
  }

  get isEditMode() {
    return !!this.props.editFeedItemId;
  }

  setInitialCommentValue() {
    const attachmentUrl = this.props.editAttachment ? this.props.editAttachment.url : null;

    this.setState({
      comment: this.props.editComment,
      attachmentUrl,
      attachmentName: attachmentUrl
        ? this.props.editAttachment.file_name ||
          utils.getFileNameWithExtensionFromPath(attachmentUrl)
        : null,
      attachmentSize: this.props.editAttachment ? this.props.editAttachment.size : null,
    });
  }

  handleSelectEmoji = emoji =>
    this.setState(({ comment }) => ({ comment: `${comment}${emoji.native}` }));

  postComment = async comment => {
    let commentResponse;
    try {
      commentResponse = await this.props.postComment(comment);
    } catch (e) {
      console.error(e.message);
    }

    return commentResponse;
  };

  patchComment = async comment => {
    const { editFeedItemId, editCommentId } = this.props;

    let commentResponse;

    try {
      commentResponse = await patchFeedItemComment(editFeedItemId, editCommentId, comment);
    } catch (e) {
      console.error(e.message);
    }

    return commentResponse;
  };

  focusOnRef() {
    if (this.props.inputRef) this.props.inputRef.current.focus();
  }

  clearCommentField = callback => {
    this.setState(
      {
        comment: '',
        attachmentUrl: null,
        attachmentName: null,
        attachmentSize: null,
      },
      () => {
        this.focusOnRef();
        if (callback && typeof callback === 'function') callback();
      }
    );
  };

  handleKeyDown = event => {
    const { key } = event;

    if (key === 'Escape') this.props.exitEditMode();

    if (key === 'Enter') {
      if (!isSuggestionsListOpened()) {
        event.preventDefault();
        this.handleSendComment();
      }
    }
  };

  handleAttachmentLoadingError = attachmentLoadingError => {
    this.setState({
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      attachmentLoadingError,
    });
  };

  handleFileUpload = (attachmentUrl, attachmentName, attachmentSize) => {
    this.setState({
      attachmentUrl,
      attachmentName,
      attachmentSize,
      attachmentLoadingError: null,
    });
  };

  handleNativeFileUpload = () => {
    const { comment } = this.state;

    if (this.isEditMode) {
      notifyCommentEdit(comment);
      this.clearCommentField(this.props.exitEditMode);
    } else {
      notifyCommentPost(comment);
      this.clearCommentField();
    }
  };

  handleFileDelete = () =>
    this.setState({ attachmentUrl: null, attachmentName: null, attachmentSize: null });

  handleSendComment = async () => {
    const textComment = this.state.comment ? this.state.comment.trim() : null;
    if (!textComment && !this.state.attachmentUrl) return;

    const comment = {
      comment: {
        body: textComment,
        attachment: {
          url: this.state.attachmentUrl,
          size: this.state.attachmentSize,
          file_name: this.state.attachmentName,
        },
      },
    };

    let commentResponse;

    if (this.isEditMode) {
      this.props.setIsEditting(true);

      commentResponse = await this.patchComment(comment);
      await this.props.patchCommentCallback(commentResponse);

      this.props.setIsEditting(false);
      this.clearCommentField();
      this.props.exitEditMode();
    } else {
      this.props.setIsPosting(true);

      commentResponse = await this.postComment(comment);
      await this.props.postCommentCallback(commentResponse);

      this.props.setIsPosting(false);
      this.clearCommentField();
    }
  };

  handleCancelClick = () => {
    this.setState(
      {
        comment: '',
        attachmentUrl: null,
        attachmentName: null,
        attachmentSize: null,
      },
      this.props.exitEditMode()
    );
  };

  render() {
    const { classes, currentUser } = this.props;

    const currentUserFullName = `${
      get(currentUser, ['attributes', 'first_name']) || get(currentUser, 'first_name')
    } ${get(currentUser, ['attributes', 'last_name']) || get(currentUser, 'last_name')}`;

    const isVisibleActionBar =
      this.state.isInputFocused ||
      this.state.attachmentUrl ||
      this.state.comment ||
      this.props.editComment ||
      this.props.editAttachment?.url;

    return (
      <div
        style={
          this.props.spaceAround
            ? style.commentTextFieldContainerSpaceAround
            : style.commentTextFieldContainer
        }
      >
        <div style={style.chatAvatarWrapper}>
          <Avatar
            displayName={currentUserFullName}
            size={AVATAR_SIZE}
            imgSrc={this.props.currentUser && this.props.currentUser.profile_photo}
          />
        </div>
        <Paper className={this.props.classes.paperRoot}>
          <TextField
            data-testid={`${PAGE_NAME}_input`}
            placeholder="Type Comment"
            FormHelperTextProps={{
              component: 'div',
              margin: 'dense',
            }}
            InputProps={{
              inputComponent: UserMention,
              inputProps: {
                onChange: comment => this.setState({ comment }),
                singleLine: true,
                value: this.state.comment || '',
                inputRef: this.props.inputRef,
                withLightTheme: false,
                onMount: this.props.onMount,
                companyId: this.props.companyId,
                autoFocus: this.props.autoFocus,
                disabled: this.props.disabled,
                onFocus: () => this.setState({ isInputFocused: true }),
                onBlur: () => this.setState({ isInputFocused: false }),
                allowSuggestionsAboveCursor: true,
              },
              endAdornment: !this.props.isNative && (
                <InputAdornment position="end" className={this.props.classes.inputAdornment}>
                  {!this.state.attachmentUrl && (
                    <div
                      className={classNames(
                        styles.cCommentInputIconContainer,
                        styles.cCommentInputIconUpload
                      )}
                    >
                      <FileUploadIconButton
                        openPreviewDialogOnUpload={false}
                        disableRipple
                        onFinish={this.handleFileUpload}
                        onError={this.handleAttachmentLoadingError}
                        fileUploadIconClassName={this.props.classes.additionalActionButton}
                        htmlColor={grey[400]}
                        inputId={`comment-attachment-${
                          this.props.editCommentId || this.props.parentId
                        }`}
                        tooltipProps={{
                          title: 'Attach File',
                          classes: { tooltip: classes.iconTooltip },
                          placement: 'top',
                        }}
                      />
                    </div>
                  )}
                  <div className={styles.cCommentInputIconContainer}>
                    <EmojiIconButton
                      data-testid={`${PAGE_NAME}_emojiButton`}
                      handleSelectEmoji={this.handleSelectEmoji}
                      emojiIconClassName={this.props.classes.additionalActionButton}
                      htmlColor={grey[400]}
                      disableRipple
                      tooltipProps={{
                        title: 'Add Emoji',
                        classes: { tooltip: classes.iconTooltip },
                        placement: 'top',
                      }}
                    />
                  </div>
                </InputAdornment>
              ),
              disableUnderline: true,
              classes: {
                root: this.props.classes.inputRoot,
                input: this.props.classes.inputEl,
              },
            }}
            className={this.props.classes.input}
            onKeyDown={this.handleKeyDown}
          />
        </Paper>

        {this.state.attachmentLoadingError && (
          <FailedFileUploading
            errorMessage={this.state.attachmentLoadingError}
            className={this.props.classes.fileUploadingError}
          />
        )}

        {this.state.attachmentUrl && (
          <FilePreview
            fileName={this.state.attachmentName}
            fileUrl={this.state.attachmentUrl}
            handleFileDelete={this.handleFileDelete}
            classes={this.props.classes}
          />
        )}
        <Collapse in={isVisibleActionBar} mountOnEnter unmountOnExit>
          <div className={styles.cCommentInputSendContainer}>
            <div className={styles.cCommentInputSendContainerCancel}>
              <Typography
                data-testid={`${PAGE_NAME}_cancel`}
                variant="caption"
                className={classNames(
                  this.props.classes.inputMain,
                  this.props.classes.cancelText,
                  this.props.classes.highlightedLabel
                )}
                component="div"
                gutterBottom
                onClick={this.handleCancelClick}
              >
                Cancel
              </Typography>
            </div>
            <div className={styles.cCommentInputSendContainerSend}>
              <Typography
                variant="caption"
                className={classNames(this.props.classes.inputMain, this.props.classes.inputHelper)}
                component="div"
                gutterBottom
              >
                Press&nbsp;
                <Typography
                  variant="caption"
                  color="primary"
                  className={classNames(
                    this.props.classes.inputMain,
                    this.props.classes.highlightedLabel
                  )}
                >
                  Enter
                </Typography>
                &nbsp;to send
              </Typography>
              <IconButton
                size="large"
                tooltipProps={{ title: 'Send' }}
                data-testid={`${PAGE_NAME}_sendButton`}
                onClick={this.handleSendComment}
                classes={{ root: this.props.classes.sendButton }}
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

CommentInput.propTypes = {
  inputRef: PropTypes.shape({ current: PropTypes.shape({ focus: PropTypes.shape({}) }) }),
  editFeedItemId: PropTypes.number,
  editCommentId: PropTypes.number,
  editComment: PropTypes.string,
  editAttachment: PropTypes.shape({
    url: PropTypes.string,
    size: PropTypes.number,
    file_name: PropTypes.string,
  }),
  spaceAround: PropTypes.bool,
  postComment: PropTypes.func.isRequired,
  postCommentCallback: PropTypes.func,
  patchCommentCallback: PropTypes.func,
  exitEditMode: PropTypes.func,
  setIsPosting: PropTypes.func,
  setIsEditting: PropTypes.func,
  onMount: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,

  classes: PropTypes.shape({}).isRequired,

  currentUser: PropTypes.shape(),
  isNative: PropTypes.bool,
  companyId: PropTypes.number,
  parentId: PropTypes.string,
};

CommentInput.defaultProps = {
  inputRef: null,
  editFeedItemId: null,
  editCommentId: null,
  parentId: null,
  editComment: null,
  editAttachment: {},
  spaceAround: false,
  setIsPosting: noop,
  setIsEditting: noop,
  onMount: noop,
  autoFocus: undefined,
  disabled: false,
  patchCommentCallback: noop,
  postCommentCallback: noop,
  exitEditMode: noop,
  companyId: null,
  currentUser: {},

  isNative: isNativeDetected,
};

export default withStyles(muiStyles)(CommentInput);
