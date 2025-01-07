import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import Button from '~/components/Button';
import Tooltip from '~/components/Tooltip';

export const PAGE_NAME = 'DC_removeApp';

const DIALOG_PAPER_PROPS = {
  elevation: 1,
};

const useStyles = makeStyles({
  tooltip: { maxWidth: 'none' },
});

function RemoveAppButton({ appName, onAppRemove }) {
  const [isConfirmationDialogOpened, setConfirmationDialogOpened] = useState(false);
  const closeConfirmationDialog = () => setConfirmationDialogOpened(false);
  const styles = useStyles();

  return (
    <>
      <Tooltip
        classes={{ tooltip: styles.tooltip }}
        title="After removing app can be added again from AppStore"
        placement="bottom-start"
      >
        <span>
          <Button
            data-testid={`${PAGE_NAME}_button`}
            onClick={() => setConfirmationDialogOpened(true)}
            variation="dangerSecondary"
          >
            REMOVE APP
          </Button>
        </span>
      </Tooltip>

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
