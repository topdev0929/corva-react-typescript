import { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

import { ToasterType } from './types';

const useStyles = makeStyles(theme => ({
  notificationContainer: {
    position: 'absolute',
    height: 24,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 16,
    zIndex: 999,
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(65, 65, 65, 0.7)',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
  notificationIcon: {
    width: 24,
    color: theme.palette.primary.text6,
    fontSize: 12,
    lineHeight: '24px',
  },
  notificationLabel: {
    color: theme.palette.primary.text6,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '17px',
    letterSpacing: 0.4,
    paddingRight: 12,
  },
}));

const DEFAULT_AUTO_HIDE_DURATION = 3000;

interface ToasterProps extends ToasterType {
  onDismiss: () => void;
}

export function Toaster({
  message,
  autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
  onDismiss,
}: ToasterProps): JSX.Element {
  const classes = useStyles();

  useEffect(() => {
    const timeout = setTimeout(onDismiss, autoHideDuration);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={classes.notificationContainer}>
      <div className={classes.notificationContent}>
        <CheckIcon className={classes.notificationIcon} />
        <Typography className={classes.notificationLabel}>{message}</Typography>
      </div>
    </div>
  );
}
