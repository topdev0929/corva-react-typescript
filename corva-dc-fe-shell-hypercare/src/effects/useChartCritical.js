import { useState, useEffect } from 'react';
import { groupBy, minBy, sortBy, upperCase, lowerFirst } from 'lodash';
import { showErrorNotification } from '@corva/ui/utils';
import { SOURCE_TYPE, REF_POINT_NONE } from '~/constants';
import { getPhaseByPoint } from '~/utils/phases';
import { fetchWitsData } from '~/api/wits';
import { fetchDownHoleSensorData } from '~/api/sensor';

export function useChartCritical({
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
  invisibleLegends,
  panningTime,
  setCriticalEvents,
  timeRange,
  provider,
  sensorHeaderData,
  sensorTimeDiff,
}) {
  const [showPoints, setShowPoints] = useState([]);
  const [isCriticalDialogOpen, setIsCriticalDialogOpen] = useState(false);

  useEffect(() => {
    if (!chart?.xAxis || !chart?.series?.[0]?.points) return;
    const filterdPoints = criticalPoints
      .filter(point =>
        filteredTimeRange.some(({ min, max }) => point.timestamp >= min && point.timestamp <= max)
      )
      .filter(point => channels.findIndex(_ => _.traceName === point.trace) !== -1);

    const result = [];
    filterdPoints.forEach(point => {
      const series = chart.series
        .filter(item => item.options.custom?.traceName === point.trace)
        .find(item => {
          const { range } = item.options.custom;
          return point.timestamp >= range[0] && point.timestamp <= range[1];
        });
      const refTimeDiff = series?.options?.custom?.refTimeDiff ?? 0;
      let closestPoint = minBy(series?.points, item =>
        Math.abs(item.category + refTimeDiff - point.timestamp)
      );
      if (closestPoint && !closestPoint?.y && series?.points?.length > 1) {
        const index = series.points.findIndex(p => p.category === closestPoint.category);
        closestPoint = series.points[index + 1]?.y
          ? series.points[index + 1]
          : series.points[index - 1];
      }
      if (!closestPoint?.y) closestPoint = null;
      const ratio = (chart.chartWidth - chart.plotLeft) / (timeRange.end - timeRange.start);
      const x = chart.plotLeft + ratio * (point.timestamp - timeRange.start);
      const y = chart.plotTop + closestPoint?.plotY;
      if (
        closestPoint &&
        x > chart.plotLeft &&
        x < chart.plotLeft + chart.plotWidth &&
        !invisibleLegends.includes(point.trace)
      ) {
        result.push({
          ...point,
          left: chart.plotLeft + closestPoint?.plotX,
          top: y,
          value: closestPoint.y,
          x: closestPoint.x,
          trace: closestPoint.series?.userOptions?.custom?.traceName,
          unit: closestPoint.series?.userOptions?.custom?.unit,
        });
      }
    });

    setShowPoints(result);
  }, [criticalPoints, chart, filteredTimeRange, channels, invisibleLegends]);

  useEffect(() => {
    const grouped = groupBy(showPoints, 'trace');
    const filtered = sortBy(
      Object.keys(grouped).map(key => minBy(grouped[key], 'timestamp')),
      'timestamp'
    );
    setFilteredPoints([{ title: REF_POINT_NONE }, ...filtered]);
    setCriticalEvents(showPoints);

    if (!chart?.renderer) return;

    // NOTE: Render critical points
    let addedPointId = 0;
    let cpointToDelete = document.getElementById(`cpoint_group_${addedPointId}`);

    while (cpointToDelete) {
      cpointToDelete.remove();
      addedPointId += 1;
      cpointToDelete = document.getElementById(`cpoint_group_${addedPointId}`);
    }

    if (!isEditing) {
      showPoints.forEach((point, idx) => {
        const group = chart.renderer
          .g()
          .attr({
            id: `cpoint_group_${idx}`,
            zIndex: 3,
          })
          .add();
        const circle = chart.renderer.circle(point.left, point.top, 9).attr({
          fill: point.color,
          stroke: `${point.color}41`,
          'stroke-width': 6,
        });
        circle.add(group);

        const text = chart.renderer
          .text(upperCase(point.title[0]), point.left, point.top + 4)
          .attr({
            fill: '#fff',
            'font-size': 11,
            'font-weight': 500,
            align: 'center',
            verticalAlign: 'middle',
          });
        text.add(group);

        group.on('mouseover', () => {
          setPointTooltip(point);
        });

        group.on('mouseout', () => {
          setPointTooltip(null);
        });

        group.on('click', () => {
          setPointTooltip(null);
          setEditingPoint(point);
        });
      });
    }
  }, [showPoints, chart, isEditing]);

  useEffect(() => {
    if (!panningTime) return;

    const { plotLeft, plotWidth } = chart;
    const { min, max } = panningTime;
    showPoints.forEach((point, idx) => {
      const startTime = Math.max(point.timestamp, min);
      const x = plotLeft + (plotWidth * (startTime - min)) / (max - min);
      const pointEl = document.getElementById(`cpoint_group_${idx}`);
      const circle = pointEl?.querySelector('circle');
      const text = pointEl?.querySelector('text');
      circle?.setAttribute('cx', x);
      text?.setAttribute('x', x);
    });
  }, [panningTime, showPoints, chart]);

  const handleClickCriticalPoint = () => {
    const phase = getPhaseByPoint(manualPhases, addingPhase.timestamp);
    setAddingPhase(prev => ({ ...prev, phase }));
    setIsContextMenuOpen(false);
    setIsCriticalDialogOpen(true);
  };

  const handleCloseCriticalDialog = () => {
    setIsCriticalDialogOpen(false);
  };

  const fetchAndValidateWitsData = async (assetId, trace, startTime, endTime) => {
    const data = await fetchWitsData(
      SOURCE_TYPE.low,
      assetId,
      [{ traceName: trace }],
      startTime,
      endTime
    );
    return data?.length > 0;
  };

  const fetchAndValidateSensorData = async (record, startTime, endTime) => {
    const sensorId = record.data.sensor_id;
    const traceName = lowerFirst(record.data.trace.split(' | ')?.[0] ?? '');
    const sensorName = record.data.trace.split(' | ')?.[1] ?? '';
    const data = await fetchDownHoleSensorData(
      provider,
      SOURCE_TYPE.low,
      record.asset_id,
      [{ sensorId, sensorName, traceName }],
      sensorHeaderData,
      sensorTimeDiff,
      startTime,
      endTime
    );
    return data?.[0].length > 0;
  };

  const checkIfExistsOnMiddleWitsData = async (assetId, trace, timestamp) => {
    const witsDataRight = await fetchAndValidateWitsData(assetId, trace, timestamp, timestamp + 10);
    const witsDataLeft = await fetchAndValidateWitsData(assetId, trace, timestamp - 10, timestamp);
    return witsDataLeft && witsDataRight;
  };

  const checkIfExistsOnMiddleSensorData = async record => {
    const witsDataRight = await fetchAndValidateSensorData(
      record,
      record.data.timestamp,
      record.data.timestamp + 10
    );
    const witsDataLeft = await fetchAndValidateSensorData(
      record,
      record.data.timestamp - 10,
      record.data.timestamp
    );
    return witsDataLeft && witsDataRight;
  };

  const handleAddCriticalPoint = async record => {
    if (record.data.trace.includes(' | ')) {
      const validOnMiddle = await checkIfExistsOnMiddleSensorData(record);
      if (!validOnMiddle) {
        const sensorDataAround = await fetchAndValidateSensorData(
          record,
          record.data.timestamp - 1,
          record.data.timestamp + 1
        );
        if (sensorDataAround) await saveCriticalPoint(record);
        else showErrorNotification('There is no Sensor data on selected point.');
      } else {
        await saveCriticalPoint(record);
      }
    } else {
      const validOnMiddle = await checkIfExistsOnMiddleWitsData(
        record.asset_id,
        record.data.trace,
        record.data.timestamp
      );

      if (!validOnMiddle) {
        const witsDataAround = await fetchAndValidateWitsData(
          record.asset_id,
          record.data.trace,
          record.data.timestamp - 1,
          record.data.timestamp + 1
        );
        if (witsDataAround) await saveCriticalPoint(record);
        else showErrorNotification('There is no wits data on selected point.');
      } else {
        await saveCriticalPoint(record);
      }
    }
    handleCloseCriticalDialog();
  };

  return {
    showPoints,
    setShowPoints,
    isCriticalDialogOpen,
    handleClickCriticalPoint,
    handleAddCriticalPoint,
    handleCloseCriticalDialog,
  };
}
