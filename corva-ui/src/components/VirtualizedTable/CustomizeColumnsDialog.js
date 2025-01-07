import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import DraggableList from './DraggableList';

function CustomizeColumnsDialog({ open, columns, handleCloseWithOK, handleCloseWithCancel }) {
  const [draggableItems, setDraggableItems] = useState(columns);

  useEffect(() => {
    setDraggableItems(columns);
  }, [columns]);

  const handleClick = currentItem => {
    const updatedItems = draggableItems.map(item =>
      item.key === currentItem.key
        ? {
            ...item,
            show: item.disabled ? true : !item.show,
          }
        : item
    );
    setDraggableItems(updatedItems);
  };

  const handleSort = newItems => {
    setDraggableItems(newItems);
  };

  const handleCancel = () => {
    setDraggableItems(columns);
    handleCloseWithCancel();
  };

  const handleOK = () => {
    handleCloseWithOK(draggableItems);
  };

  return (
    <Dialog disableBackdropClick disableEscapeKeyDown fullWidth maxWidth="xs" open={open}>
      <DialogTitle>Customize Columns</DialogTitle>
      <DialogContent>
        <DraggableList items={draggableItems} onSort={handleSort} onClick={handleClick} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOK} color="primary" variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CustomizeColumnsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseWithOK: PropTypes.func.isRequired,
  handleCloseWithCancel: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
};

export default CustomizeColumnsDialog;
