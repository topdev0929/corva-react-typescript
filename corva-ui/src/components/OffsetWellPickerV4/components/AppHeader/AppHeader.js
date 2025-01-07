import PropTypes from 'prop-types';
import { Divider, Tooltip } from '@material-ui/core';
import { Regular12, Regular14, Regular20 } from '~/components/Typography';
import { ViewType } from '../../constants';
import { CustomInfoIcon } from '../CustomInfoIcon';
import styles from './AppHeader.module.css';

const PAGE_NAME = 'AppHeader';

export const AppHeader = ({
  isWDUser,
  viewType,
  totalCount,
  selectedCount,
  isViewOnly,
  maxOffsetwellNumber,
}) => {
  if (viewType === ViewType.mobile) {
    return (
      <div className={styles.headerContainer}>
        <Regular20>Select Offset Wells</Regular20>
      </div>
    );
  }

  return (
    <div className={styles.headerContainer}>
      <Regular20>Select Offset Wells</Regular20>
      <Divider className={styles.divideLine} />
      <Regular14 className={styles.totalLabel}>Total:</Regular14>
      <Regular14 data-testid={`${PAGE_NAME}_totalWells`} className={styles.countValue}>
        {totalCount}
      </Regular14>
      <Regular14 className={styles.selectedLabel}>Selected:</Regular14>
      <Regular14 data-testid={`${PAGE_NAME}_selected`} className={styles.countValue}>
        {selectedCount}
      </Regular14>
      <Tooltip
        title={`App can’t process more than (${maxOffsetwellNumber - 1}) Offset Wells.`}
        placement="right"
      >
        <Regular12 data-testid={`${PAGE_NAME}_maxOffsetSize`} className={styles.maxOffsetSize}>
          /{maxOffsetwellNumber - 1}
        </Regular12>
      </Tooltip>
      {isViewOnly && <CustomInfoIcon viewType={viewType} isWDUser={isWDUser} />}
    </div>
  );
};

AppHeader.propTypes = {
  viewType: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,
  selectedCount: PropTypes.number.isRequired,
  maxOffsetwellNumber: PropTypes.number.isRequired,
};
