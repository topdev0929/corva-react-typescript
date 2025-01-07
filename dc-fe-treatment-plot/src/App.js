import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { concat, debounce } from 'lodash';

import { makeStyles } from '@material-ui/core';
import { EmptyState, LoadingIndicator } from '@corva/ui/components';
import { setAppViewStorageSettings } from '@corva/ui/clients/clientStorage';
import { getAssetKey } from '@corva/ui/utils/completion';

import { useAppWells } from './effects/useAppWells';
import { useFetchedAllData } from './effects/useFetchedAllData';
import { useAppSettings } from './effects/useAppSettings';
import { useChartOptions } from './effects/useChartOptions';
import { useAppSubscriptions } from './effects/useSubscriptionData';
import { useActivitySubscriptions } from './effects/useActivitySubscriptionData';
import { useLiveTimer } from './effects/useLiveTimer';
import useIsAssetViewer from './effects/useIsAssetViewer';

import { useCsvExportMenuItems } from './effects/csvExport';
import { useWellsStreamSubscription } from './effects/useWellsStreamSubscription';

import { isMultipleStages } from './utils/dataUtils';
import { resolveCurrentAssetByPadMode } from './utils/completionUtils';
import { chartTimeRange } from './utils/eChartUtils';
import { resolveZoomCollection } from './utils/zoomDataLoad';
import { isAppDataEmpty } from './utils/isDataEmpty';

import { LayoutContextProvider } from './context/layoutContext';
import { FilterBoxContextProvider } from './context/filterBoxContext';
import { AppContext } from './context/AppContext';
import FeedBarContext from './context/FeedContext';

import AppHeader from './components/AppHeader';
import Content from './components/Content';
import StreamboxStatus from './components/StreamboxStatus';
import Chart from './components/Chart';
import Legends from './components/Legends';
import FilterSidebar from './components/FilterSidebar';
import ChartSlider from './components/ChartSlider';
import ChartStageNames from './components/ChartStageNames';

import LiveBadge from './components/LiveBadge';
import DetailDataLoader from './components/DetailDataLoader';

import FeedBar from './components/FeedBar';
import FeedCreationProvider from './components/FeedBar/components/FeedCreationProvider/FeedCreationProvider';
import FeedsCreationHoverLine from './components/FeedBar/components/FeedsCreationHoverLine';
import { CursorPositionProvider } from './components/CursorPosition';

import Settings from './components/Settings';
import LastDataUpdate from './components/LastDataUpdate';
import CSVExportDialog from './components/CSVExportDialog';

import {
  DEFAULT_SETTINGS,
  RT_SIDEBAR_HORIZONTAL_HEIGH,
  MOBILE_SIZE_BREAKPOINT,
  TABLET_SIZE_BREAKPOINT,
  VIEW_MODE_KEYS,
  STAGE_MODE_KEYS,
  RT_TYPES,
  PERCENT_PROPPANT,
} from './constants';
import RealTimeSidebarContainer from './components/RealTimeSidebarContainer';
import useAbraData from './effects/useAbraData';
import StatusBadge from './components/StatusBadge';
import useLazyAbra from './effects/useLazyAbra';
import { useWitsFilter } from './effects/useWitsFilter';
import useGoals from './effects/useGoals';
import withWrappers from './utils/witsWrappers';

const useStyles = makeStyles({
  '@global .tpResponsive .contentSettings': {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    position: 'relative',
    padding: '12px 12px 8px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '12px 0 0 0',
  },
  streamboxStatusDesktop: {
    position: 'absolute',
    top: 8,
  },

  cTpTooltipLineContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    minHeight: 0,
  },

  cTpChartContainer: {
    flex: 1,
    minHeight: 0,
    marginBottom: 16,
    position: 'relative',
  },

  cTpFeedContainer: {
    width: '100%',
    height: '40px',
    marginTop: 16,
    position: 'relative',
  },

  appFooter: {
    display: 'flex',
    gap: 8,
    padding: '0 0 8px 4px',

    '& > div': {
      backgroundColor: 'transparent',
    },
  },
  emptyContent: {
    height: 'calc(100% - 34px)',
  },
});

const App = withWrappers(props => {
  const {
    coordinates,
    timestamp: queryLastTimestamp,
    well,
    wells,
    fracFleet,
    appHeaderProps,
    theme,
    onSettingChange,
    isRealtimeSidebarOpen,
    isFilterSidebarOpen,
    sideSetting,
    setSecondaryMenuItems,
  } = props;
  const appId = props?.app?.id;
  // 1 is a fallback value for localhost
  const devCenterAppId = props.app?.app?.id || 1;
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [zoomCollection, setZoomCollection] = useState(null);
  const [hideAxis, setHideAxis] = useState(false);
  const [openCSVDialog, setOpenCSVDialog] = useState(false);

  const classes = useStyles();
  const isCompactMode = (coordinates.pixelWidth || 0) <= TABLET_SIZE_BREAKPOINT;
  const isMobileMode = (coordinates.pixelWidth || 0) <= MOBILE_SIZE_BREAKPOINT;
  const padId = appHeaderProps?.appSettings?.padId;
  const initialLayout = {
    isRealtimeSidebarOpen: !isCompactMode && isRealtimeSidebarOpen,
    isFilterSidebarOpen: !isCompactMode && isFilterSidebarOpen,
    isMobileSize: false,
    isTabletSize: false,
    rtSidebarHorizontalHeigh: RT_SIDEBAR_HORIZONTAL_HEIGH,
  };

  const selectedWells = useAppWells(well, wells);
  const isAssetViewer = useIsAssetViewer({ well, wells });

  const {
    activitySetting,
    appPadModeSetting,
    appOffsetSetting,
    appRtValuessetSetting,
    appFilterSetting,
    appScaleSetting,
    appDataSetting,
    appGraphColorsSetting,
    appCustomTimeSetting,
    settingAssetKey,
    onActivitySettingChange,
    onAppOffsetSettingChange,
    onAppFilterSettingChange,
    onAppSettingChange,
    onAppRtValuesSettingChange,
    isAppScaleSettingChanged,
    setIsAppScaleSettingChanged,
  } = useAppSettings(props, selectedWells, isAssetViewer);
  const currentAsset = resolveCurrentAssetByPadMode(selectedWells, appPadModeSetting);

  // NOTE: All subscriptions
  const {
    witsSubData,
    predictionsSubData,
    convertedWitsSubData,
    convertedPredictionsData,
    convertedTrackingSubData,
  } = useAppSubscriptions(currentAsset, queryLastTimestamp, appScaleSetting, isAssetViewer);
  const { filteredWitsSubData, filteredConvertedWitsSubData } = useWitsFilter({
    witsSubData,
    convertedWitsSubData,
  });
  const { createActivitySubData, updateActivitySubData } = useActivitySubscriptions(
    currentAsset,
    queryLastTimestamp,
    isAssetViewer
  );

  const {
    subData: abraSubData,
    channels,
    wells: abraWells,
  } = useAbraData({
    ...props,
    appRtValuessetSetting,
  });

  const goals = useGoals(currentAsset, props);

  const [
    {
      mainData,
      abraStart,
      mappedChemicals,
      offsetPressures,
      customChannels,
      dataRange,
      firstTimestamp,
      witsCollection,
      stagesData,
    },
    updatePredictions,
    addDetailData,
    cancelEditData,
    saveEditedData,
  ] = useFetchedAllData(
    selectedWells,
    appOffsetSetting,
    appFilterSetting,
    appPadModeSetting,
    isAssetViewer,
    queryLastTimestamp,
    appScaleSetting,
    appDataSetting,
    witsSubData,
    appCustomTimeSetting,
    predictionsSubData,
    createActivitySubData,
    updateActivitySubData,
    onAppSettingChange,
    setLoading,
    appRtValuessetSetting,
    abraWells,
    isAppScaleSettingChanged,
    setIsAppScaleSettingChanged
  );

  const abra = useLazyAbra({
    channels,
    appDataSetting,
    offsetPressures,
    abraSubData,
    onAppSettingChange,
    abraStart,
    wells: abraWells,
    dataSetting: props.dataSetting,
  });

  const isLive = useLiveTimer(filteredWitsSubData, mainData, appFilterSetting);
  const isPadMode = appPadModeSetting.mode === 'pad';
  const isSliderVisible =
    !isCompactMode &&
    appFilterSetting.viewMode !== VIEW_MODE_KEYS.overlay &&
    sideSetting.showSlider;
  const isPreview = props.app.view === 'preview';

  const [chartConfigration, setChartConfigration] = useChartOptions({
    settingAssetKey,
    appId,
    activitySetting,
    goals,
    abraData: abra,
    mainData,
    hideAxis: hideAxis || isMobileMode,
    isCompactMode,
    isLive,
    theme,
    appFilterSetting,
    appScaleSetting,
    appDataSetting,
    zoom,
  });

  const streamsData = useWellsStreamSubscription({
    isAssetDashboard: !!well,
    currentWellId: currentAsset?.asset_id,
    isPadMode,
    selectedWells,
    latestWits: filteredWitsSubData,
    isLive: !queryLastTimestamp, // completion timeline mode
    showStreamboxStatus: sideSetting.showStreamboxStatus,
  });

  const handleDownloadCSV = useCallback(() => {
    setOpenCSVDialog(true);
  }, []);

  useEffect(() => {
    setZoom(null);
  }, [appFilterSetting.stageMode]);

  useCsvExportMenuItems(setSecondaryMenuItems, handleDownloadCSV);

  const getEmptyViewTitle = () => {
    return appFilterSetting.stageMode === 'manual'
      ? 'No Data Available in Selected Range'
      : 'No Data Available';
  };

  const { viewMode } = appFilterSetting;
  const isOverlay = viewMode === VIEW_MODE_KEYS.overlay;

  const executeDebounced = useMemo(() => debounce(fn => fn(), 500), []);

  const handleUpdateZoom = newZoom => {
    if (!newZoom) {
      setZoom(newZoom);
      setZoomCollection(null);
      return;
    }

    if (newZoom.startValue === zoom?.startValue && newZoom.endValue === zoom?.endValue) {
      return;
    }
    const newZoomFixed = {
      startValue: newZoom.startValue === dataRange[0] ? null : newZoom.startValue,
      endValue: newZoom.endValue === dataRange[1] ? null : newZoom.endValue,
    };

    const currentZoomCollection = zoomCollection || witsCollection;
    const targetZoomCollection = resolveZoomCollection({
      viewMode,
      newZoom,
      stagesCount: mainData.length,
    });

    const updateDetailData = () => {
      setDetailLoading(true);
      const timeRanges = mainData.map((_, stageIndex) => {
        return isOverlay
          ? [
              newZoomFixed.startValue
                ? newZoomFixed.startValue * 60 + chartConfigration.refTimestamps[stageIndex]
                : undefined,
              newZoomFixed.endValue
                ? newZoomFixed.endValue * 60 + chartConfigration.refTimestamps[stageIndex]
                : undefined,
            ]
          : [newZoomFixed.startValue, newZoomFixed.endValue];
      });
      addDetailData(timeRanges, setDetailLoading, targetZoomCollection);
    };

    setZoom(newZoomFixed);
    if (currentZoomCollection === targetZoomCollection) {
      executeDebounced(updateDetailData);
      return;
    }

    setZoomCollection(targetZoomCollection);
    updateDetailData();
  };

  const handleLegendChange = newLegend => {
    setChartConfigration(prev => ({ ...prev, legend: newLegend }));
    setAppViewStorageSettings(settingAssetKey, newLegend.selected);
  };

  const isDataEmpty = isAppDataEmpty(mainData, isAssetViewer);
  const rtValues = concat(RT_TYPES, offsetPressures, customChannels, [PERCENT_PROPPANT]);
  const isEventsEditorVisible =
    !isAssetViewer &&
    !(isOverlay && isMultipleStages(appFilterSetting)) &&
    !(isLive && appFilterSetting.stageMode === STAGE_MODE_KEYS.active);

  const currentChartTimeRange = chartTimeRange(zoom, isLive, dataRange);
  const hasRampEvent = mainData.some(stageData => stageData?.predictions?.target_ramp_rate?.[0]);

  return (
    <div className={classes.container}>
      <AppContext.Provider value={{ isAssetViewer }}>
        <AppHeader
          appHeaderProps={
            isPreview ? { ...appHeaderProps, app: props.app.app, fracFleet } : appHeaderProps
          }
          appOffsetSetting={appOffsetSetting}
          onAppOffsetSettingChange={onAppOffsetSettingChange}
        />
        <LayoutContextProvider initialLayout={initialLayout}>
          <>
            <FilterBoxContextProvider>
              <FilterSidebar
                assetId={currentAsset?.asset_id}
                isPadMode={isPadMode}
                showManualStages={!isPadMode}
                scaleSetting={appScaleSetting}
                currentStage={filteredWitsSubData && filteredWitsSubData.stage_number}
                dataSetting={appDataSetting}
                filterSetting={appFilterSetting}
                mappedChemicals={mappedChemicals}
                offsetPressures={offsetPressures}
                realtimeTypes={rtValues}
                customChannels={customChannels}
                customTimeSetting={appCustomTimeSetting}
                assetTimeLimits={{
                  firstTimestamp,
                  lastTimestamp: filteredWitsSubData?.timestamp,
                }}
                onSettingChange={onAppSettingChange}
                onFilterSettingChange={onAppFilterSettingChange}
                graphColors={appGraphColorsSetting}
                onOpenClose={onSettingChange}
              />
            </FilterBoxContextProvider>
            <Content showRealtimeValues={sideSetting.showRealtimeValues}>
              <Settings
                setting={appFilterSetting}
                sideSetting={sideSetting}
                onSettingChange={onSettingChange}
              />
              {loading ? (
                <div className={classes.cTpChartContainer}>
                  <LoadingIndicator />
                </div>
              ) : (
                <>
                  {isDataEmpty && (
                    <EmptyState
                      title={getEmptyViewTitle()}
                      classes={{ content: classes.emptyContent }}
                    />
                  )}
                  {!isDataEmpty && (
                    <>
                      {sideSetting.showStreamboxStatus && (
                        <StreamboxStatus
                          streamsData={streamsData}
                          className={!isCompactMode && classes.streamboxStatusDesktop}
                        />
                      )}
                      <FeedCreationProvider assetId={currentAsset?.asset_id} app={props.app}>
                        <CursorPositionProvider
                          rangeData={currentChartTimeRange}
                          chartGrid={chartConfigration.grid}
                        >
                          <div className={classes.cTpTooltipLineContainer}>
                            <div className={classes.cTpChartContainer}>
                              <ChartStageNames
                                chartGrid={chartConfigration.grid}
                                assetTimeLimits={{
                                  startValue: currentChartTimeRange.startTimestamp,
                                  endValue: currentChartTimeRange.endTimestamp,
                                }}
                                isOverlay={isOverlay}
                                zoom={zoom}
                                data={mainData}
                                isLive={isLive}
                              />
                              <Chart
                                appId={appId}
                                {...chartConfigration}
                                hideAxis={hideAxis}
                                isLive={isLive}
                                isMobileMode={isMobileMode}
                                settingAssetKey={settingAssetKey}
                                showEventsEditor={isEventsEditorVisible}
                                showTooltip={sideSetting.showTooltip}
                                currentStage={
                                  filteredWitsSubData && filteredWitsSubData.stage_number
                                }
                                onClickHideAxisIcon={setHideAxis}
                                onUpdateEvent={updatePredictions}
                                onUpdateZoom={handleUpdateZoom}
                                onCancelEdit={cancelEditData}
                                onSaveEditedData={saveEditedData}
                              />
                              <LiveBadge isLive={isLive} grid={chartConfigration.grid} />
                              <DetailDataLoader
                                isDetailLoading={detailLoading}
                                grid={chartConfigration.grid}
                              />
                            </div>
                            {isSliderVisible && (
                              <ChartSlider
                                chartGrid={chartConfigration.grid}
                                scaleSettings={appScaleSetting}
                                data={mainData}
                                assetTimeLimits={{
                                  startValue: dataRange[0] || 0,
                                  endValue: dataRange[1] || 0,
                                }}
                                currentRange={zoom}
                                onSliderChange={handleUpdateZoom}
                              />
                            )}
                            {!isPreview &&
                              sideSetting.showFeedBar &&
                              appFilterSetting.viewMode !== VIEW_MODE_KEYS.overlay && (
                                <div className={classes.cTpFeedContainer}>
                                  <FeedBarContext.Provider
                                    value={{
                                      appKey: props.app?.app?.app_key,
                                      package: props.app?.package,
                                      appId,
                                    }}
                                  >
                                    <FeedBar
                                      currentAsset={currentAsset}
                                      currentUser={props.currentUser}
                                      assets={wells || [well]}
                                      timeRange={chartTimeRange(zoom, isLive, dataRange)}
                                      chartGrid={chartConfigration.grid}
                                    />
                                  </FeedBarContext.Provider>
                                </div>
                              )}
                            {!isPreview && (
                              <FeedsCreationHoverLine
                                chartGrid={chartConfigration.grid}
                                timeRange={chartTimeRange(zoom, isLive, dataRange)}
                                currentUser={props.currentUser}
                              />
                            )}
                          </div>
                        </CursorPositionProvider>
                      </FeedCreationProvider>
                      {sideSetting.showLegendBar && (
                        <Legends
                          hasRamp={hasRampEvent}
                          setting={activitySetting}
                          legend={chartConfigration.legend}
                          onLegendChange={handleLegendChange}
                          onSettingChange={onActivitySettingChange}
                        />
                      )}
                    </>
                  )}
                </>
              )}
              <div className={classes.appFooter}>
                <StatusBadge
                  appId={devCenterAppId}
                  appHeight={coordinates.pixelHeight}
                  appWidth={coordinates.pixelWidth}
                  currentUser={props.currentUser}
                  currentAsset={currentAsset}
                />
                <LastDataUpdate witsData={filteredWitsSubData} />
              </div>
            </Content>
            {(!isCompactMode || sideSetting.showRealtimeValues) && (
              <RealTimeSidebarContainer
                assetKey={getAssetKey(fracFleet, well, padId)}
                stages={stagesData}
                offsetPressures={offsetPressures}
                customChannels={customChannels}
                rtValuesSetting={appRtValuessetSetting}
                onAppSettingChange={onAppRtValuesSettingChange}
                convertedWitsSubData={filteredConvertedWitsSubData}
                witsSubData={filteredWitsSubData}
                convertedTrackingSubData={convertedTrackingSubData}
                convertedPredictionsSubData={convertedPredictionsData}
                abraChannelsData={channels}
                statsData={chartConfigration.statsData}
                isRealtimeSidebarOpen={isPreview ? false : isRealtimeSidebarOpen}
                onSettingChange={onSettingChange}
                scaleSettings={appScaleSetting}
              />
            )}
          </>
        </LayoutContextProvider>
        <CSVExportDialog
          currentAsset={currentAsset}
          isDialogOpen={openCSVDialog}
          companyId={props.currentUser.company_id}
          isLive={isLive}
          latestWitsData={filteredWitsSubData}
          onCancel={() => setOpenCSVDialog(!openCSVDialog)}
        />
      </AppContext.Provider>
    </div>
  );
});

App.propTypes = {
  timestamp: PropTypes.number,
  theme: PropTypes.shape({}).isRequired,
  coordinates: PropTypes.shape({
    pixelWidth: PropTypes.number,
    pixelHeight: PropTypes.number,
  }).isRequired,
  currentUser: PropTypes.shape({ company_id: PropTypes.number }).isRequired,

  well: PropTypes.shape({}),
  wells: PropTypes.arrayOf(PropTypes.shape({})),
  fracFleet: PropTypes.shape({}),
  settingsByAsset: PropTypes.shape({}).isRequired,
  appHeaderProps: PropTypes.shape({
    appSettings: { padId: PropTypes.number.isRequired },
  }).isRequired,
  app: PropTypes.shape({
    id: PropTypes.number,
    package: PropTypes.shape({}),
    app: PropTypes.shape({ app_key: PropTypes.string, id: PropTypes.number }),
    view: PropTypes.string,
  }).isRequired,

  offsetSetting: PropTypes.shape({}),
  filterSetting: PropTypes.shape({}),
  scaleSetting: PropTypes.arrayOf(PropTypes.shape({})),
  dataSetting: PropTypes.shape({}),
  activitySettingByAsset: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  graphColors: PropTypes.shape({}),
  offsetGraphColors: PropTypes.shape({}),
  isAssetViewer: PropTypes.bool,
  isRealtimeSidebarOpen: PropTypes.bool,
  isFilterSidebarOpen: PropTypes.bool,
  rtValuesSetting: PropTypes.arrayOf(PropTypes.string),
  sideSetting: PropTypes.shape({
    showFeedBar: PropTypes.bool,
    showLegendBar: PropTypes.bool,
    showRealtimeValues: PropTypes.bool,
    showStreamboxStatus: PropTypes.bool,
    showSlider: PropTypes.bool,
    showTooltip: PropTypes.bool,
  }),

  onSettingChange: PropTypes.func.isRequired,
  setSecondaryMenuItems: PropTypes.func.isRequired,
};

App.defaultProps = {
  timestamp: null,
  theme: {},
  well: null,
  wells: null,
  fracFleet: null,
  ...DEFAULT_SETTINGS,
  isAssetViewer: true,
};

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
