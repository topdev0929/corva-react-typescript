import { bool, func, string } from 'prop-types';

import { Chip, Tooltip, makeStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

const useStyles = makeStyles({
  chipRoot: {
    height: '20px',
    margin: '4px',
  },
  chipDeleteIcon: {
    fontSize: '14px',
  },
});

const OffsetAssetChip = ({ children, handleDelete, handleClick, disabled, tooltipText }) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={tooltipText}
      disableFocusListener={disabled}
      disableHoverListener={disabled}
      disableTouchListener={disabled}
    >
      <Chip
        data-not-migrated-MuiChip
        color="primary"
        label={children}
        size="small"
        classes={{ root: classes.chipRoot, deleteIcon: classes.chipDeleteIcon }}
        deleteIcon={<Clear />}
        onDelete={handleDelete}
        onClick={handleClick}
        clickable={!disabled}
      />
    </Tooltip>
  );
};

OffsetAssetChip.propTypes = {
  children: string.isRequired,
  handleDelete: func,
  handleClick: func,
  disabled: bool,
  tooltipText: string,
};

OffsetAssetChip.defaultProps = {
  handleDelete: null,
  handleClick: null,
  disabled: false,
  tooltipText: '',
};

export default OffsetAssetChip;
