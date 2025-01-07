import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty, uniqBy, sortBy as sortArray } from 'lodash';
import { InfoOutlined, Replay as ReplayIcon } from '@material-ui/icons';
import { Button, Modal, LoadingIndicator, Tooltip } from '~/components';
import { showInfoNotification } from '~/utils';
import { Regular12, Regular14 } from '~/components/Typography';
import { typography } from '~/styles';
import { isMobileDetected, isNativeDetected } from '~/utils/mobileDetect';

import {
  useFetchWells,
  useAdvancedWells,
  useBicWells,
  useFilterOptions,
  useCompanyMetricKey,
  useFilteredWells,
  useSortedWells,
  useTableColumns,
} from './effects';
import { AppHeader } from './components/AppHeader';
import { Toolbar } from './components/Toolbar';
import { Filter } from './components/Filter';
import { WellsMap } from './components/Map';
import { OffsetWellsTable } from './components/OffsetWellsTable';
import styles from './OffsetWellPickerV4.module.css';
import {
  ALL_SECTION_KEY,
  ColumnType,
  DEFAULT_BIC_OFFSET_SIZE,
  DEFAULT_LOCAL_OFFSET_SIZE,
  FilterType,
  IOS_DEVICE,
  LEAVE_TOUCH_DELAY,
  MAX_OFFSET_SIZE,
  ROWS_PER_PAGE,
  SMALL_SCREEN_HEIGHT,
  SMALL_SCREEN_WIDTH,
  TOP_GRADIENT_MAP,
  ViewType,
} from './constants';
import { SEARCH_CATEGORIES } from './components/OffsetWellsTable/AdvancedSearch/constants';
import { getCoordinatedWells, getMobileOperatingSystem } from './utils';

const PAGE_NAME = 'OffsetWellPickerV4';

const OffsetWellPickerV4 = ({
  open,
  isWDUser,
  defaultSubjectWell,
  currentUser,
  offsetSettings,
  addWellsUsabilityInfo,
  isViewOnly,
  onClose,
  onSave,
  maxOffsetSize: offsetSize,
  localMaxOffsetSize,
  syncAutoEnabled,
}) => {
  const [activeWellId, setActiveWellId] = useState(null);
  const maxOffsetSize = Math.min(offsetSize + 1, localMaxOffsetSize + 1, MAX_OFFSET_SIZE + 1);
  const maxOffsetwellNumber = Math.min(
    Math.max(maxOffsetSize, localMaxOffsetSize + 1),
    MAX_OFFSET_SIZE + 1
  );

  const [isFilterExpanded, setIsFilterExpanded] = useState(offsetSettings?.filterExpanded);
  const [isMapHidden, setIsMapHidden] = useState(offsetSettings?.mapHidden);
  const assetCompanyId = +defaultSubjectWell?.companyId || +currentUser?.company_id;
  const subjectWellId = defaultSubjectWell?.asset_id;
  const [filters, setFilters] = useState(offsetSettings?.filters || {});
  const [selectedWellSection, setSelectedWellSection] = useState(
    offsetSettings?.wellSection || ALL_SECTION_KEY
  );
  const initLoading = useRef(true);
  const [selectedWells, setSelectedWells] = useState([]);
  const [subjectWell, setSubjectWell] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isWellNameExpand, setIsWellNameExpand] = useState(false);
  const [isAdvancedSearchHidden, setIsAdvancedSearchHidden] = useState(false);
  const contentRef = useRef();
  const [viewType, setViewType] = useState(ViewType.none);
  const prevViewType = useRef();
  const [isTopGradientShow, setIsTopGradientShow] = useState(false);
  const isLimitedOffsetwells = maxOffsetwellNumber <= selectedWells?.length;
  const topGradientTop = TOP_GRADIENT_MAP[viewType];

  const prevSelectedWellIds = useRef();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (open && isLimitedOffsetwells) {
      showInfoNotification(
        `App can’t process more than (${maxOffsetwellNumber - 1}) Offset Wells.`
      );
    }
    // NOTE: Refresh when the offset well changes externally
    if (!open) {
      const isNotChanged =
        offsetSettings?.selectedWellIds?.length === prevSelectedWellIds.current?.length &&
        offsetSettings?.selectedWellIds?.every(id => prevSelectedWellIds.current?.includes(id));
      if (!isNotChanged) {
        initLoading.current = true;
      }
      prevSelectedWellIds.current = offsetSettings?.selectedWellIds;
    }
  }, [isLimitedOffsetwells, open, offsetSettings]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= SMALL_SCREEN_WIDTH || isMobileDetected || isNativeDetected) {
        setViewType(ViewType.mobile);
      } else if (window.innerHeight <= SMALL_SCREEN_HEIGHT) {
        setViewType(ViewType.small);
      } else {
        setViewType(ViewType.normal);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  useEffect(() => {
    if (prevViewType.current && viewType === prevViewType.current) return;
    prevViewType.current = viewType;
    if (viewType === ViewType.small || viewType === ViewType.mobile) {
      setIsMapHidden(true);
      setIsFilterExpanded(false);
    } else {
      setIsFilterExpanded(!isViewOnly && offsetSettings?.filterExpanded);
      setIsMapHidden(!isViewOnly && offsetSettings?.mapHidden);
    }
    setFilters(offsetSettings?.filters || {});
    setSelectedWellSection(offsetSettings?.wellSection || ALL_SECTION_KEY);
  }, [offsetSettings, isViewOnly, viewType]);

  // NOTE: Fetch all wells
  const rawWells = useFetchWells(assetCompanyId, addWellsUsabilityInfo);

  const [wellSections, setWellSections, bicWells, setBicWells] = useBicWells(
    isWDUser,
    subjectWellId,
    rawWells
  );

  // NOTE: Sync with Wellhub & Offset Selection App

  useEffect(() => {
    setAppLoading(true);
    setWellSections(null);
    setBicWells(null);
  }, [subjectWellId]);

  useEffect(() => {
    const syncOffsetWells = async () => {
      const isSynced = typeof offsetSettings.isSynced === 'undefined' || offsetSettings.isSynced;
      let offsetWellsChanged = true;
      if (isSynced) {
        const bicWellIds = bicWells[ALL_SECTION_KEY];
        const isMatched = (offsetSettings?.selectedWellIds || []).every(wellId =>
          bicWellIds.includes(wellId)
        );
        // if wellhub or offset selection app be changed
        if (bicWellIds.length !== offsetSettings.selectedWellIds?.length || !isMatched) {
          const wellsByDistance = await getCoordinatedWells(bicWellIds, subjectWellId);
          let selectedWellIds = wellsByDistance.slice(0, maxOffsetSize + 1).map(well => well.id);
          selectedWellIds = wellsByDistance.slice(0, localMaxOffsetSize + 1).map(well => well.id);
          const newOffsetSetting = {
            ...offsetSettings,
            subjectWellId,
            selectedWellIds,
            offsetWellsLimited: maxOffsetwellNumber <= selectedWellIds.length,
          };
          const offsetWells = wellsByDistance.filter(well => selectedWellIds.includes(well.id));
          onSave(newOffsetSetting, offsetWells);
        } else {
          offsetWellsChanged = false;
        }
      } else {
        offsetWellsChanged = false;
      }

      if (!offsetWellsChanged) {
        const offsetWells = await getCoordinatedWells(
          offsetSettings?.selectedWellIds || [],
          subjectWellId
        );
        onSave(offsetSettings, offsetWells);
      }
    };

    if (syncAutoEnabled && appLoading && offsetSettings && bicWells) {
      syncOffsetWells();
      setAppLoading(false);
    }
  }, [offsetSettings, bicWells, subjectWellId, maxOffsetwellNumber, syncAutoEnabled]);

  const [metricsKeys, setMetricsKeys] = useCompanyMetricKey(
    assetCompanyId,
    offsetSettings?.metricsKeys
  );

  // NOTE: Calculate wells with coordinates, metrics and well section name
  const wells = useAdvancedWells(
    assetCompanyId,
    rawWells,
    wellSections,
    bicWells,
    subjectWellId,
    metricsKeys
  );

  const filterOptions = useFilterOptions(wells);

  // NOTE: Subject well
  useEffect(() => {
    if (wells && wellSections) {
      const defaultSubjectWell = wells.find(well => well.id === subjectWellId);
      if (defaultSubjectWell) {
        const allSectionNames = wellSections
          .filter(item => item.value !== ALL_SECTION_KEY)
          .map(({ label }) => label);
        const subjectWellWithSection = {
          ...defaultSubjectWell,
          ...(allSectionNames.length > 0 && { [ColumnType.wellSection]: allSectionNames }),
        };
        setSubjectWell(subjectWellWithSection);
      } else {
        setSubjectWell(null);
      }
    }
  }, [wellSections, wells]);

  // NOTE: Table columns with metrics
  const columnsWithDict = useTableColumns(metricsKeys);

  // NOTE: Filter wells
  const filteredWells = useFilteredWells(wells, filters);

  // Update selected wells after filter changes
  useEffect(() => {
    if (!filteredWells) return;

    if (initLoading.current) {
      let data = wells.filter(well => (offsetSettings?.selectedWellIds || []).includes(well.id));
      if (subjectWell) data = data.concat(subjectWell);
      setSelectedWells(uniqBy(data, 'id'));
      initLoading.current = false;
    } else {
      setSelectedWells(prev => {
        let newSelectedWells = (filteredWells || []).filter(
          well => !!prev.find(({ id }) => well.id === id)
        );
        if (subjectWell) newSelectedWells = newSelectedWells.concat(subjectWell);
        return uniqBy(newSelectedWells, 'id');
      });
    }
  }, [wells, filteredWells, offsetSettings?.selectedWellIds]);

  // NOTE: Sort wells
  const [sortBy, setSortBy, sortDirection, setSortDirection, sortedWells] = useSortedWells(
    subjectWell,
    filteredWells,
    selectedWells,
    setIsTableLoading,
    initLoading.current
  );

  // NOTE: Add advanced wells
  const handleAddRemoveAssets = useCallback(
    (isAdding, newAssets, assetType) => {
      let addingWellIds;
      if (assetType === SEARCH_CATEGORIES.well.name) {
        addingWellIds = newAssets;
      } else {
        addingWellIds = newAssets.reduce((acc, assetId) => {
          const rigName = wells.find(well => well.id === assetId)?.rigName;
          const rigWellIds = wells.filter(well => well.rigName === rigName).map(well => well.id);
          return acc.concat(rigWellIds);
        }, []);
      }
      let addingWells = wells.filter(({ id }) => addingWellIds.includes(id));
      if (isAdding) {
        addingWells = addingWells.slice(
          0,
          Math.min(addingWells.length, maxOffsetwellNumber - selectedWells.length)
        );
        setSelectedWells(selectedWells => uniqBy(selectedWells.concat(addingWells), 'id'));
      } else {
        setSelectedWells(selectedWells =>
          uniqBy(selectedWells.filter(({ id }) => !addingWells.find(well => well.id === id)))
        );
      }
    },
    [wells, selectedWells]
  );

  const handleHideAdvancedSearch = useCallback(() => {
    setIsAdvancedSearchHidden(true);
  }, []);

  // NOTE: Change metrics keys
  const handleChangeMetricsKeys = useCallback(newMetricsKeys => {
    setMetricsKeys(newMetricsKeys);
  }, []);

  // NOTE: Check and Uncheck one offset well
  const handleChanageOffsetWell = useCallback((well, checked) => {
    if (checked) {
      setSelectedWells(prevWells => [...prevWells, well]);
    } else {
      setSelectedWells(prevWells => prevWells.filter(item => item.id !== well.id));
    }
  }, []);

  // NOTE: Select and Unselect All wells
  const handleChangeAllOffsetWells = useCallback(
    checked => {
      if (checked) {
        const data = subjectWell ? filteredWells.concat(subjectWell) : filteredWells;
        const sortedData = sortArray(uniqBy(data, 'id'), 'distance');
        setSelectedWells(sortedData.slice(0, maxOffsetwellNumber));
      } else {
        setSelectedWells(subjectWell ? [subjectWell] : []);
      }
    },
    [filteredWells, subjectWell, maxOffsetwellNumber]
  );

  // NOTE: Well Section change filter
  const updateSelectedWellsBySection = section => {
    if (bicWells) {
      const sectionWells = wells.filter(well => bicWells[section].includes(well.id));
      const limitedWells = sortArray(sectionWells, 'distance');
      setSelectedWells(limitedWells.slice(0, maxOffsetSize));
    } else {
      setSelectedWells(subjectWell ? [subjectWell] : []);
    }
  };

  const handleChangeWellSection = useCallback(
    section => {
      setSelectedWellSection(section);
      updateSelectedWellsBySection(section);
    },
    [updateSelectedWellsBySection]
  );

  // NOTE: Get Selected wells count
  const selectedWellsCount = useMemo(() => {
    if (selectedWells.find(well => well.id === subjectWellId)) {
      return selectedWells.length - 1;
    }
    return selectedWells.length;
  }, [selectedWells, subjectWellId]);

  // NOTE: Save offset setting
  const isSynced = useMemo(() => {
    if (!bicWells) return false;
    const selectedWellIds = selectedWells.map(({ id }) => id);
    let synced;
    const owsWellIds = bicWells[selectedWellSection] || []; // hodan 222
    const owsWellIdsLength = Math.min(owsWellIds.length, maxOffsetSize);

    if (owsWellIdsLength !== selectedWellIds.length) {
      synced = false;
    } else {
      synced = selectedWellIds.every(id => owsWellIds.includes(id));
    }
    return synced;
  }, [bicWells, selectedWells, selectedWellSection, maxOffsetSize]);

  const handleSave = () => {
    onClose();

    const newOffsetSetting = {
      ...offsetSettings,
      companyId: assetCompanyId,
      subjectWellId,
      selectedWellIds: selectedWells.map(({ id }) => id),
      filters,
      metricsKeys,
      wellSection: selectedWellSection,
      isSynced,
      mapHidden: isMapHidden,
      filterExpanded: isFilterExpanded,
      offsetWellsLimited: isLimitedOffsetwells,
    };
    onSave(newOffsetSetting, selectedWells);
  };

  const handleCancel = () => {
    let data = (wells || []).filter(well =>
      (offsetSettings?.selectedWellIds || []).includes(well.id)
    );
    if (subjectWell) data = data.concat(subjectWell);
    setSelectedWells(uniqBy(data, 'id'));

    const newOffsetSetting = {
      ...offsetSettings,
      mapHidden: isMapHidden,
      filterExpanded: isFilterExpanded,
    };
    onSave(newOffsetSetting);
    setFilters(offsetSettings?.filters || {});
    setSelectedWellSection(offsetSettings?.wellSection || ALL_SECTION_KEY);
    onClose();
  };

  // NOTE: Reset processing
  const isResetVisible = useMemo(() => {
    if (!isSynced) return true;
    if (!isEmpty(filters) && filters[FilterType.sideTracks]) return true;
    if (selectedWellSection !== ALL_SECTION_KEY) return true;
    return false;
  }, [isSynced, filters, selectedWellSection]);

  const handleReset = () => {
    setFilters({});
    setSelectedWellSection(ALL_SECTION_KEY);
    updateSelectedWellsBySection(ALL_SECTION_KEY);
  };

  const isLoading = !wells || !wellSections || !sortedWells || viewType === ViewType.none;

  // NOTE: Well Name shadow
  const [isHscrollMoved, setIsHscrollMoved] = useState(false);
  const [tableRowsCount, setTableRowsCount] = useState(ROWS_PER_PAGE);
  const [tableWells, setTableWells] = useState([]);

  useEffect(() => {
    if (!sortedWells) return;

    const wells = sortedWells.slice(0, tableRowsCount);
    setTableWells(wells);
  }, [sortedWells, tableRowsCount, subjectWell]);

  const handleScroll = e => {
    if (!e.target) return;

    if (isAdvancedSearchHidden) {
      e.target.scrollLeft = 0;
      setIsAdvancedSearchHidden(false);
    }

    // Check if H-Scroll is visible
    if (e.target.scrollLeft <= 5 && isHscrollMoved) {
      setIsHscrollMoved(false);
    }
    if (e.target.scrollLeft > 5 && !isHscrollMoved) {
      setIsHscrollMoved(true);
    }

    if (e.target.scrollTop <= 5 && isTopGradientShow) {
      setIsTopGradientShow(false);
    }
    if (e.target.scrollTop > 5 && !isTopGradientShow) {
      setIsTopGradientShow(true);
    }

    // Check if scroll has reached top or bottom
    if (e.target.scrollHeight === e.target.offsetHeight) return;

    const currentScrollBottom = Math.round(e.target.scrollTop + e.target.offsetHeight + 2);

    if (currentScrollBottom >= e.target.scrollHeight && tableRowsCount < sortedWells.length) {
      setTableRowsCount(count => count + ROWS_PER_PAGE);
    }
  };

  const tooltipContainer = () => {
    return (
      <div>
        <span className={classNames(typography.regular12, typography.colors.t1)}>
          The offset list is being automatically populated by&nbsp;
        </span>
        <span className={classNames(typography.medium12, typography.colors.t1)}>
          {isWDUser ? 'Offset Selection App.' : 'WellHub.'}
        </span>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={
        <AppHeader
          isWDUser={isWDUser}
          viewType={viewType}
          totalCount={wells?.length ?? 0}
          selectedCount={selectedWellsCount}
          isViewOnly={isViewOnly}
          maxOffsetwellNumber={maxOffsetwellNumber}
        />
      }
      isMobile={viewType === ViewType.mobile}
      contentContainerClassName={classNames(styles.offsetWellDialog)}
      contentClassName={classNames(styles.contentContainer, {
        [styles.smallContainer]: viewType === ViewType.small,
        [styles.contentContainerMobile]: viewType === ViewType.mobile,
      })}
      actionsClassName={styles.modalActions}
      actions={
        !isViewOnly && (
          <div className={styles.actionsWrapper}>
            {!isLoading && isResetVisible ? (
              <Tooltip
                placement="bottom-start"
                title={`Reset to Synced Offsets in ${isWDUser ? 'Offset App' : 'Wellhub'}`}
              >
                <div>
                  <Button
                    data-testid={`${PAGE_NAME}_reset`}
                    onClick={handleReset}
                    color="primary"
                    startIcon={viewType !== ViewType.mobile && <ReplayIcon />}
                    classes={viewType === ViewType.mobile && { root: styles.resetButtonMobile }}
                  >
                    {viewType !== ViewType.mobile ? 'Reset' : <ReplayIcon />}
                  </Button>
                </div>
              </Tooltip>
            ) : (
              <div className={viewType === ViewType.mobile && styles.infoIconContainer}>
                {viewType !== ViewType.mobile ? (
                  <>
                    <span className={classNames(typography.regular12, typography.colors.t6)}>
                      The offset list is being automatically populated by&nbsp;
                    </span>
                    <span className={classNames(typography.medium12, typography.colors.t6)}>
                      {isWDUser ? 'Offset Selection App.' : 'WellHub.'}
                    </span>
                  </>
                ) : (
                  <Tooltip
                    title={tooltipContainer()}
                    enterTouchDelay={0}
                    leaveTouchDelay={LEAVE_TOUCH_DELAY}
                  >
                    <InfoOutlined className={styles.infoIcon} />
                  </Tooltip>
                )}
              </div>
            )}
            <div className={styles.buttonGap}>
              <Button data-testid={`${PAGE_NAME}_cancel`} onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button
                data-testid={`${PAGE_NAME}_selectedWells`}
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Select ({selectedWellsCount})
              </Button>
            </div>
          </div>
        )
      }
    >
      {!isLoading ? (
        <div className={classNames(styles.contentWrapper)} ref={contentRef}>
          {viewType === ViewType.mobile && (
            <div
              className={classNames(styles.countContainer, {
                [styles.countContainerMobile]: viewType === ViewType.mobile,
              })}
            >
              <Regular14 className={styles.totalLabel}>Total:</Regular14>
              <Regular14 data-testid={`${PAGE_NAME}_totalWells`} className={styles.countValue}>
                {wells.length}
              </Regular14>
              <Regular14 className={styles.selectedLabel}>Selected:</Regular14>
              <Regular14 data-testid={`${PAGE_NAME}_selected`} className={styles.countValue}>
                {selectedWellsCount}
              </Regular14>
              <Tooltip
                title={`App can’t process more than (${maxOffsetwellNumber - 1}) Offset Wells.`}
                placement="right"
              >
                <Regular12
                  data-testid={`${PAGE_NAME}_maxOffsetSize`}
                  className={styles.maxOffsetSize}
                >
                  /{maxOffsetwellNumber - 1}
                </Regular12>
              </Tooltip>
            </div>
          )}

          {viewType === ViewType.normal && (
            <Toolbar
              isViewOnly={isViewOnly}
              viewType={viewType}
              filters={filters}
              setFilters={setFilters}
              isFilterExpanded={isFilterExpanded}
              setIsFilterExpanded={setIsFilterExpanded}
              isMapHidden={isMapHidden}
              setIsMapHidden={setIsMapHidden}
            />
          )}

          {isTopGradientShow && (
            <div className={styles.topGradient} style={{ top: topGradientTop }} />
          )}
          <div
            className={classNames(styles.content, {
              [styles.contentMobile]: viewType === ViewType.mobile,
              [styles.contentiOSMobile]: getMobileOperatingSystem() === IOS_DEVICE,
            })}
            onScroll={e => handleScroll(e)}
          >
            {viewType !== ViewType.normal && (
              <Toolbar
                isViewOnly={isViewOnly}
                viewType={viewType}
                filters={filters}
                setFilters={setFilters}
                isFilterExpanded={isFilterExpanded}
                setIsFilterExpanded={setIsFilterExpanded}
                isMapHidden={isMapHidden}
                setIsMapHidden={setIsMapHidden}
              />
            )}
            {!isMapHidden && open && (
              <WellsMap
                isViewOnly={isViewOnly}
                mapHidden={isMapHidden}
                companyId={assetCompanyId}
                subjectWell={subjectWell}
                offsetWellIds={selectedWells.map(({ id }) => id)}
                wells={filteredWells}
                radius={filters[FilterType.radius]}
                handleChanageOffsetWell={handleChanageOffsetWell}
                activeWellId={activeWellId}
                viewType={viewType}
              />
            )}
            <Filter
              isHidden={!isFilterExpanded}
              isWDUser={isWDUser}
              filterOptions={filterOptions}
              filters={filters}
              wellSections={wellSections}
              selectedWellSection={selectedWellSection}
              subjectWell={subjectWell}
              onChangeFilters={value => {
                setIsTableLoading(true);
                setTimeout(() => setFilters(value), 0);
              }}
              onChangeBicWells={handleChangeWellSection}
            />
            <OffsetWellsTable
              open={open}
              isTableLoading={isTableLoading}
              companyId={assetCompanyId}
              subjectWellId={subjectWellId}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              columnsWithDict={columnsWithDict}
              wells={tableWells}
              metricsKeys={metricsKeys}
              setMetricsKeys={handleChangeMetricsKeys}
              handleChanageOffsetWell={handleChanageOffsetWell}
              handleChangeAllOffsetWells={handleChangeAllOffsetWells}
              handleAddRemoveAssets={handleAddRemoveAssets}
              isWellNameExpand={isWellNameExpand}
              setIsWellNameExpand={setIsWellNameExpand}
              isHscrollMoved={isHscrollMoved}
              onHideAdvancedSearch={handleHideAdvancedSearch}
              isViewOnly={isViewOnly}
              isLastWell={sortedWells.length <= tableRowsCount}
              contentRef={contentRef}
              isLimitedOffsetwells={isLimitedOffsetwells}
              maxOffsetwellNumber={maxOffsetwellNumber}
              wellSections={wellSections}
              setActiveWellId={setActiveWellId}
              viewType={viewType}
              isWDUser={isWDUser}
            />
          </div>
          {isViewOnly && (
            <div className={styles.viewOnlyInfoContainer}>
              <span className={classNames(typography.regular12, typography.colors.t6)}>
                The offset list is being automatically populated by&nbsp;
              </span>
              <span className={classNames(typography.medium12, typography.colors.t6)}>
                {isWDUser ? 'Offset Selection App.' : 'WellHub.'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <LoadingIndicator fullscreen={false} />
      )}
    </Modal>
  );
};

OffsetWellPickerV4.propTypes = {
  isWDUser: PropTypes.bool,
  defaultSubjectWell: PropTypes.shape({
    asset_id: PropTypes.number,
    companyId: PropTypes.number,
  }),
  offsetSettings: PropTypes.shape({
    isSynced: PropTypes.bool,
    selectedWellIds: PropTypes.arrayOf(PropTypes.number),
    manualWellIds: PropTypes.arrayOf(PropTypes.number),
    filters: PropTypes.shape({}),
    metricsKeys: PropTypes.arrayOf(PropTypes.string),
    wellSection: PropTypes.string,
    companyId: PropTypes.number,
    subjectWellId: PropTypes.number,
    mapHidden: PropTypes.bool,
    filterExpanded: PropTypes.bool,
    hintPopupClosed: PropTypes.bool,
  }),
  currentUser: PropTypes.shape({
    company_id: PropTypes.number,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  addWellsUsabilityInfo: PropTypes.func,
  isViewOnly: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  maxOffsetSize: PropTypes.number,
  localMaxOffsetSize: PropTypes.number,
  syncAutoEnabled: PropTypes.bool,
};

OffsetWellPickerV4.defaultProps = {
  isWDUser: false,
  defaultSubjectWell: null,
  offsetSettings: {},
  addWellsUsabilityInfo: undefined,
  isViewOnly: false,
  maxOffsetSize: DEFAULT_BIC_OFFSET_SIZE,
  localMaxOffsetSize: DEFAULT_LOCAL_OFFSET_SIZE,
  syncAutoEnabled: false,
};

export default OffsetWellPickerV4;
