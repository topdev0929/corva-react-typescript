import { func } from 'prop-types';
import { Avatar, Typography, Tooltip as MuiTooltip, makeStyles } from '@material-ui/core';

import Fullscreen from '@material-ui/icons/Fullscreen';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

import styles from '../styles.css';

const useStyles = makeStyles({
  appActionIcon: {
    cursor: 'pointer',
  },
  fullscreenIcon: {
    cursor: 'pointer',
    color: '#fff',
    fontSize: 24,
  },
  infoIcon: {
    color: '#90caf9',
    fontSize: 20,
  },
  avatar: {
    background: '#ffffff19',
    marginTop: '-8px',
  },
});

const AppInfo = ({ setMaximized }) => {
  const classes = useStyles();
  return (
    <div className={styles.embeddedAppFullscreen} onClick={() => setMaximized(true)}>
      <div className={styles.embeddedAppFullscreenTitle}>
        <InfoIcon className={classes.infoIcon} />
        <Typography variant="body2">
          <span className={styles.embeddedAppFullscreenText}>Some app interactions disabled</span>
        </Typography>
      </div>
      <MuiTooltip title="Fullscreen">
        <Avatar className={classes.avatar}>
          <Fullscreen className={classes.fullscreenIcon} color="action" />
        </Avatar>
      </MuiTooltip>
    </div>
  );
};

AppInfo.propTypes = {
  setMaximized: func.isRequired,
};

const AppInfoMaximized = ({ setMaximized }) => {
  const classes = useStyles();
  return (
    <>
      <div className={styles.embeddedAppFullscreenAppClose}>
        <CloseIcon className={classes.appActionIcon} onClick={() => setMaximized(false)} />
      </div>
      <div className={styles.embeddedAppFullscreenAppInfo}>
        <div className={styles.embeddedAppFullscreenTitle}>
          <InfoIcon className={classes.infoIcon} />
          <Typography variant="body2">
            <span className={styles.embeddedAppFullscreenText}>Some app interactions disabled</span>
          </Typography>
        </div>
      </div>
    </>
  );
};

AppInfoMaximized.propTypes = {
  setMaximized: func.isRequired,
};

export { AppInfo, AppInfoMaximized };
