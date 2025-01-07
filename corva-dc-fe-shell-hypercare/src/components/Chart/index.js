import { useRef, useEffect, useState, useContext, memo, useMemo } from 'react';
import { SizeMe } from 'react-sizeme';
import { Button, Popover } from '@material-ui/core';
import { inRange, minBy } from 'lodash';
import { EmptyState, LoadingIndicator, Modal } from '@corva/ui/components';
import { showInfoNotification } from '@corva/ui/utils';

import ChartContent from './Content';
import ChartSlider from '~/components/ChartSlider';
import DetailDataLoader from '../DetailDataLoader';

import styles from './Chart.css';

import { getEmptyState } from '~/utils/dataUtils';
import { useChartPhases } from '~/effects/useChartPhases';
import { useChartCritical } from '~/effects/useChartCritical';
import { useFilteredData } from '~/effects/useFilteredData';
import { useGroupedChannels } from '~/effects/useGroupedChannels';
import LiveBadge from '~/components/LiveBadge';
import AppContext from '~/AppContext';
import { EMPTY_STATE, PHASE_DIALOG_TYPE, VIEW_MODE_OPTIONS, TRACE_SOURCES } from '~/constants';
import PhaseManagerDialog from './PhaseManagerDialog';
import CPointCreateDialog from './CPointCreateDialog';
import CPointEditDialog from './CPointEditDialog';
import { PhaseTooltip, PointTooltip } from './Tooltip';
import CPointEvent from './CPointEvent';
import Comment from '../Comment';
import YAxisLabelCounter from './YAxisLabelCounter';
import Legend from './Legend';
import ControlLayer from './ControlLayer';

// eslint-disable-next-line react/prop-types
function Chart({ chartWidth, chartHeight }) {
  const {
    loading,
    isDetailLoading,
    setIsDetailLoading,
    assetId,
    currentUser,
    viewDataset,
    allData,
    mainData,
    isLive,
    channels,
    phasePickList,
    manualPhases,
    selectedPhases,
    selectedZones,
    saveManualPhase,
    updateManualPhase,
    deleteManualPhase,
    setActivePhase,
    criticalPoints,
    saveCriticalPoint,
    updateCriticalPoints,
    updateCriticalPoint,
    deleteCriticalPoint,
    setFilteredPoints,
    setCriticalEvents,
    timeRange,
    setTimeRange,
    lastTimestamp,
    preResetRange,
    setPreResetRange,
    app,
    appSettings,
    sourceType,
    saveSensorTimeAdjustment,
    onAppSettingChange,
    provider,
    sensorHeaderData,
    sensorTimeDiff,
    setOnTimeAdjustment,
  } = useContext(AppContext);

  const containerRef = useRef();
  const chartRef = useRef();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isTimeAdjustMenuOpen, setIsTimeAdjustMenuOpen] = useState(false);
  const [errorMsgOpen, setErrorMsgOpen] = useState(false);
  const [clientRect, setClientRect] = useState(null);
  const [chart, setChart] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [interimPoints, setInterimPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null);
  const [phaseTooltip, setPhaseTooltip] = useState(null);
  const [pointTooltip, setPointTooltip] = useState(null);
  const [sensorTimePoint, setSensorTimePoint] = useState(null);
  const [sensorId, setSensorId] = useState(null);
  const [sensorTimestampData, setSensorTimestampData] = useState(null);
  const [inSensorTimeRange, setInSensorTimeRange] = useState(false);
  const [activeSensors, setActiveSensors] = useState([]);
  const [activeSensorId, setActiveSensorId] = useState('');
  const [showAxes, setShowAxes] = useState(true);
  const [panEnable, setPanEnable] = useState(false);
  const [panningTime, setPanningTime] = useState();

  const isOverlay = useMemo(
    () => appSettings.view_mode === VIEW_MODE_OPTIONS[1].value,
    [appSettings.view_mode]
  );

  const emptyState = useMemo(() => getEmptyState(mainData, timeRange), [mainData, timeRange]);

  const groupedChannels = useGroupedChannels(channels);

  const [filteredPhases, filteredData, filteredTimeRange] = useFilteredData({
    mainData,
    manualPhases,
    selectedPhases,
    selectedZones,
    isOverlay,
    timeRange,
    criticalPoints,
    refPoint: appSettings.ref_point,
  });

  const {
    phaseDialogType,
    editingPhase,
    addingPhase,
    setAddingPhase,
    addedGeoPhases,
    setAddedGeoPhases,
    handleClickStartPhase,
    handleClickEndPhase,
    handleAddNewPhase,
    handleEditPhase,
    handleDeletePhase,
    handleClosePhaseDialog,
  } = useChartPhases({
    chart,
    assetId,
    saveManualPhase,
    setActivePhase,
    updateManualPhase,
    deleteManualPhase,
    manualPhases,
    filteredPhases,
    setPhaseTooltip,
    clientRect,
    timeRange,
    invisibleLegends: appSettings.invisible_legends,
    setIsContextMenuOpen,
    setErrorMsgOpen,
    panningTime,
  });

  const {
    showPoints,
    setShowPoints,
    isCriticalDialogOpen,
    handleClickCriticalPoint,
    handleAddCriticalPoint,
    handleCloseCriticalDialog,
  } = useChartCritical({
    isEditing,
    chart,
    criticalPoints,
    channels,
    manualPhases,
    addingPhase,
    filteredTimeRange,
    setFilteredPoints,
    setEditingPoint,
    setPointTooltip,
    saveCriticalPoint,
    setAddingPhase,
    setIsContextMenuOpen,
    invisibleLegends: appSettings.invisible_legends,
    panningTime,
    setCriticalEvents,
    timeRange,
    provider,
    sensorHeaderData,
    sensorTimeDiff,
  });

  useEffect(() => {
    const sensorIds = [];
    channels?.forEach(channel => {
      if (
        channel.trackType === TRACE_SOURCES.DOWNHOLE &&
        !sensorIds.find(item => item === channel.sensorId)
      ) {
        sensorIds.push(channel.sensorId);
      }
    });
    const headerData = [];
    sensorHeaderData?.forEach(header => {
      if (sensorIds.find(id => id === header.id)) {
        headerData.push({
          id: header.id,
          minTimestamp: header.minTimestamp + sensorTimeDiff?.[header.id] ?? 0,
          maxTimestamp: header.maxTimestamp + sensorTimeDiff?.[header.id] ?? 0,
        });
      }
    });
    setSensorTimestampData(headerData);
  }, [sensorHeaderData, sensorTimeDiff, channels]);

  useEffect(() => {
    let inTimeRange = false;
    sensorTimestampData?.forEach(sensor => {
      if (inRange(addingPhase?.timestamp, sensor?.minTimestamp, sensor?.maxTimestamp)) {
        inTimeRange = true;
      }
    });
    setInSensorTimeRange(inTimeRange);
  }, [addingPhase?.timestamp]);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setClientRect({ top: Math.round(rect.top), left: Math.round(rect.x) });
    }
  }, [containerRef.current?.clientWidth]);

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.chart.zoomOut();
    }
  };

  const handleOpenContextMenu = e => {
    const { chart } = chartRef.current;
    if (!chart) return;

    e.preventDefault();

    const timeMin = Math.round(chart.xAxis[0].min);
    const timeMax = Math.round(chart.xAxis[0].max);
    const left = chart.plotLeft;
    const width = chart.plotWidth;
    const plotX = e.clientX - left - clientRect.left;
    const timestamp = Math.round(timeMin + (plotX * (timeMax - timeMin)) / width);

    setAddingPhase({ x: e.clientX, y: e.clientY, timestamp });
    setIsContextMenuOpen(true);
  };

  const handleCloseErrorMessage = () => {
    setErrorMsgOpen(false);
  };

  const handleClickEditEvents = () => {
    setIsEditing(true);
    setInterimPoints(showPoints);
  };

  const handleUpdateInterimPoints = async (id, newCoord) => {
    const newPoints = interimPoints.map(item => {
      if (id !== item.id) return item;
      const pointSeries = (chart.series ?? []).find(
        _ => _.options?.custom?.traceName === item.trace
      )?.points;
      const timeMin = Math.round(chart.xAxis[0].min);
      const timeMax = Math.round(chart.xAxis[0].max);
      const plotX = newCoord.x - chart.plotLeft;
      const timestamp = Math.round(timeMin + (plotX * (timeMax - timeMin)) / chart.plotWidth);
      const closestItem = minBy(pointSeries, item => Math.abs(item.category - timestamp));
      const left = chart.plotLeft + closestItem?.plotX;
      const top = chart.plotTop + closestItem?.plotY;
      return {
        ...item,
        left,
        top,
        timestamp,
      };
    });

    setInterimPoints(newPoints);
  };

  const handleUpdateCriticalPoints = async () => {
    setShowPoints(interimPoints);
    setIsEditing(false);
    await updateCriticalPoints(interimPoints);
  };

  const startAdjustSensorTime = i => {
    setSensorTimePoint(addingPhase.timestamp);
    setAddedGeoPhases([{ start_time: addingPhase.timestamp }]);
    setIsContextMenuOpen(false);
    setIsTimeAdjustMenuOpen(false);
    setSensorId(activeSensors[i].sensorId);
  };

  const endAdjustSensorTime = () => {
    showInfoNotification('Time adjustment is in progress');
    setSensorTimePoint(null);
    setAddedGeoPhases([]);
    setIsContextMenuOpen(false);
    saveSensorTimeAdjustment(addingPhase.timestamp - sensorTimePoint, sensorId);
    setSensorId(null);
    setOnTimeAdjustment(true);
  };

  const cancelAdjustSensorTime = () => {
    setSensorTimePoint(null);
    setAddedGeoPhases([]);
    setIsContextMenuOpen(false);
    setSensorId(null);
  };

  const handleStartTimeAdjustment = () => {
    setIsTimeAdjustMenuOpen(true);
    const sensors = [];
    channels.forEach(channel => {
      if (
        channel.trackType === TRACE_SOURCES.DOWNHOLE &&
        !sensors.find(item => item.sensorName === channel.sensorName)
      ) {
        sensors.push({ sensorName: channel.sensorName, sensorId: channel.sensorId });
      }
    });
    setActiveSensors(sensors);
  };

  if (loading) {
    return (
      <div className={styles.chartContent}>
        <LoadingIndicator />
      </div>
    );
  }

  if (emptyState === EMPTY_STATE.noAsset) {
    return (
      <EmptyState
        title="Asset has no Data"
        image={EmptyState.IMAGES.AssetHasNoData}
        classes={{ root: styles.chartContent }}
      />
    );
  }

  return (
    <div className={styles.chartContent} ref={containerRef}>
      <div className={styles.chartWrapper}>
        {emptyState === EMPTY_STATE.noDataAvailable ? (
          <EmptyState
            title="No Data Available in Selected Range"
            image={EmptyState.IMAGES.noDataAvailable}
            classes={{ root: styles.noDataCotent }}
          />
        ) : (
          <div className={styles.chartContainer} onContextMenu={handleOpenContextMenu}>
            <DetailDataLoader isDetailLoading={isDetailLoading} chart={chart} />

            <ChartContent
              chartRef={chartRef}
              width={chartWidth}
              height={chartHeight}
              data={filteredData}
              preResetRange={preResetRange}
              setPreResetRange={setPreResetRange}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              channels={groupedChannels}
              addedPhases={addedGeoPhases}
              filteredPhases={filteredPhases}
              setChart={setChart}
              isOverlay={isOverlay}
              sourceType={sourceType}
              setActiveSensorId={setActiveSensorId}
              setIsDetailLoading={setIsDetailLoading}
              isEditing={isEditing}
              showAxes={showAxes}
              invisibleLegends={appSettings.invisible_legends}
              panEnable={panEnable}
              setPanningTime={setPanningTime}
            />

            {showAxes && <YAxisLabelCounter yAxis={chart?.yAxis} channels={groupedChannels} />}

            <LiveBadge
              isLive={isLive}
              grid={{ top: 8, right: chart?.chartWidth - chart?.plotLeft - chart?.plotWidth }}
            />

            <ControlLayer
              marginRight={chart?.chartWidth - chart?.plotLeft - chart?.plotWidth}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              showEditEvents={
                !isEditing && !isOverlay && !selectedPhases.length && !selectedZones.length
              }
              handleClickEditEvents={handleClickEditEvents}
              handleUpdateCriticalPoints={handleUpdateCriticalPoints}
              showAxes={showAxes}
              setShowAxes={setShowAxes}
              preResetRange={preResetRange}
              handleResetZoom={handleResetZoom}
              panEnable={panEnable}
              setPanEnable={setPanEnable}
            />

            {isEditing && (
              <>
                {interimPoints.map(point => (
                  <CPointEvent
                    key={point.id}
                    initPoint={point}
                    clientRect={clientRect}
                    onUpdatePoint={handleUpdateInterimPoints}
                  />
                ))}
              </>
            )}
            {!isEditing && pointTooltip && <PointTooltip point={pointTooltip} />}
            {phaseTooltip && <PhaseTooltip data={phaseTooltip} />}
          </div>
        )}

        <ChartSlider
          viewDataset={viewDataset}
          allData={allData}
          left={chart?.plotLeft}
          right={chart?.chartWidth - chart?.plotLeft - chart?.plotWidth}
          lastTimestamp={lastTimestamp}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        <Comment
          assetId={assetId}
          app={app}
          currentUser={currentUser}
          offsetWells={appSettings.offset_picker.offset_wells}
          timeRange={timeRange}
          chart={chart}
        />

        <Legend
          marginLeft={chart?.plotLeft}
          marginRight={chart?.chartWidth - chart?.plotLeft - chart?.plotWidth}
          channels={channels}
          phases={filteredPhases}
          invisibleLegends={appSettings.invisible_legends}
          onAppSettingChange={onAppSettingChange}
        />
      </div>

      <Popover
        open={isContextMenuOpen}
        anchorEl={chartRef.current}
        onClose={() => setIsContextMenuOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: addingPhase?.y, left: addingPhase?.x + 8 }}
      >
        <div className={styles.phaseMenu}>
          {!sensorTimePoint ? (
            <>
              <div className={styles.phaseMenuItem} onClick={handleClickStartPhase}>
                Start New Phase
              </div>
              <div className={styles.phaseMenuItem} onClick={handleClickEndPhase}>
                End Current Phase
              </div>
              <div className={styles.phaseMenuItem} onClick={handleClickCriticalPoint}>
                Identify Critical Point
              </div>
              {(activeSensorId || inSensorTimeRange) && (
                <div className={styles.phaseMenuItem} onClick={handleStartTimeAdjustment}>
                  Start Sensor Time Adjustment
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.phaseMenuItem} onClick={endAdjustSensorTime}>
                End Sensor Time Adjustment
              </div>
              <div className={styles.phaseMenuItem} onClick={cancelAdjustSensorTime}>
                Cancel Sensor Time Adjustment
              </div>
            </>
          )}
        </div>
      </Popover>

      {activeSensors?.length > 0 && (
        <Popover
          open={isTimeAdjustMenuOpen}
          anchorEl={chartRef.current}
          onClose={() => setIsTimeAdjustMenuOpen(false)}
          anchorReference="anchorPosition"
          anchorPosition={{ top: addingPhase?.y + 120, left: addingPhase?.x + 120 }}
        >
          <div className={styles.phaseMenu}>
            {activeSensors.map((channel, i) => {
              return (
                <div
                  className={styles.phaseMenuItem}
                  onClick={() => startAdjustSensorTime(i)}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                >
                  {channel.sensorName}
                </div>
              );
            })}
          </div>
        </Popover>
      )}

      <PhaseManagerDialog
        open={phaseDialogType !== PHASE_DIALOG_TYPE.close}
        variant={phaseDialogType}
        phaseToShow={editingPhase}
        phasePickList={phasePickList}
        manualPhases={manualPhases}
        onSave={phaseDialogType === PHASE_DIALOG_TYPE.create ? handleAddNewPhase : handleEditPhase}
        onClose={handleClosePhaseDialog}
        onDelete={handleDeletePhase}
      />

      <CPointCreateDialog
        open={isCriticalDialogOpen}
        assetId={assetId}
        currentUser={currentUser}
        timestamp={addingPhase?.timestamp}
        channels={channels}
        onSave={handleAddCriticalPoint}
        onClose={handleCloseCriticalDialog}
      />

      <CPointEditDialog
        open={!isEditing}
        point={editingPoint}
        currentUser={currentUser}
        channels={channels}
        onSave={updateCriticalPoint}
        onDelete={deleteCriticalPoint}
        onClose={() => setEditingPoint(null)}
      />

      <Modal
        open={errorMsgOpen}
        onClose={handleCloseErrorMessage}
        title="Phase overlapping error"
        actionsClassName={styles.errorActions}
        actions={
          <Button variant="contained" color="primary" onClick={handleCloseErrorMessage}>
            Got it
          </Button>
        }
      >
        <div className={styles.errorContent}>
          <span>The end-time of the phase overlaps the next phase</span>
        </div>
      </Modal>
    </div>
  );
}

export default memo(props => (
  <SizeMe monitorWidth monitorHeight>
    {({ size }) => <Chart chartWidth={size.width} chartHeight={size.height} {...props} />}
  </SizeMe>
));
