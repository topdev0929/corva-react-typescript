import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import AppContext from '~/AppContext';
import { useDownHoleSensorData } from '~/effects/useDownholeSensorData';
import { useAppSubscriptions } from '~/effects/useSubscriptionData';
import { useTimeRange } from '~/effects/useTimeRange';
import { useFetchedAllData } from '~/effects/useFetchedAllData';
import { usePhases } from '~/effects/usePhases';
import { SOURCE_TYPE, VIEW_MODE_OPTIONS } from '~/constants';
import { getSourceType } from '~/utils/dataUtils';

const AppProvider = ({
  children,
  currentUser,
  currentAsset,
  app,
  appSettings,
  onAppSettingChange,
  onAppSettingsChange,
}) => {
  const [assetId, setAssetId] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [allChannels, setAllChannels] = useState([]);
  const [columnMapping, setColumnMapping] = useState([]);
  const [timeRange, setTimeRange] = useState();
  const [preResetRange, setPreResetRange] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [onTimeAdjustment, setOnTimeAdjustment] = useState(false);
  const [criticalEvents, setCriticalEvents] = useState([]);
  const companyId = currentUser.company.id;

  useEffect(() => {
    setAssetId(currentAsset?.asset_id);
    setActivePhase(null);
    setAllChannels([]);
    setColumnMapping({});
    setTimeRange(null);
    setIsLive(false);
    setLastTimestamp(null);
  }, [currentAsset?.asset_id]);

  const sourceType = useMemo(() => {
    if (!timeRange) return SOURCE_TYPE.xhigh;
    return getSourceType(timeRange.start, timeRange.end);
  }, [timeRange?.start, timeRange?.end]);

  const [sensorHeaderData, sensorTimeDiff, saveSensorTimeAdjustment, setSensorDataChangeToggle] =
    useDownHoleSensorData(currentUser.company.provider, assetId, companyId);

  useTimeRange({
    assetId,
    setAllChannels,
    setColumnMapping,
    timeRange,
    setTimeRange,
    setLastTimestamp,
    savedTimeRange: appSettings.time_range,
    onAppSettingChange,
    sensorHeaderData,
    traces: appSettings.traces,
    sensorTimeDiff,
  });

  const [subData, setSubData] = useAppSubscriptions(
    assetId,
    appSettings.traces,
    timeRange?.end >= timeRange?.max,
    setIsLive
  );

  const [loading, allData, mainData, channels, setChannels, sensorValueRange] = useFetchedAllData({
    provider: currentUser.company.provider,
    assetId,
    sourceType,
    offsetWells: appSettings.offset_picker.offset_wells ?? [],
    subData,
    setSubData,
    isResetZoom: Boolean(preResetRange),
    traces: appSettings.traces,
    timeRange,
    setLastTimestamp,
    isOverlay: appSettings.view_mode === VIEW_MODE_OPTIONS[1].value,
    isLive,
    sensorTimeDiff,
    onAppSettingChange,
    sensorHeaderData,
    setIsDetailLoading,
    onTimeAdjustment,
    setOnTimeAdjustment,
  });

  const [
    phasePickList,
    manualPhases,
    selectedPhases,
    setSelectedPhases,
    selectedZones,
    setSelectedZones,
    saveManualPhase,
    updateManualPhase,
    deleteManualPhase,
    criticalPoints,
    saveCriticalPoint,
    updateCriticalPoints,
    updateCriticalPoint,
    deleteCriticalPoint,
    filteredPoints,
    setFilteredPoints,
  ] = usePhases(currentUser.company.provider, companyId, assetId, appSettings, onAppSettingChange);

  return (
    <AppContext.Provider
      value={{
        loading,
        isDetailLoading,
        setIsDetailLoading,
        // App Setting Info
        assetId,
        currentUser,
        provider: currentUser.company.provider,
        sourceType,
        viewDataset: appSettings.view_dataset,
        app,
        appSettings,
        onAppSettingChange,
        onAppSettingsChange,
        // Trace Log
        isLive,
        allData,
        mainData,
        // Phase
        phasePickList,
        manualPhases,
        selectedPhases,
        setSelectedPhases,
        selectedZones,
        setSelectedZones,
        saveManualPhase,
        updateManualPhase,
        deleteManualPhase,
        activePhase,
        setActivePhase,
        // Channel
        allChannels,
        channels,
        setChannels,
        // Critical Point
        criticalPoints,
        filteredPoints,
        setFilteredPoints,
        saveCriticalPoint,
        updateCriticalPoints,
        updateCriticalPoint,
        deleteCriticalPoint,
        criticalEvents,
        setCriticalEvents,
        // Time Range
        timeRange,
        setTimeRange,
        preResetRange,
        setPreResetRange,
        lastTimestamp,
        // Sensor
        sensorHeaderData,
        sensorTimeDiff,
        saveSensorTimeAdjustment,
        sensorValueRange,
        setSensorDataChangeToggle,
        setOnTimeAdjustment,
        // Column Mapper
        columnMapping,
        setColumnMapping,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.shape({
    company: PropTypes.shape({ provider: PropTypes.string, id: PropTypes.number }),
  }).isRequired,
  currentAsset: PropTypes.shape({
    asset_id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  app: PropTypes.shape({}).isRequired,
  appSettings: PropTypes.shape({
    traces: PropTypes.arrayOf(PropTypes.shape({})),
    view_mode: PropTypes.string,
    time_range: PropTypes.shape({
      start_time: PropTypes.number,
      end_time: PropTypes.number,
    }),
    view_dataset: PropTypes.string.isRequired,
    offset_picker: PropTypes.shape({ offset_wells: PropTypes.arrayOf(PropTypes.shape({})) }),
  }).isRequired,
  onAppSettingChange: PropTypes.func.isRequired,
  onAppSettingsChange: PropTypes.func.isRequired,
};

export default AppProvider;
