import { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { string, number, shape, func, bool } from 'prop-types';
import classNames from 'classnames';
import { uniq, orderBy, get } from 'lodash';
import { makeStyles } from '@material-ui/core';
import { LoadingIndicator } from '~/components';

import Filter from './components/Filter';
import WellsMap from './components/Map';
import WellsTable from './components/Table';
import {
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

const useStyles = makeStyles({
  customSelectionContainer: {
    overflow: 'auto',
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
  },
  containerHidden: {
    display: 'none',
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '550px',
  },
});

function CustomSelectionView({
  open,
  defaultSubjectWellId,
  companyId,
  userSettings,
  currentUser,
  addWellsUsabilityInfo,
  unusableWellAlarm,
  mapHidden,
  filtersHidden,
  setSelectedOffsetWells,
  setFilterChanged,
  onSave,
  isMobile,
  isTablet,
  onToggleFilters,
  isClearFilters,
  setIsClearFilters,
}) {
  const classes = useStyles();

  const assetCompanyId = useMemo(() => {
    return companyId || get(userSettings, 'companyId') || +get(currentUser, 'company_id');
  }, [userSettings]);
  const subjectWellId = useMemo(() => {
    return get(userSettings, 'subjectWellId') || defaultSubjectWellId;
  }, [userSettings]);
  const [filters, setFilters] = useState(get(userSettings, 'filters') || DEFAULT_SETTINGS.filters);
  const [radius, setRadius] = useState(get(userSettings, 'radius') || DEFAULT_SETTINGS.radius);
  const [excludeSideTrack, setExcludeSideTrack] = useState(get(userSettings, 'excludeSideTrack'));
  const [metricsKeys, setMetricsKeys] = useState([]);
  const [sortInfo, setSortInfo] = useState(DEFAULT_SETTINGS.sortInfo);
  const [selectedWellIds, setSelectedWellIds] = useState([]);

  const customRef = useRef();

  useEffect(() => {
    if (open && customRef.current) customRef.current.scrollTo({ top: 0 });
  }, [open]);

  useEffect(() => {
    setSelectedWellIds(get(userSettings, 'customWellIds') || []);
  }, [userSettings]);

  const isRadiusEditable = useMemo(() => {
    return !!subjectWellId;
  }, [subjectWellId]);

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
  const filteredWells = useFilteredWells(filters, excludeSideTrack, wells);

  // NOTE: get subject well from id
  const subjectWell = useMemo(() => {
    return wells && subjectWellId ? wells.find(well => well.id === subjectWellId) : null;
  }, [wells, subjectWellId]);

  // NOTE: All matched wells regardless of is_usable field
  const filteredWellsWithCoords = useWellsWithCoords(filteredWells, subjectWell);

  // NOTE: Update selectedWellIds by radius
  useRadiusWells(radius, filteredWellsWithCoords, setSelectedWellIds);

  // NOTE: Get offset wells (only usable wells)
  const offsetWells = useOffsetWells(radius, wells, selectedWellIds);

  // NOTE: Update offset wells
  useEffect(() => {
    if (offsetWells && open) {
      setSelectedOffsetWells(offsetWells);
    }
  }, [offsetWells, open]);

  // NOTE: Fetch metrics for all filtered wells
  const [isMetricsLoading, filteredWellsWithMetric] = useMetricsData(
    assetCompanyId,
    filteredWellsWithCoords
  );

  // NOTE: Restore the previous result for Cancel operation
  useEffect(() => {
    setFilterChanged(true);
  }, [filters, radius, excludeSideTrack, selectedWellIds, subjectWellId, sortInfo]);

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

  const handleChangeRadius = useCallback(newRadius => {
    setRadius(newRadius);
  }, []);

  const handleChangeSidetrack = useCallback(checked => {
    setExcludeSideTrack(checked);
  }, []);

  const handleChangeFilters = useCallback((key, newValues) => {
    setFilters(prev => ({ ...prev, [key]: newValues }));
    setSelectedWellIds([]);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_SETTINGS.filters });
    setRadius(DEFAULT_SETTINGS.radius);
    setExcludeSideTrack(false);
    setSelectedWellIds([]);
  }, []);
  useEffect(() => {
    if (isClearFilters) {
      handleClearFilters();
      setIsClearFilters(false);
    }
  }, [isClearFilters]);
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

  useEffect(() => {
    const newFilters = {
      subjectWellId,
      radius,
      excludeSideTrack,
      filters,
    };

    onSave(newFilters);
  }, [subjectWellId, radius, excludeSideTrack, filters]);

  const isLoading =
    !wells ||
    !filteredWells ||
    !filteredWellsWithCoords ||
    !filteredWellsWithMetric ||
    !offsetWells ||
    !sortedFilteredWells;

  return (
    <div
      className={classNames(classes.customSelectionContainer, { [classes.containerHidden]: !open })}
      ref={customRef}
    >
      {!isLoading ? (
        <>
          <Filter
            radius={radius}
            excludeSideTrack={excludeSideTrack || false}
            filters={filters}
            filtersOptions={filtersOptions}
            isRadiusEditable={isRadiusEditable}
            filtersHidden={filtersHidden}
            onChangeRadius={handleChangeRadius}
            onChangeSidetrack={handleChangeSidetrack}
            onChangeFilters={handleChangeFilters}
            onClearFilters={handleClearFilters}
            isTablet={isTablet}
            isMobile={isMobile}
            onToggleFilters={onToggleFilters}
          />

          <WellsMap
            open={open}
            subjectWell={subjectWell}
            wells={filteredWells}
            offsetWells={offsetWells}
            radius={radius}
            mapHidden={mapHidden}
            isMobile={isMobile}
            onAddOffsetWell={handleAddOffsetWell}
            onDeleteOffsetWell={handleDeleteOffsetWell}
          />

          <WellsTable
            open={open}
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
            isMobile={isMobile}
            isTablet={isTablet}
            companyId={companyId}
          />
        </>
      ) : (
        <div className={classes.loadingWrapper}>
          <LoadingIndicator fullscreen={false} />
        </div>
      )}
    </div>
  );
}

CustomSelectionView.propTypes = {
  open: bool.isRequired,
  defaultSubjectWellId: number,
  companyId: number,
  userSettings: shape({}).isRequired,
  currentUser: shape({}).isRequired,
  addWellsUsabilityInfo: func, // update offset wells usability info in specific apps ("is_usable" field)
  unusableWellAlarm: string,
  mapHidden: bool.isRequired,
  filtersHidden: bool.isRequired,
  setSelectedOffsetWells: func.isRequired,
  setFilterChanged: func.isRequired,
  onSave: func.isRequired,
  isMobile: bool.isRequired,
  isTablet: bool.isRequired,
  onToggleFilters: func.isRequired,
  isClearFilters: bool.isRequired,
  setIsClearFilters: func.isRequired,
};

CustomSelectionView.defaultProps = {
  defaultSubjectWellId: null,
  companyId: null,
  addWellsUsabilityInfo: null,
  unusableWellAlarm: 'Unable to add',
};

// Important: Do not change root component default export (CustomSelectionView.js). Use it as container
//  for your CustomSelectionView. It's required to make build and zip scripts work as expected;
export default memo(CustomSelectionView);
