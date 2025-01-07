import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { useStyles } from '../sharedStyles';

export function CancelButton({ handleCancel }) {
  const classes = useStyles();

  return (
    <Tooltip title="Cancel">
      <IconButton className={classes.actionButton} onClick={handleCancel}>
        <ClearIcon className={classes.actionIcon} />
      </IconButton>
    </Tooltip>
  );
}

CancelButton.propTypes = {
  handleCancel: PropTypes.func.isRequired,
};
