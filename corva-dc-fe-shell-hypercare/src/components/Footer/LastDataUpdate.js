import { memo, useContext } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';

import AppContext from '~/AppContext';

const TimeFormat = 'M/D/YYYY h:mm a';

const useStyles = makeStyles(theme => ({
  lastDataUpdate: {
    color: theme.palette.primary.text6,
    fontSize: '10px',
    lineHeight: '12px',
  },
}));

const LastDataUpdate = () => {
  const classes = useStyles();
  const { lastTimestamp } = useContext(AppContext);

  return (
    <div className={classes.lastDataUpdate}>
      Last update: {lastTimestamp ? moment.unix(lastTimestamp).format(TimeFormat) : ''}
    </div>
  );
};

export default memo(LastDataUpdate);
