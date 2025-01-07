import { useState } from 'react';
import { func, bool, node, number } from 'prop-types';
import { Grid, Button, makeStyles } from '@material-ui/core';
import Modal from '~/components/Modal';

import Content from './components/Content';

const useStyles = makeStyles({
  modal: {
    maxWidth: 450,
    width: '100vw',
  },
  actionsAdornment: { flex: 1 },
});

function AddCommentPopup({
  onClose,
  isProcessing,
  isSaveDisabled,
  onSave,
  startAdornment, // Render node on the top of the content
  endAdornment, // Render node on the bottom of the content
  actionsAdornment, // Render node on the left of the actions buttons
  customContent, // Render custom content instead of Post Input
  userCompanyId,
}) {
  const classes = useStyles();
  const [comment, setComment] = useState();

  return (
    <Modal
      open
      onClose={onClose}
      title="Add a Comment"
      contentClassName={classes.modal}
      actions={
        <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
          {actionsAdornment && (
            <Grid item className={classes.actionsAdornment}>
              {actionsAdornment}
            </Grid>
          )}

          <Grid item>
            <Button color="primary" disabled={isProcessing} onClick={onClose}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={isSaveDisabled}
              onClick={() => onSave(comment)}
            >
              {isProcessing ? 'Processing...' : 'Send'}
            </Button>
          </Grid>
        </Grid>
      }
    >
      <Content
        userCompanyId={userCompanyId}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        customContent={customContent}
        setComment={setComment}
      />
    </Modal>
  );
}

AddCommentPopup.propTypes = {
  onClose: func,
  onSave: func.isRequired,
  isProcessing: bool,
  isSaveDisabled: bool,
  startAdornment: node,
  endAdornment: node,
  actionsAdornment: node,
  customContent: node,
  userCompanyId: number.isRequired,
};

AddCommentPopup.defaultProps = {
  onClose: () => undefined,
  isProcessing: false,
  isSaveDisabled: false,
  startAdornment: null,
  endAdornment: null,
  customContent: null,
  actionsAdornment: null,
};

export default AddCommentPopup;
