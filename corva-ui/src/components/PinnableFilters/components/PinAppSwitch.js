import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Tooltip } from '@material-ui/core';
import pinIcon from './pin.svg';

const muiStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: 'auto',
    color: '#999999',
  },
  icon: {
    marginRight: '6px',
  },
  label: {
    fontSize: '10px',
    lineHeight: '14px',
  },
};

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.9)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: '16px',
    borderRadius: '4px',
  },
})(Tooltip);

function PinAppSwitch({ isPinned, onClick, classes }) {
  return (
    <StyledTooltip title={isPinned ? 'Unpin Filters' : 'Pin Filters'} enterTouchDelay={10}>
      <div
        onClick={onClick}
        className={classes.container}
        style={{ alignSelf: isPinned ? 'flex-end' : 'flex-start' }}
      >
        <>
          <img src={pinIcon} alt="Pin icon" className={classes.icon} />
          <Typography variant="body2" className={classes.label}>
            {isPinned ? 'Unpin' : 'Pin'}
          </Typography>
        </>
      </div>
    </StyledTooltip>
  );
}

PinAppSwitch.propTypes = {
  isPinned: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(muiStyles)(PinAppSwitch);
