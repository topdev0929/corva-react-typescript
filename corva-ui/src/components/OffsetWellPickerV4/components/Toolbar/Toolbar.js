import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import {
  Sort as SortIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { Button, SwitchControl } from '~/components';
import { ViewType } from '../../constants';
import styles from './Toolbar.module.css';

const PAGE_NAME = 'Toolbar';

export const Toolbar = ({
  isViewOnly,
  viewType,
  filters,
  setFilters,
  isFilterExpanded,
  setIsFilterExpanded,
  isMapHidden,
  setIsMapHidden,
}) => {
  return (
    <div
      className={classNames(styles.controlGroup, {
        [styles.controlGroupSmall]: viewType === ViewType.small,
        [styles.controlGroupMobile]: viewType === ViewType.mobile,
      })}
    >
      <Button
        data-testid={`${PAGE_NAME}_filters`}
        startIcon={isFilterExpanded ? <SortIcon /> : <FilterListIcon />}
        classes={{ root: styles.filterButton }}
        onClick={() => setIsFilterExpanded(prev => !prev)}
        disabled={isViewOnly}
      >
        Filters
        {!isEmpty(filters) && (
          <div
            className={styles.clearWrapper}
            onClick={e => {
              e.stopPropagation();
              setFilters({});
            }}
          >
            <CloseIcon className={styles.clearIcon} />
            <span className={styles.clearLabel}>Clear</span>
          </div>
        )}
      </Button>
      <SwitchControl
        data-testid={`${PAGE_NAME}_map`}
        rightLabel="Map"
        color="primary"
        checked={!isMapHidden}
        onChange={e => setIsMapHidden(!e.target.checked)}
      />
    </div>
  );
};

Toolbar.propTypes = {
  isViewOnly: PropTypes.bool.isRequired,
  viewType: PropTypes.string.isRequired,
  filters: PropTypes.shape({}).isRequired,
  setFilters: PropTypes.func.isRequired,
  isFilterExpanded: PropTypes.bool.isRequired,
  setIsFilterExpanded: PropTypes.func.isRequired,
  isMapHidden: PropTypes.bool.isRequired,
  setIsMapHidden: PropTypes.func.isRequired,
};
