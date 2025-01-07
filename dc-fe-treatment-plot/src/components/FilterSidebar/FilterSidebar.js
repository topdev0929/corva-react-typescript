import { memo, useContext, useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { makeStyles, Button } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { AppSideBar, Modal } from '@corva/ui/components';

import FilterBoxContainer from '../FilterBox/FilterBoxContainer';
import FilterBoxEditDialog from '../FilterBox/FilterBoxEditDialog';

import { LayoutContext } from '../../context/layoutContext';

const useStyles = makeStyles({
  scrollableContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  openFiltersButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginLeft: 12,
    zIndex: 1,
  },
  closeFiltersButton: {
    marginLeft: 'auto',
    marginRight: 16,
  },
});

const FilterPopup = ({ onFilterSettingChange, onSettingChange, ...props }) => {
  const styles = useStyles();
  const [isOpened, setIsOpened] = useState(false);
  const [filterSetting, setFilterSetting] = useState(props.filterSetting);
  const [setting, setSetting] = useState({
    dataSetting: props.dataSetting,
    customTimeSetting: props.customTimeSetting,
  });

  const closeFilterPopup = () => setIsOpened(false);

  const saveFilterPopup = () => {
    onFilterSettingChange(filterSetting);
    onSettingChange('dataSetting', setting.dataSetting);
    onSettingChange('customTimeSetting', setting.customTimeSetting);
    closeFilterPopup();
  };

  useEffect(() => {
    if (isOpened) {
      setFilterSetting(props.filterSetting);
      setSetting({
        dataSetting: props.dataSetting,
        customTimeSetting: props.customTimeSetting,
      });
    }
  }, [isOpened]);

  return (
    <>
      <Button className={styles.openFiltersButton} onClick={() => setIsOpened(true)}>
        <FilterListIcon />
        FILTERS
      </Button>
      <Modal
        open={isOpened}
        onClose={closeFilterPopup}
        title="Filters"
        size="extraLarge"
        actions={
          <>
            <Button
              color="primary"
              className={styles.closeFiltersButton}
              onClick={closeFilterPopup}
            >
              Cancel
            </Button>
            <Button color="primary" variant="contained" onClick={saveFilterPopup}>
              Save
            </Button>
          </>
        }
      >
        <div className={classNames(styles.scrollableContent, 'filtersPopupContent')}>
          <FilterBoxContainer
            {...props}
            {...setting}
            filterSetting={filterSetting}
            onSettingChange={(key, newSetting) =>
              setSetting(value => ({ ...value, [key]: newSetting }))
            }
            onFilterSettingChange={setFilterSetting}
          />
          <FilterBoxEditDialog {...props} onScaleSettingChange={onSettingChange} />
        </div>
      </Modal>
    </>
  );
};
function FilterSidebar(props) {
  const { state, dispatch: layoutStoreDispatch, isResponsive } = useContext(LayoutContext);
  const styles = useStyles();

  useLayoutEffect(() => {
    layoutStoreDispatch({});
  }, [layoutStoreDispatch, state.isRealtimeSidebarOpen, props.realtimeTypes]);

  const handleOpenSideBar = () => {
    layoutStoreDispatch({ type: 'OPEN_FILTER_SIDEBAR' });
    props.onOpenClose('isFilterSidebarOpen', true);
  };

  const handleCloseSidebar = () => {
    layoutStoreDispatch({ type: 'CLOSE_FILTER_SIDEBAR' });
    props.onOpenClose('isFilterSidebarOpen', false);
  };

  const handleSideBar = status => {
    if (status) handleOpenSideBar();
    else handleCloseSidebar();
  };

  return (
    <>
      {isResponsive ? (
        <FilterPopup {...props} />
      ) : (
        <AppSideBar
          size="small"
          isOpen={state.isFilterSidebarOpen}
          setIsOpen={handleSideBar}
          anchor="left"
          header={<span>filter</span>}
          headerIcon={<FilterListIcon />}
        >
          <div className={styles.scrollableContent}>
            <div>
              <FilterBoxContainer {...props} />
              <FilterBoxEditDialog {...props} onScaleSettingChange={props.onSettingChange} />
            </div>
          </div>
        </AppSideBar>
      )}
    </>
  );
}

FilterSidebar.propTypes = {
  assetId: PropTypes.number,
  currentStage: PropTypes.number,
  showManualStages: PropTypes.bool.isRequired,
  isPadMode: PropTypes.bool.isRequired,
  filterSetting: PropTypes.shape({
    stageMode: PropTypes.string,
    customActiveMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    viewMode: PropTypes.string,
    manualStages: PropTypes.array,
    refPoint: PropTypes.string,
  }).isRequired,
  customTimeSetting: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  assetTimeLimits: PropTypes.shape({
    firstTimestamp: PropTypes.number,
    lastTimestamp: PropTypes.number,
  }).isRequired,
  scaleSetting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dataSetting: PropTypes.shape({}).isRequired,
  mappedChemicals: PropTypes.arrayOf(PropTypes.object).isRequired,
  offsetPressures: PropTypes.arrayOf(PropTypes.object).isRequired,
  customChannels: PropTypes.arrayOf(PropTypes.object).isRequired,
  graphColors: PropTypes.shape({}).isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onFilterSettingChange: PropTypes.func.isRequired,
  onOpenClose: PropTypes.func.isRequired,
  realtimeTypes: PropTypes.shape({}).isRequired,
};

FilterPopup.propTypes = {
  onFilterSettingChange: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  filterSetting: FilterSidebar.propTypes.filterSetting,
  dataSetting: FilterSidebar.propTypes.dataSetting,
  customTimeSetting: FilterSidebar.propTypes.customTimeSetting,
};

export default memo(FilterSidebar);
