import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { Button } from '~/components';

const PAGE_NAME = 'DC_removeApp';

const DIALOG_PAPER_PROPS = {
  elevation: 1,
};

function RemoveAppButton({ appName, onAppRemove }) {
  const [isConfirmationDialogOpened, setConfirmationDialogOpened] = useState(false);
  const closeConfirmationDialog = () => setConfirmationDialogOpened(false);

  return (
    <>
      <Button
        data-testid={`${PAGE_NAME}_button`}
        onClick={() => setConfirmationDialogOpened(true)}
        variation="dangerSecondary"
      >
        REMOVE APP
      </Button>
      <Dialog
        open={isConfirmationDialogOpened}
        onClose={closeConfirmationDialog}
        PaperProps={DIALOG_PAPER_PROPS}
      >
        <DialogTitle data-testid={`${PAGE_NAME}_title`}>Remove {appName}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to remove this app?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid={`${PAGE_NAME}_cancel`} onClick={closeConfirmationDialog}>
            Cancel
          </Button>

          <Button
            data-testid={`${PAGE_NAME}_confirm`}
            // this fn comes from parent window through an iframe.
            // It's important to call it without native event as it's not possible
            // to pass it through the iframe, because it contains circular dependencies
            onClick={() => onAppRemove()}
            variation="dangerPrimary"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

RemoveAppButton.propTypes = {
  appName: PropTypes.string.isRequired,
  onAppRemove: PropTypes.func.isRequired,
};

export default RemoveAppButton;
