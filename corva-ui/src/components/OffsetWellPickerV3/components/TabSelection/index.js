import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { makeStyles, Typography, MenuItem, Tooltip, Chip } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton as ToggleButtonComponent } from '@material-ui/lab';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import CloseIcon from '@material-ui/icons/Close';
import { Select as SelectComponent } from '~/components';
import {
  SELECTION_TABS_LABEL,
  DATA_SOURCE_TYPE,
  FILTER_BASEDON_TYPE,
  SELECTION_TAB_TYPE,
} from '../../constants';
import ToggleMapButton from './ToggleMapButton';
import { DEFAULT_SETTINGS } from '../CustomSelectionView/constants';

const useStyles = makeStyles(theme => ({
  tabSelectionWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '12px',
    flexDirection: ({ isTablet, isMobile }) => !isTablet && isMobile && 'column',
    gap: ({ isTablet, isMobile }) => !isTablet && isMobile && '12px',
    marginBottom: ({ isMobile, isTablet }) => (isMobile && !isTablet ? '16px' : '24px'),
  },
  toggleButton: {
    width: ({ isTablet, isMobile }) => {
      if (isTablet) return '160px';
      else if (isMobile) return '100%';
      else return '215px';
    },
    padding: ({ isMobile }) => isMobile && '0px !important',
  },
  toggleLabel: {
    marginTop: '2px',
  },
  wellSections: {
    fontSize: '12px',
    color: theme.palette.primary.text6,
    marginRight: '16px',
  },
  actionWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  customAction: {
    justifyContent: 'space-between',
  },
  filterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ({ isMobile, isTablet }) => (isMobile && !isTablet ? '0px' : '16px'),
    padding: '5px 8px',
    cursor: 'pointer',
    color: theme.palette.primary.text6,
    '&:hover': {
      background: theme.palette.background.b7,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
      borderRadius: '4px',
      color: theme.palette.primary.text1,
    },
  },
  filters: {
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '1px',
  },
  selectComponent: {
    maxWidth: 240,
    minWidth: 60,
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  selectedChip: {
    background: `${theme.palette.background.b7} !important`,
  },
  chipLabel: {
    color: `${theme.palette.primary.text6} !important`,
  },
}));

function TabSelection({
  dataSource,
  filterBasedOn,
  selectedTab,
  setSelectedTab,
  sectionOptions,
  selectedSection,
  setSelectedSection,
  mapHidden,
  onToggleMap,
  filtersHidden,
  onToggleFilters,
  isTablet,
  isMobile,
  customFilters,
  setIsClearFilters,
}) {
  const classes = useStyles({ isTablet, isMobile });

  const selectionTabs = useMemo(() => {
    if (dataSource === DATA_SOURCE_TYPE.offsetWellSelectionApp) {
      return [
        { key: SELECTION_TAB_TYPE.bic, label: SELECTION_TABS_LABEL.offsetWell },
        { key: SELECTION_TAB_TYPE.custom, label: SELECTION_TABS_LABEL.custom },
      ];
    }

    return [
      { key: SELECTION_TAB_TYPE.bic, label: SELECTION_TABS_LABEL.wellhub },
      { key: SELECTION_TAB_TYPE.custom, label: SELECTION_TABS_LABEL.custom },
    ];
  }, [dataSource]);

  const handleTabChange = (e, selection) => {
    if (selection) setSelectedTab(selection);
  };

  const handleChangeSection = e => {
    setSelectedSection(e.target.value);
  };

  const handleToggleMap = () => {
    onToggleMap(value => !value);
  };

  const handleToggleFilters = () => {
    onToggleFilters(value => !value);
  };

  const changedFiltersCounter = useMemo(() => {
    if (!isEmpty(customFilters)) {
      const len =
        Object.keys(get(customFilters, 'filters')).length +
        (get(customFilters, 'excludeSideTrack') ? 1 : 0) +
        (get(customFilters, 'radius') !== DEFAULT_SETTINGS.radius ? 1 : 0);
      return len;
    } else return 0;
  }, [customFilters]);

  return (
    <div className={classes.tabSelectionWrapper}>
      <ToggleButtonGroup value={selectedTab} onChange={handleTabChange} size="medium" exclusive>
        {selectionTabs.map(({ key, label }) => (
          <ToggleButtonComponent
            key={`tab-selection-${key}`}
            value={key}
            className={classes.toggleButton}
            classes={{ label: classes.toggleLabel }}
          >
            {label}
          </ToggleButtonComponent>
        ))}
      </ToggleButtonGroup>
      {selectedTab === SELECTION_TAB_TYPE.bic &&
        dataSource === DATA_SOURCE_TYPE.offsetWellSelectionApp &&
        filterBasedOn === FILTER_BASEDON_TYPE.wellSections && (
          <div className={classes.actionWrapper}>
            <Typography className={classes.wellSections}>Well Section:</Typography>
            <SelectComponent
              disableUnderline
              value={selectedSection}
              className={classes.selectComponent}
              onChange={handleChangeSection}
              FormControlProps={{
                variant: 'standard',
              }}
            >
              {sectionOptions.map(section => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </SelectComponent>
          </div>
        )}
      {selectedTab === SELECTION_TAB_TYPE.custom && (
        <div className={classNames(classes.actionWrapper, classes.customAction)}>
          <div className={classes.filterContainer}>
            <Tooltip title={filtersHidden ? 'Expand Filters' : 'Collapse Filters'}>
              <div className={classes.filterWrapper} onClick={handleToggleFilters}>
                {!filtersHidden && (isTablet || !isMobile) ? <SortIcon /> : <FilterListIcon />}
                <Typography className={classes.filters}>FILTERS</Typography>
              </div>
            </Tooltip>
            {!isTablet && isMobile && (
              <Chip
                classes={{
                  root: classes.selectedChip,
                  labelSmall: classes.chipLabel,
                  deleteIcon: classes.chipLabel,
                }}
                size="small"
                label={changedFiltersCounter}
                deleteIcon={<CloseIcon />}
                onDelete={() => setIsClearFilters(true)}
              />
            )}
          </div>
          <ToggleMapButton
            mapHidden={mapHidden}
            onToggleMap={handleToggleMap}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
}

TabSelection.propTypes = {
  dataSource: PropTypes.string.isRequired,
  filterBasedOn: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
  sectionOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedSection: PropTypes.any.isRequired,
  setSelectedSection: PropTypes.func.isRequired,
  mapHidden: PropTypes.bool.isRequired,
  onToggleMap: PropTypes.func.isRequired,
  filtersHidden: PropTypes.bool.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  customFilters: PropTypes.shape({}).isRequired,
  setIsClearFilters: PropTypes.func.isRequired,
};

export default TabSelection;
