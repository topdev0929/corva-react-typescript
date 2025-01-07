import { useState, useEffect } from 'react';

import { getAppViewStorageSettings } from '@corva/ui/clients/clientStorage';

import * as chartUtils from '../utils/eChartUtils';

export function useChartOptions({
  settingAssetKey,
  appId,
  activitySetting,
  goals,
  mainData,
  hideAxis,
  isCompactMode,
  isLive,
  theme,
  appFilterSetting,
  appScaleSetting,
  appDataSetting,
  zoom,
  abraData,
}) {
  const [chartConfigs, setChartConfigs] = useState({
    selectedParams: null,
    xAxis: null,
    grid: null,
    legend: null,
    series: null,
    toolbox: null,
    dataZoom: null,
    yAxis: null,
    stats: null,
    refTimestamps: null,
    statsData: null,
  });
  useEffect(() => {
    const { viewMode, refPoint } = appFilterSetting;

    const selectedParams = chartUtils.getAllSelectedParams(appDataSetting);

    const allSeriesTypes = appScaleSetting.reduce((result, setting) => {
      return [...result, ...setting.series];
    }, []);

    const xAxis = chartUtils.getXAxis(viewMode, hideAxis, isLive);

    const yAxis = chartUtils.getYAxis(appScaleSetting, appDataSetting, hideAxis);

    const grid = chartUtils.getGrid(yAxis, hideAxis, isCompactMode);

    const toolbox = chartUtils.getToolbox();

    const dataZoom = chartUtils.getDataZoom(zoom || {});

    const selectedSeriesTypes = chartUtils.getSelectedSeriesTypes(
      allSeriesTypes,
      appScaleSetting,
      selectedParams
    );

    let legend = chartUtils.getLegend(selectedSeriesTypes, theme);
    legend = {
      ...legend,
      ...(getAppViewStorageSettings(settingAssetKey)
        ? { selected: getAppViewStorageSettings(settingAssetKey) }
        : {}),
    };

    const modeSeries = chartUtils.getModeSeries(
      selectedSeriesTypes,
      mainData,
      yAxis,
      activitySetting,
      refPoint,
      viewMode
    );

    const abraSeries = chartUtils.getAbraSeries(abraData, selectedSeriesTypes, yAxis);

    const { stats, mainSeries, eventsSeries, timelineSeries, refTimestamps } = modeSeries;
    const goalSeries = chartUtils.getGoalSeries(goals, yAxis);

    const series = mainSeries
      .concat(goalSeries)
      .concat(abraSeries)
      .concat(eventsSeries)
      .concat(timelineSeries)
      .map(seriesItem => ({ ...seriesItem, hasUpdate: true }));

    const statsData = chartUtils.getOverallStats(stats, zoom, appFilterSetting.viewMode);

    setChartConfigs({
      selectedParams,
      xAxis,
      grid,
      legend,
      series,
      toolbox,
      dataZoom,
      yAxis,
      stats,
      refTimestamps,
      statsData,
    });
  }, [
    appDataSetting,
    appScaleSetting,
    appFilterSetting,
    hideAxis,
    activitySetting,
    appId,
    goals,
    isLive,
    mainData,
    zoom,
    theme,
    abraData,
  ]);

  return [chartConfigs, setChartConfigs];
}
