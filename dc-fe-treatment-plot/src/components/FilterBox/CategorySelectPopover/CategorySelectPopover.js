import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, withStyles, Tooltip, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
  },
}))(Tooltip);
const StyledSettingsIcon = withStyles({
  root: {
    fontSize: 24,
  },
})(AddIcon);
const StyledIconButton = withStyles({
  root: {
    padding: 6,
    backgroundColor: 'transparent',
  },
})(IconButton);

const useStyles = makeStyles({
  popoverPaper: { padding: '16px', marginTop: 8 },
});

function CategorySelectPopover({ children, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const settingsContainerRef = useRef();
  const classes = useStyles();

  const handleClick = e => {
    setAnchorEl(settingsContainerRef.current);
    e.stopPropagation();
  };
  const handleClose = e => {
    setAnchorEl(null);
    e.stopPropagation();
  };
  const open = Boolean(anchorEl);

  return (
    <div className="c-tp-settings-popover" ref={settingsContainerRef}>
      <StyledTooltip title={disabled ? 'No Channels' : 'Add Channel'}>
        <div>
          <StyledIconButton onClick={handleClick} disabled={disabled} color="primary">
            <StyledSettingsIcon />
          </StyledIconButton>
        </div>
      </StyledTooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: classes.popoverPaper }}
      >
        {children}
      </Popover>
    </div>
  );
}

CategorySelectPopover.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default CategorySelectPopover;
