import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import styles from './CustomInfoIcon.module.css';
import { ViewType, LEAVE_TOUCH_DELAY } from '../../constants';

export function CustomInfoIcon({ viewType, isWDUser }) {
  return (
    <Tooltip
      title={`View only mode. To edit offsets, use ${
        isWDUser ? 'Offset Well Selection app.' : 'Wellhub.'
      }`}
      enterTouchDelay={viewType === ViewType.mobile && 0}
      leaveTouchDelay={viewType === ViewType.mobile && LEAVE_TOUCH_DELAY}
      placement={viewType === ViewType.mobile ? '' : 'right'}
    >
      <div className={styles.infoWrapper}>
        <InfoIcon className={styles.infoIcon} />
      </div>
    </Tooltip>
  );
}

CustomInfoIcon.propTypes = {
  viewType: PropTypes.string.isRequired,
};
