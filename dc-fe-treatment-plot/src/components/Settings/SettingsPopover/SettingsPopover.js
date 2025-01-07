import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { IconButton, Popover, withStyles, makeStyles } from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';

const StyledSettingsIcon = withStyles(theme => ({
  root: {
    fontSize: 16,
    color: theme.isLightTheme ? '#000' : '#CCC',
  },
}))(SettingsIcon);
const StyledIconButton = withStyles(theme => ({
  root: {
    padding: 8,
    backgroundColor: theme.isLightTheme ? '#EBEBEB' : 'rgba(255, 255, 255, 0.08)',
  },
}))(IconButton);

const useStyles = makeStyles({
  settingsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 10px',
  },
  popoverPaper: { padding: '24px 16px', marginTop: 8 },
});

function SettingsPopover({ children }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const settingsContainerRef = useRef();

  const handleClick = () => setAnchorEl(settingsContainerRef.current);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <div
      className={classNames(classes.settingsContainer, 'contentSettings')}
      data-testid="SideSetting"
      ref={settingsContainerRef}
    >
      <StyledIconButton data-testid="settingButton" onClick={handleClick}>
        <StyledSettingsIcon />
      </StyledIconButton>
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

SettingsPopover.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsPopover;
