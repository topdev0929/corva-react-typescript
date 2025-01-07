import { memo } from 'react';
import PropTypes from 'prop-types';

import styles from './LiveBadge.css';

const LiveBadge = props => {
  const { grid, isLive } = props;

  const style = {
    right: `${grid.right + 6}px`,
    top: `${grid.top + 10}px`,
  };

  return (
    isLive && (
      <div className={styles.cPDLiveBadge} style={style}>
        <span /> Live
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
