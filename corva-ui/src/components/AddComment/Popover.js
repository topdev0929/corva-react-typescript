import { useState } from 'react';
import { node, shape, func, number } from 'prop-types';
import { Popover, Grid, Typography, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

import { IconButton } from '~/components';
import SendIcon from '~components/Icons/SendIcon';

import Content from './components/Content';

const PAGE_NAME = 'AddCommentPopover';

const useStyles = makeStyles(theme => ({
  paper: {
    width: 368,
    padding: 16,
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
  actions: { height: 36 },
  sendRow: { display: 'flex' },
  sendIcon: {
    '&.Mui-disabled': {
      cursor: 'not-allowed!important',
    },
  },
}));

function AddCommentPopover({
  anchorEl,
  anchorOrigin,
  onClose,
  onSave,
  startAdornment, // Render node on the top of the content
  endAdornment, // Render node on the bottom of the content
  customContent, // Render custom content instead of Post Input
  userCompanyId,
  ...otherProps
}) {
  const classes = useStyles();
  const [comment, setComment] = useState();

  return (
    <Popover
      open
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
      classes={{ paper: classes.paper }}
      {...otherProps}
    >
      <Content
        userCompanyId={userCompanyId}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        customContent={customContent}
        setComment={setComment}
        onSave={() => onSave(comment)}
        smallerView
        comment={comment}
      />

      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className={classes.actions}
      >
        <Grid item>
          <Typography
            data-testid={`${PAGE_NAME}_cancel`}
            variant="caption"
            className={classNames(classes.inputMain, classes.cancelText, classes.highlightedLabel)}
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
            data-testid={`${PAGE_NAME}_send`}
            onClick={() => onSave(comment)}
            className={classes.sendIcon}
            disabled={!comment || (!comment.body && !comment.attachment)}
          >
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Popover>
  );
}

AddCommentPopover.propTypes = {
  onClose: func,
  onSave: func.isRequired,
  anchorEl: node.isRequired,
  anchorOrigin: shape,
  startAdornment: node,
  endAdornment: node,
  customContent: node,
  userCompanyId: number.isRequired,
};

AddCommentPopover.defaultProps = {
  anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
  onClose: () => undefined,
  startAdornment: null,
  endAdornment: null,
  customContent: null,
};

export default AddCommentPopover;
