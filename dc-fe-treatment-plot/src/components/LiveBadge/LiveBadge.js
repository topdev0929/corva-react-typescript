import { memo } from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './LiveBadgeStyles';

const LiveBadge = props => {
  const { grid, isLive } = props;
  const classes = useStyles();
  const style = {
    right: `${grid.right + 5}px`,
    top: `${grid.top + 20}px`,
  };

  return (
    isLive && (
      <div className={classes.liveBadge} style={style}>
        LIVE
        <div className={classes.liveBadgeOuterCircle} />
        <div className={classes.liveBadgeInnerCircle} />
      </div>
    )
  );
};

LiveBadge.propTypes = {
  isLive: PropTypes.bool.isRequired,
  grid: PropTypes.shape({
    right: PropTypes.number,
    top: PropTypes.number,
  }).isRequired,
};

export default memo(LiveBadge);
