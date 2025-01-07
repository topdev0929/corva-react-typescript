import { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Tooltip, IconButton, makeStyles } from '@material-ui/core';

import IconPark from '../IconPark';

const useStyles = makeStyles(theme => ({
  controlLayer: {
    position: 'absolute !important',
    top: '18px',
    left: `var(--reset-button)`,
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconButton: {
    width: '30px',
    height: '30px',
    color: theme.palette.primary.text6,
    backgroundColor: theme.palette.background.b6,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: `${theme.palette.background.b11} !important`,
      color: theme.palette.primary.text1,
    },
    '&:hover .icon': {
      fill: theme.palette.primary.text1,
    },
  },
  activeButton: {
    color: theme.palette.primary.light,
  },
  icon: {
    width: '16px',
    height: '16px',
  },
  eventActionsWrapper: {
    margin: '0 0 0 auto',
    zIndex: 999,
  },
  cancelButton: {
    marginRight: '16px !important',
  },
  hideAxesIcon: {
    top: 0,
    transform: 'rotate(45deg)',
  },
}));

function ControlLayer({
  marginRight,
  isEditing,
  setIsEditing,
  showEditEvents,
  handleClickEditEvents,
  handleUpdateCriticalPoints,
  showAxes,
  setShowAxes,
  preResetRange,
  handleResetZoom,
  panEnable,
  setPanEnable,
}) {
  const classes = useStyles();
  const [isHideAxesTooltipShown, setIsHideAxesTooltipShown] = useState(false);

  return (
    <div className={classes.controlLayer}>
      <Tooltip open={isHideAxesTooltipShown} title={showAxes ? 'Hide Axes' : 'Show Axes'}>
        <IconButton
          size="small"
          className={classes.iconButton}
          onClick={() => {
            setShowAxes(prev => !prev);
            setIsHideAxesTooltipShown(false);
          }}
          onPointerOver={() => setIsHideAxesTooltipShown(true)}
          onPointerOut={() => setIsHideAxesTooltipShown(false)}
        >
          {showAxes ? (
            <IconPark iconType="CollapseTextInput" className={classes.hideAxesIcon} />
          ) : (
            <IconPark iconType="ExpandTextInput" className={classes.hideAxesIcon} />
          )}
        </IconButton>
      </Tooltip>
      {showEditEvents && (
        <Tooltip title="Edit Events">
          <IconButton size="small" className={classes.iconButton} onClick={handleClickEditEvents}>
            <IconPark iconType="Edit" className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
      {Boolean(preResetRange) && (
        <Tooltip title="Reset Zoom">
          <IconButton className={classes.iconButton} onClick={handleResetZoom}>
            <IconPark iconType="Undo" className={classes.icon} />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Pan Mode">
        <IconButton
          className={classnames(classes.iconButton, { [classes.activeButton]: panEnable })}
          onClick={() => setPanEnable(!panEnable)}
        >
          <IconPark iconType="FiveFive" className={classes.icon} />
        </IconButton>
      </Tooltip>
      {isEditing && (
        <div className={classes.eventActionsWrapper} style={{ marginRight }}>
          <Button
            color="primary"
            size="small"
            onClick={() => setIsEditing(false)}
            classes={{ root: classes.cancelButton }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleUpdateCriticalPoints}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

ControlLayer.propTypes = {
  marginRight: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  showEditEvents: PropTypes.bool.isRequired,
  handleClickEditEvents: PropTypes.func.isRequired,
  handleUpdateCriticalPoints: PropTypes.func.isRequired,
  showAxes: PropTypes.bool.isRequired,
  setShowAxes: PropTypes.func.isRequired,
  preResetRange: PropTypes.shape({}).isRequired,
  handleResetZoom: PropTypes.func.isRequired,
  panEnable: PropTypes.bool.isRequired,
  setPanEnable: PropTypes.func.isRequired,
};

export default ControlLayer;
