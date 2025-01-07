import { useState, useRef } from 'react';
import moment from 'moment';
import classNames from 'classnames';

import { Grid, Typography, makeStyles } from '@material-ui/core';

import Modal from '~/components/Modal';
import PostInput from '~/components/PostInput';
import IconButton from '~/components/IconButton';
import { Regular14 } from '~/components/Typography';
import SendIcon from '~components/Icons/SendIcon';
import { isSuggestionsListOpened } from '~/components/UserMention/utils';
import { MENTION_STYLE } from '~/constants/feed';

const useStyles = makeStyles(theme => ({
  postInput: { paddingBottom: 8 },
  filePreviewWrapper: {
    width: '100%',
    marginLeft: 0,
    maxHeight: 251,
  },
  modal: {
    maxWidth: 450,
    width: '100vw',
  },
  actionsAdornment: { flex: 1 },
  info: { marginTop: 16 },
  text: {
    color: theme.palette.primary.text6,
  },
  value: {
    color: '#fff',
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
  modalActions: { paddingTop: 16 },
  actions: { height: 36 },
  sendRow: { display: 'flex' },
  sendIcon: {
    '&.Mui-disabled': {
      cursor: 'not-allowed!important',
    },
  },
}));

function PCCommentEdit({
  feedItem: {
    context: {
      pc_comment: {
        body,
        attachment,
        data: pointData,
        data: { holeDepth, timestamp },
      },
    },
  },
  onClose,
  onSave,
  userCompanyId,
}) {
  const classes = useStyles();

  const wrapperRef = useRef();
  const [comment, setComment] = useState({
    body,
    attachment,
  });

  const sendActivity = () => {
    onSave({
      context: {
        pc_comment: {
          ...comment,
          data: pointData,
        },
      },
    });
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isSuggestionsListOpened()) {
      e.preventDefault();
      sendActivity();
    }
  };

  const handleClick = e => {
    e.stopPropagation();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Comment"
      contentClassName={classes.modal}
      actionsClassName={classes.modalActions}
      onClick={handleClick}
      actions={
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.actions}
        >
          <Grid item>
            <Typography
              variant="caption"
              className={classNames(
                classes.inputMain,
                classes.cancelText,
                classes.highlightedLabel
              )}
              component="div"
              gutterBottom
              onClick={onClose}
            >
              Cancel
            </Typography>
          </Grid>
          <Grid item direction="row" alignItems="center" className={classes.sendRow}>
            <Typography
              variant="caption"
              className={classNames(classes.inputMain, classes.inputHelper)}
              component="div"
              gutterBottom
            >
              Press&nbsp;
              <Typography
                variant="caption"
                color="primary"
                className={classNames(classes.inputMain, classes.highlightedLabel)}
              >
                Enter
              </Typography>
              &nbsp;to send
            </Typography>
            <IconButton
              onClick={sendActivity}
              className={classes.sendIcon}
              disabled={!comment || (!comment.body && !comment.attachment)}
            >
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      }
      ref={wrapperRef}
    >
      <PostInput
        initialValue={{ body, attachment }}
        userCompanyId={userCompanyId}
        onChange={setComment}
        filePreviewWrapperClass={classes.filePreviewWrapper}
        className={classes.postInput}
        onKeyDown={onKeyDown}
        mentionStyle={MENTION_STYLE}
        suggestionsPortalHost={wrapperRef.current}
        allowSuggestionsAboveCursor
      />

      <div className={classes.info}>
        {timestamp && (
          <Regular14 className={classes.text} gutterBottom>
            Time:
            <span className={classes.value}>
              {moment(timestamp * 1000).format('MM/DD/YY, HH:mm')}
            </span>
          </Regular14>
        )}

        {Number.isFinite(holeDepth) && (
          <Regular14 className={classes.text} gutterBottom>
            Hole Depth: <span className={classes.value}>{holeDepth}&apos;</span>
          </Regular14>
        )}
      </div>
    </Modal>
  );
}

export default PCCommentEdit;
