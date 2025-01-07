import { FunctionComponent, memo } from 'react';
import moment from 'moment';
import { makeStyles, Typography } from '@material-ui/core';

import { Well, Theme } from '../types';

const useStyles = makeStyles<Theme>(theme => ({
  lastUpdate: {
    background: 'transparent',
    fontSize: 10,
    color: theme.palette.primary.text6,
  },
}));

type AppStatusBadgeProps = {
  currentAsset: Well;
};

const AppStatusBadge: FunctionComponent<AppStatusBadgeProps> = ({ currentAsset }) => {
  const classes = useStyles();
  const lastTimeStamp = moment(currentAsset.last_active_at).format('MM/DD/YYYY hh:mm a');

  return (
    <Typography className={classes.lastUpdate}>
      Last Update:
      {lastTimeStamp}
    </Typography>
  );
};

export default memo(AppStatusBadge);
