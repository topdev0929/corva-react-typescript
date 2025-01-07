import { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, IconButton, Typography } from '@corva/ui/components';
import { makeStyles, withStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);
const StyledDeleteIcon = withStyles({ root: { marginRight: 8 } })(DeleteIcon);
const StyledText = withStyles({ root: { color: '#bdbdbd' } })(Typography.Regular16);

const useStyles = makeStyles({
  removeIconButton: {
    width: '32px',
    height: '32px',
  },
});

function FilterBoxDeleteDialog(props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpenModal = e => {
    setOpen(true);
    e.stopPropagation();
  };
  const handleCloseModal = e => {
    setOpen(false);
    e.stopPropagation();
  };

  const handleConfirmDelete = e => {
    setOpen(false);
    props.onDelete();
    e.stopPropagation();
  };

  return (
    <>
      <IconButton
        className={classes.removeIconButton}
        tooltipProps={{ title: 'Remove' }}
        size="small"
        onClick={handleOpenModal}
      >
        <DeleteIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Delete Scale?"
        isCloseIconShowed
        actions={
          <>
            <ClearAllButton color="primary" onClick={handleCloseModal}>
              Cancel
            </ClearAllButton>

            <StyledButton variant="contained" color="primary" onClick={handleConfirmDelete}>
              <StyledDeleteIcon />
              Delete
            </StyledButton>
          </>
        }
      >
        <div style={{ width: '300px', color: '#bdbdbd' }}>
          <StyledText>Scale and All Plotted on it Channels will be removed immediately</StyledText>
        </div>
      </Modal>
    </>
  );
}

FilterBoxDeleteDialog.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default memo(FilterBoxDeleteDialog);
