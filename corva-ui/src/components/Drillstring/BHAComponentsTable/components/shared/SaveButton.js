import PropTypes from 'prop-types';
import { Tooltip, IconButton } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import { useStyles } from '../sharedStyles';

export function SaveButton({ handleSave, disabled }) {
  const classes = useStyles();

  return (
    <Tooltip title={disabled ? '' : 'Save Changes'}>
      <IconButton className={classes.actionButton} onClick={handleSave} disabled={disabled}>
        <CheckIcon className={classes.actionIcon} color={disabled ? 'disabled' : 'primary'} />
      </IconButton>
    </Tooltip>
  );
}

SaveButton.propTypes = {
  handleSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SaveButton.defaultProps = {
  disabled: false,
};
