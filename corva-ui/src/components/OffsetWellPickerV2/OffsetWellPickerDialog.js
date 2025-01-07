import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { uniq, orderBy, get } from 'lodash';
import {
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classnames from 'classnames';

import { usePermissions, PERMISSIONS } from '~/permissions';
import LoadingIndicator from '~components/LoadingIndicator';

import Filter from './components/Filter';
import WellsMap from './components/Map';
import WellsTable from './components/Table';

import {
  useCompanies,
  useCompanyMetricKey,
  useWells,
  useFilteredWells,
  useWellsWithCoords,
  useOffsetWells,
  useBidirectionalFiltering,
  useMetricsData,
  useRadiusWells,
} from './effects';
import { DEFAULT_SETTINGS } from './constants';

const PAGE_NAME = 'OffsetsPickerDialog';

const useStyles = makeStyles(theme => ({
  dialogTitles: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontSize: 14,
    color: '#03BCD4',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  subTitleSpace: {
    fontSize: 14,
    color: '#03BCD4',
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
  },
  closeIconButton: {
    fontSize: 20,
    padding: 4,
    '&:hover $closeIcon': {
      color: '#fff',
    },
  },
  closeIcon: {
    color: '#BDBDBD',
  },
  dialogActions: {
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  bottomShadow: {
    width: '100%',
    height: '16px',
    backgroundImage: `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9})`,
    position: 'absolute',
    bottom: '52px',
    zIndex: 2,
  },
  dialogActionsSmallScreen: {
    paddingRight: '100px', // Intercom
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabs: {
    background: '#414141',
  },
  selectedWells: {
    display: 'flex',
    alignItems: 'center',
  },
  selected: {
    fontSize: 16,
  },
  selectedLabel: {
    fontSize: 12,
    marginLeft: 14,
    color: 'rgba(255, 255, 255, 0.54)',
  },
  selectedNumber: {
    fontSize: 12,
    margin: 4,
    color: 'rgba(255, 255, 255, 0.8)',
  },
}));

const OffsetsPickerDialog = ({
  isOpen,
  defaultSubjectWellId,
  companyId,
  offsetSetting,
  currentUser,
  addWellsUsabilityInfo,
  unusableWellAlarm,
  isAdvancedSearch,
  bestCount,
  onClose,
  onSave,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [{ active: canViewCompanies }] = usePermissions([PERMISSIONS.companySelectorView]);

  const [assetCompanyId, setAssetCompanyId] = useState(
    companyId || get(offsetSetting, 'companyId') || +get(currentUser, 'company_id')
  );
  const [subjectWellId, setSubjectWellId] = useState(
    get(offsetSetting, 'subjectWellId') || defaultSubjectWellId
  );
  const [filters, setFilters] = useState(get(offsetSetting, 'filters') || DEFAULT_SETTINGS.filters);
  const [radius, setRadius] = useState(get(offsetSetting, 'radius') || DEFAULT_SETTINGS.radius);
  const [excludeSideTrack, setExcludeSideTrack] = useState(get(offsetSetting, 'excludeSideTrack') || false);
  const [excludeNonEngineeredWells, setExcludeNonEngineeredWells] = useState(
    get(offsetSetting, 'excludeNonEngineeredWells')  || false
  );
  const [metricsKeys, setMetricsKeys] = useState([]);
  const [sortInfo, setSortInfo] = useState(DEFAULT_SETTINGS.sortInfo);
  const [mapHidden, setMapHidden] = useState(false);
  const [selectedWellIds, setSelectedWellIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedWellIds(get(offsetSetting, 'selectedWellIds') || []);
      setAssetCompanyId(
        companyId || get(offsetSetting, 'companyId') || +get(currentUser, 'company_id')
      );
      setSubjectWellId(get(offsetSetting, 'subjectWellId') || defaultSubjectWellId);
    }
  }, [isOpen, offsetSetting]);

  const isRadiusEditable = useMemo(() => {
    return !!subjectWellId;
  }, [subjectWellId]);

  // NOTE: Fetch all companies
  const companies = useCompanies(
    canViewCompanies,
    isAdvancedSearch && defaultSubjectWellId,
    assetCompanyId
  );

  // NOTE: fetch all wells for the currently selected company
  const wells = useWells(assetCompanyId, addWellsUsabilityInfo);

  // Note: fetch company metric key
  const companyMetricKey = useCompanyMetricKey(assetCompanyId);

  useEffect(() => {
    setMetricsKeys(prev => {
      return companyMetricKey ? [companyMetricKey] : prev;
    });
  }, [companyMetricKey]);

  // NOTE: Get available options for every filters
  const filtersOptions = useBidirectionalFiltering(filters, wells);

  // NOTE: Filter wells by target formation, string design, program, basin, county, area
  const filteredWells = useFilteredWells(
    filters,
    excludeSideTrack,
    excludeNonEngineeredWells,
    wells
  );

  // NOTE: get subject well from id
  const subjectWell = useMemo(() => {
    return filteredWells && subjectWellId
      ? filteredWells.find(well => well.id === subjectWellId)
      : null;
  }, [filteredWells, subjectWellId]);

  // NOTE: All matched wells regardless of is_usable field
  const filteredWellsWithCoords = useWellsWithCoords(filteredWells, subjectWell);

  // NOTE: Update selectedWellIds by radius
  useRadiusWells(radius, filteredWellsWithCoords, setSelectedWellIds);

  // NOTE: Get offset wells (only usable wells)
  const offsetWells = useOffsetWells(radius, wells, selectedWellIds);

  // NOTE: Fetch metrics for all filtered wells
  const [isMetricsLoading, filteredWellsWithMetric] = useMetricsData(
    assetCompanyId,
    filteredWellsWithCoords
  );

  // NOTE: Sort wells by focused metric
  const sortedFilteredWells = useMemo(() => {
    if (!filteredWellsWithMetric) {
      return filteredWellsWithMetric;
    }

    return orderBy(
      filteredWellsWithMetric,
      sortInfo.key,
      sortInfo.direction === 1 ? 'asc' : 'desc'
    );
  }, [sortInfo, filteredWellsWithMetric]);

  const handleChangeCompany = useCallback(newCompanyId => {
    setAssetCompanyId(newCompanyId);
    setSubjectWellId(null);
    setSelectedWellIds([]);
    setFilters(DEFAULT_SETTINGS.filters);
  }, []);

  const handleAddOffsetWell = useCallback(
    targetId => {
      // Do not allow to add unusuable wells
      const currentWell = filteredWells.find(well => well.id === targetId);
      if (!currentWell || !currentWell.is_usable) {
        return;
      }

      setSelectedWellIds(uniq(selectedWellIds.concat(targetId)));
    },
    [selectedWellIds, filteredWells]
  );

  const handleDeleteOffsetWell = useCallback(
    targetId => {
      setSelectedWellIds(uniq(selectedWellIds.filter(wellId => wellId !== targetId)));
    },
    [selectedWellIds]
  );

  const handleAddAllOffsetWells = useCallback(() => {
    setSelectedWellIds(filteredWells.filter(well => well.is_usable).map(well => well.id));
  }, [filteredWells]);

  const handleDeleteAllOffsetWells = useCallback(() => {
    setSelectedWellIds([]);
  }, [filteredWells]);

  const handleSetSubjectWell = useCallback(
    targetId => {
      setSelectedWellIds([]);
      setSubjectWellId(targetId);
    },
    [wells]
  );

  const handleRemoveSubjectWell = useCallback(() => {
    setSelectedWellIds([]);
    setSubjectWellId(null);
  }, []);

  const handleChangeRadius = useCallback(newRadius => {
    setRadius(newRadius);
  }, []);

  const handleChangeSidetrack = useCallback(checked => {
    setExcludeSideTrack(checked);
  }, []);

  const handleChangeNonEngineeredWells = useCallback(checked => {
    setExcludeNonEngineeredWells(checked);
  }, []);

  const handleChangeFilters = useCallback((key, newValues) => {
    setFilters(prev => ({ ...prev, [key]: newValues }));
    setSelectedWellIds([]);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_SETTINGS.filters });
    setSelectedWellIds([]);
  }, []);

  const handleToggleMap = useCallback(() => {
    setMapHidden(value => !value);
  }, []);

  const handleChangeMetricsKeys = useCallback(newMetricsKeys => {
    setMetricsKeys(newMetricsKeys);
  }, []);

  // NOTE: Use column index to determine which metric is used for sorting
  const handleSorting = useCallback(newKey => {
    setSortInfo(prevInfo => {
      return prevInfo.key === newKey
        ? {
            ...prevInfo,
            direction: prevInfo.direction * -1,
          }
        : {
            key: newKey,
            direction: 1,
          };
    });
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    const setting = {
      ...offsetSetting,
      companyId: assetCompanyId,
      subjectWellId,
      radius,
      excludeSideTrack,
      excludeNonEngineeredWells,
      filters,
      selectedWellIds: uniq(offsetWells.map(offsetWell => offsetWell.id)),
    };

    onSave(setting, offsetWells);
  };

  const isLoading =
    !wells ||
    !filteredWells ||
    !filteredWellsWithCoords ||
    !filteredWellsWithMetric ||
    !offsetWells ||
    !sortedFilteredWells;

  return (
    <Dialog
      onBackdropClick={onClose}
      onEscapeKeyDown={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isFullScreen}
      open={isOpen}
    >
      <DialogTitle>
        <div className={classes.dialogTitles}>
          {!isAdvancedSearch ? (
            <Typography className={classes.title}>Select Offset Wells</Typography>
          ) : (
            <div className={classes.titleArea}>
              <Typography className={classes.subTitle} onClick={handleClose}>
                Select Offset Wells
              </Typography>
              <Typography className={classes.subTitleSpace}>&nbsp;/&nbsp;</Typography>
              <Typography className={classes.title}>Advanced Search</Typography>
            </div>
          )}
          <Tooltip title="Close">
            <IconButton
              data-not-migrated-muiiconbutton
              aria-label="close"
              className={classes.closeIconButton}
              onClick={onClose}
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!isLoading ? (
          <>
            <Filter
              companyId={assetCompanyId}
              companies={companies}
              canViewCompanies={canViewCompanies}
              radius={radius}
              excludeSideTrack={excludeSideTrack}
              excludeNonEngineeredWells={excludeNonEngineeredWells}
              wells={filteredWells}
              subjectWell={subjectWell}
              filters={filters}
              filtersOptions={filtersOptions}
              mapHidden={mapHidden}
              isRadiusEditable={isRadiusEditable}
              onChangeCompany={handleChangeCompany}
              onSetSubjectWell={handleSetSubjectWell}
              onChangeRadius={handleChangeRadius}
              onChangeSidetrack={handleChangeSidetrack}
              onChangeNonEngineeredWells={handleChangeNonEngineeredWells}
              onChangeFilters={handleChangeFilters}
              onClearFilters={handleClearFilters}
              onToggleMap={handleToggleMap}
            />
            <WellsMap
              subjectWell={subjectWell}
              wells={filteredWells}
              offsetWells={offsetWells}
              radius={radius}
              mapHidden={mapHidden}
              onSetSubjectWell={handleSetSubjectWell}
              onRemoveSubjectWell={handleRemoveSubjectWell}
              onAddOffsetWell={handleAddOffsetWell}
              onDeleteOffsetWell={handleDeleteOffsetWell}
            />

            <WellsTable
              subjectWell={subjectWell}
              wells={sortedFilteredWells}
              offsetWells={offsetWells}
              metricsKeys={metricsKeys}
              sortInfo={sortInfo}
              isMetricsLoading={isMetricsLoading}
              unusableWellAlarm={unusableWellAlarm}
              onChangeMetricsKeys={handleChangeMetricsKeys}
              onSorting={handleSorting}
              onAddOffsetWell={handleAddOffsetWell}
              onDeleteOffsetWell={handleDeleteOffsetWell}
              onAddAllOffsetWells={handleAddAllOffsetWells}
              onDeleteAllOffsetWells={handleDeleteAllOffsetWells}
            />
          </>
        ) : (
          <LoadingIndicator fullscreen={false} />
        )}
      </DialogContent>
      <div className={classes.bottomShadow} />
      <DialogActions
        className={classnames(classes.dialogActions, {
          [classes.dialogActionsSmallScreen]: isFullScreen,
        })}
      >
        {isAdvancedSearch ? (
          <div className={classes.selectedWells}>
            <Typography className={classes.selected}>Selected:</Typography>
            <Typography className={classes.selectedLabel}>Best:</Typography>
            <Typography className={classes.selectedNumber}>{bestCount}</Typography>
            <Typography className={classes.selectedLabel}>Advanced Search:</Typography>
            <Typography className={classes.selectedNumber}>{offsetWells?.length || 0}</Typography>
          </div>
        ) : (
          <div />
        )}
        <div>
          <Button
            data-testid={`${PAGE_NAME}_cancel`}
            onClick={handleClose}
            color="primary"
            style={{ marginRight: 16 }}
          >
            CANCEL
          </Button>
          <Button
            data-testid={`${PAGE_NAME}_add`}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            ADD ({offsetWells?.length || 0})
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

OffsetsPickerDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  defaultSubjectWellId: PropTypes.number,
  companyId: PropTypes.number,
  offsetSetting: PropTypes.shape({}).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  addWellsUsabilityInfo: PropTypes.func, // update offset wells usability info in specific apps ("is_usable" field)
  unusableWellAlarm: PropTypes.string,
  isAdvancedSearch: PropTypes.bool,
  bestCount: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

OffsetsPickerDialog.defaultProps = {
  defaultSubjectWellId: null,
  companyId: null,
  addWellsUsabilityInfo: null,
  unusableWellAlarm: 'Unable to add',
  isAdvancedSearch: false,
  bestCount: 0,
};

export default memo(OffsetsPickerDialog);
