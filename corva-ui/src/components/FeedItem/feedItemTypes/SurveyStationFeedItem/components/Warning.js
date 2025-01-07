import { bool } from 'prop-types';

import { Typography, makeStyles } from '@material-ui/core';

import NotInterestedIcon from '@material-ui/icons/NotInterested';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 20px 10px 0',
    minWidth: '290px',
  },
  warningIcon: {
    width: 60,
    height: 60,
    color: theme.palette.grey[600],
    marginRight: 15,
  },
  warningMessage: {
    color: theme.palette.grey[600],
  },
}));

const Warning = ({ isWellStatusActive }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {isWellStatusActive ? (
        <>
          <WarningIcon className={classes.warningIcon} />
          <Typography variant="body1" className={classes.warningMessage}>
            Directional accuracy is not <br />
            available at this <br />
            time
          </Typography>
        </>
      ) : (
        <>
          <NotInterestedIcon className={classes.warningIcon} />
          <Typography variant="body1" className={classes.warningMessage}>
            Well is not <br />
            active
          </Typography>
        </>
      )}
    </div>
  );
};

Warning.propTypes = {
  isWellStatusActive: bool.isRequired,
};

export default Warning;
