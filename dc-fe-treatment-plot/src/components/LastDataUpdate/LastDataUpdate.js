import { memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';

const TimeFormat = 'M/D/YYYY h:mm a';

const useStyles = makeStyles(() => ({
  lastDataUpdate: {
    marginTop: 14,
    color: '#BDBDBD',
    fontSize: '8px',
    lineHeight: '12px',
  },
}));

const LastDataUpdate = ({ witsData }) => {
  const { timestamp } = witsData || {};
  const classes = useStyles();

  return (
    <div className={classes.lastDataUpdate}>
      Last update: {timestamp ? moment.unix(timestamp).format(TimeFormat) : ''}
    </div>
  );
};

LastDataUpdate.propTypes = {
  witsData: PropTypes.shape({}),
};

LastDataUpdate.defaultProps = {
  witsData: null,
};

export default memo(LastDataUpdate);
