import moment from 'moment';
import { max, maxBy, minBy, round, uniqBy } from 'lodash';
import * as eCharts from 'echarts';
import numeral from 'numeral';

import { getUnitDisplay } from '@corva/ui/utils';
import globalUtils from '@corva/ui/utils/main';
import { completion as completionConstants } from '@corva/ui/constants';
const { ACTIVITIES, PROPPANTS_CON_TYPES, PROPPANTS_MASS_TYPES } = completionConstants;

import {
  ABRA_COLLECTION,
  CATEGORIES,
  EVENT_ID_SEPARATOR,
  FLUSH_ACTIVITY,
  ISIPEvent,
  SERIES_TYPES,
  DEFAULT_DATE_FORMAT,
  PAD_ACTIVITY,
  TARGET_RAMP_ITEM,
} from '../constants';

const GRID_TOP_MARGIN = 8;
const GRID_OVERLAY_TOP_MARGIN = 0;
const GRID_BOTTOM_MARGIN = 22;

export const getPrimaryTextColor = (theme = {}) => (theme.isLightTheme ? '#000' : '#9E9E9E');

export const getAllSelectedParams = dataSetting => {
  return Object.entries(dataSetting).reduce((result, [, setting]) => {
    return [...result, ...setting];
  }, []);
};

const SERIES_ID_SEPARATOR = '--';

const getMainSeriesId = ({
  seriesName,
  unit,
  color,
  asset_id: assetId,
  asset_name: assetName,
  stage_number: stageNumber,
  is_offset: isOffset,
}) =>
  [assetId, assetName, stageNumber, seriesName, unit, color]
    .join(SERIES_ID_SEPARATOR)
    .concat(isOffset ? `${SERIES_ID_SEPARATOR}offset` : '');

const getEventSeriesId = ({
  seriesType,
  unit,
  color,
  eventName,
  asset_id: assetId,
  asset_name: assetName,
  stage_number: stageNumber,
  is_offset: isOffset,
}) => {
  const refId = getMainSeriesId({
    seriesName: seriesType.name,
    unit,
    color,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  });
  return [assetId, assetName, stageNumber, seriesType.name, eventName, seriesType.precision, refId]
    .join(EVENT_ID_SEPARATOR)
    .concat(isOffset ? `${EVENT_ID_SEPARATOR}offset` : '');
};

const getAxisIdBySeriesKey = (seriesKey, axisSettings) => {
  const axisSetting = axisSettings.find(
    setting =>
      setting.key !== 'trashChannels' &&
      setting.series.map(series => series.key).includes(seriesKey)
  );
  if (!axisSetting) return null;
  return axisSetting.key;
};

const getCategory = seriesKey => {
  return SERIES_TYPES.find(series => series.key === seriesKey)?.category;
};

export const getSelectedSeriesTypes = (allSeriesTypes, axisSetting, selectedParams) => {
  // ToDo: Need to filter old one BHPC_TYPE series
  // https://corvaqa.atlassian.net/browse/CMPL-1567
  return uniqBy(allSeriesTypes, 'key')
    .filter(series => {
      return selectedParams.includes(series.key) && getAxisIdBySeriesKey(series.key, axisSetting);
    })
    .map(series => ({
      ...series,
      axisId: getAxisIdBySeriesKey(series.key, axisSetting),
      category: getCategory(series.key),
    }));
};

export const getSeriesColor = (seriesType, isOffset = false) =>
  isOffset && seriesType.offsetColor ? seriesType.offsetColor : seriesType.color;

export const getYAxisOffset = (prevAxes, positionToAddNew) => {
  const startOffset = 0;
  const paddingBetweenAxis = 16;

  const axesInPosition = prevAxes.filter(axis => axis.position === positionToAddNew);

  return axesInPosition.reduce((totalOffset, axis) => {
    const { nameGap } = axis;

    return totalOffset + nameGap + paddingBetweenAxis;
  }, startOffset);
};

export const getXAxis = (viewMode, hideAxis, isLive, theme = {}) => {
  const isOverlayMode = viewMode === 'overlay';

  return {
    type: isOverlayMode ? 'value' : 'time',
    splitNumber: 2,
    axisLabel: {
      showMinLabel: !hideAxis,
      showMaxLabel: true,
      color: getPrimaryTextColor(theme),
      fontSize: 11,
      lineHeight: 18,
      formatter: value => {
        return isOverlayMode ? value : moment.unix(value).format(DEFAULT_DATE_FORMAT);
      },
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid',
        color: '#414141',
      },
    },
    position: 'bottom',
    min: value => round(value.min - 1, 0),
    max: value => {
      return isLive ? round(value.max + (value.max - value.min) / 5, 0) : round(value.max + 1, 0);
    },
  };
};

export const getYAxis = (scaleSetting, dataSetting, hideAxis, theme = {}) => {
  const yAxisDefault = {
    type: 'value',
    nameTextStyle: {
      color: getPrimaryTextColor(theme),
      fontSize: 14,
      lineHeight: -8,
    },
    nameLocation: 'center',
    axisTick: {
      show: false,
      lineStyle: {
        color: theme.isLightTheme ? '#000' : '#fff',
      },
    },
    axisLabel: {
      show: !hideAxis,
      color: getPrimaryTextColor(theme),
      formatter: value => numeral(value).format('0.0a'),
      fontSize: 11,
    },
    axisLine: {
      show: !hideAxis,
      lineStyle: {
        color: theme.isLightTheme ? '#000' : '#414141',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid',
        color: '#414141',
      },
    },
    min: 0,
  };

  const supportedChannels = getAllSelectedParams(dataSetting);

  const yAxes = [];

  scaleSetting
    .filter(setting => setting.key !== 'trashChannels')
    .forEach((setting, index) => {
      const position = index % 2 ? 'right' : 'left';
      const seriesArray = setting.series.find(item => supportedChannels.includes(item.key));
      if (!seriesArray) return;
      yAxes.push({
        ...yAxisDefault,
        name: `${setting.label} (${seriesArray.unitTo || getUnitDisplay(setting.unitType)})`,
        nameGap: 54,
        offset: getYAxisOffset(yAxes, position),
        position,
        id: setting.key,
        min: setting.min || 0,
        max: setting.max,
      });
    });

  yAxes.push({
    id: 'activityTimeline',
    name: 'Activity Timeline',
    show: false,
  });

  return yAxes;
};

export const getLegend = (selectedSeriesTypes, theme) => {
  const legendData = selectedSeriesTypes.map(seriesType => ({
    name: seriesType.name,
    icon: 'circle',
    color: getSeriesColor(seriesType),
  }));

  return {
    show: false,
    data: legendData,
    type: 'scroll',
    orient: 'horizontal',
    align: 'auto',
    bottom: 0,
    itemHeight: 10,
    itemWidth: 10,
    textStyle: {
      color: theme.isLightTheme ? '#000' : '#BDBDBD',
    },
    pageIconColor: '#03BCD4',
    pageIconInactiveColor: '#03BCD466',
  };
};

export const getGrid = (yAxes, hideAxis, isResponsive, viewMode) => {
  const isOverlayMode = viewMode === 'overlay';
  const leftAxes = yAxes.filter(yAxis => yAxis.position === 'left');
  const rightAxes = yAxes.filter(yAxis => yAxis.position === 'right');

  const gridLeftWithAxis = isResponsive ? 12 : 40;
  let gridLeft = hideAxis ? 10 : gridLeftWithAxis;
  let gridRight = isResponsive ? 30 : 35;

  if (leftAxes.length && !hideAxis) {
    const lastLeftAxis = leftAxes[leftAxes.length - 1];
    gridLeft = lastLeftAxis.offset + lastLeftAxis.nameGap + 20;
  }

  if (rightAxes.length && !hideAxis) {
    const lastRightAxis = rightAxes[rightAxes.length - 1];
    gridRight = lastRightAxis.offset + lastRightAxis.nameGap + 20;
  }

  return {
    left: gridLeft,
    right: gridRight,
    bottom: GRID_BOTTOM_MARGIN,
    top: isOverlayMode ? GRID_OVERLAY_TOP_MARGIN : GRID_TOP_MARGIN,
    containLabel: false,
    show: true,
    borderWidth: 0,
    borderColor: '#414141',
    hideAxis,
  };
};

export const getDataZoom = zoom => [
  {
    type: 'inside',
    filterMode: 'weakFilter',
    zoomOnMouseWheel: false,
    moveOnMouseMove: false,
    moveOnMouseWheel: false,
    zoomLock: true, // we need zoomLock to prevent page scroll capturing https://github.com/apache/echarts/issues/10079
    preventDefaultMouseMove: false,
    ...(zoom || {}),
  },
];

export const getToolbox = () => {
  return {
    right: '10000px', // Hide it on the plot
    top: 20,
    itemSize: 25,
    showTitle: false,
    z: 1000,
    feature: {
      dataZoom: {
        filterMode: 'weakFilter',
        icon: null,
        title: {
          zoom: 'Zoom',
          back: 'Restore',
        },
        yAxisIndex: 'none',
        brushStyle: {
          color: `#63EFFF`,
          opacity: 0.1,
        },
      },
    },
    iconStyle: {
      normal: {
        borderColor: '#aaa',
      },
      emphasis: {
        borderColor: '#fff',
      },
    },
  };
};

export function makeMainSeries(
  assetId,
  assetName,
  stageNumber,
  id,
  name,
  yAxisIndex,
  data,
  color,
  misc,
  refTimestamp,
  config = {}
) {
  return {
    assetId,
    assetName,
    stageNumber,
    id,
    category: 'main',
    color,
    refTimestamp,
    type: 'line',
    name,
    data,
    yAxisIndex,
    itemStyle: {
      normal: {
        color: color && globalUtils.hexToRgbA(color, misc.alpha),
      },
    },
    lineStyle: {
      normal: {
        type: misc.lineStyle,
        width: misc.lineWidth,
      },
      emphasis: {
        type: misc.lineStyle,
        width: misc.lineWidth,
      },
    },
    smooth: false,
    showSymbol: false,
    ...config,
  };
}

function makeEventSeries(
  assetId,
  assetName,
  stageNumber,
  id,
  name,
  yAxisIndex,
  data,
  label,
  color
) {
  return {
    assetId,
    assetName,
    stageNumber,
    id,
    category: 'event',
    name,
    type: 'scatter',
    symbolSize: 16,
    yAxisIndex,
    data,
    tooltip: {
      trigger: 'item',
    },
    itemStyle: {
      normal: {
        color,
        borderWidth: 0,
        borderColor: 'transparent',
        shadowColor: color,
        shadowBlur: 10,
        opacity: 1,
        label: {
          color: '#fff',
          fontFamily: 'Roboto',
          fontWeight: 500,
          fontSize: 11,
          lineHeight: 16,
          offset: [0, 1],
          show: true,
          position: 'inside',
          formatter: () => label,
        },
      },
    },
    zlevel: 10,
  };
}

export const getBreakdownEvents = (stageData, selectedSeriesTypes, yAxes, refTimestamp) => {
  const {
    predictions,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const seriesKey = 'wellhead_pressure';
  const seriesType = selectedSeriesTypes.find(item => item.key === seriesKey);

  if (!seriesType) {
    return [];
  }

  const data = (predictions.breakdown || []).map(breakdownItem => {
    const dataPoint = [
      refTimestamp ? (breakdownItem.timestamp - refTimestamp) / 60 : breakdownItem.timestamp,
      breakdownItem[seriesKey],
    ];
    return dataPoint;
  });

  const color =
    getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;

  const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
  const id = getEventSeriesId({ seriesType, unit, color, eventName: 'Breakdown', ...stageData });

  const series = makeEventSeries(
    assetId,
    assetName,
    stageNumber,
    id,
    seriesType.name,
    yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
    data,
    'B',
    color
  );

  return [series];
};

export const getIsipEvents = (stageData, selectedSeriesTypes, yAxes, refTimestamp) => {
  const {
    predictions,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const seriesKey = 'wellhead_pressure';
  const seriesType = selectedSeriesTypes.find(item => item.key === seriesKey);

  if (!seriesType) {
    return [];
  }

  const data = (predictions.isip || []).map(isipItem => {
    const dataPoint = [
      refTimestamp ? (isipItem.timestamp - refTimestamp) / 60 : isipItem.timestamp,
      isipItem[seriesKey],
    ];
    return dataPoint;
  });

  const color =
    getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;

  const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
  const id = getEventSeriesId({ seriesType, unit, color, eventName: 'ISIP', ...stageData });

  const series = makeEventSeries(
    assetId,
    assetName,
    stageNumber,
    id,
    seriesType.name,
    yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
    data,
    'I',
    color
  );

  return [series];
};

export const getOpenWellheadPressureEvents = (
  stageData,
  selectedSeriesTypes,
  yAxes,
  refTimestamp
) => {
  const {
    predictions,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const seriesKey = 'wellhead_pressure';
  const seriesType = selectedSeriesTypes.find(item => item.key === seriesKey);

  if (!seriesType) {
    return [];
  }

  const data = (predictions.opening_wellhead_pressure || []).map(owhpItem => {
    const dataPoint = [
      refTimestamp ? (owhpItem.timestamp - refTimestamp) / 60 : owhpItem.timestamp,
      owhpItem[seriesKey],
    ];
    return dataPoint;
  });

  const color =
    getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;

  const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
  const id = getEventSeriesId({
    seriesType,
    unit,
    color,
    eventName: 'Opening Wellhead Pressure',
    ...stageData,
  });

  const series = makeEventSeries(
    assetId,
    assetName,
    stageNumber,
    id,
    seriesType.name,
    yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
    data,
    'O',
    '#7DC900'
  );

  return [series];
};

export const getPumpingEvents = (stageData, selectedSeriesTypes, yAxes, refTimestamp) => {
  const {
    predictions,
    wits,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const rateSeriesTypes = selectedSeriesTypes.filter(item => item.category === 'rate');

  const timestampToFind = predictions.main_pumping_start_timestamp;

  if (!rateSeriesTypes.length || !timestampToFind) {
    return [];
  }

  const targetWit = minBy(wits, item => Math.abs(timestampToFind - item.timestamp));

  const series = rateSeriesTypes.map(seriesType => {
    const data = [
      [
        refTimestamp ? (targetWit.timestamp - refTimestamp) / 60 : targetWit.timestamp,
        targetWit[seriesType.key],
      ],
    ];

    const color =
      getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;

    const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
    const id = getEventSeriesId({ seriesType, unit, color, eventName: 'Rate Start', ...stageData });

    return makeEventSeries(
      assetId,
      assetName,
      stageNumber,
      id,
      seriesType.name,
      yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
      data,
      'R',
      color
    );
  });

  return series;
};

export const getRampEvents = (stageData, selectedSeriesTypes, yAxes, refTimestamp) => {
  const {
    predictions,
    wits,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
  } = stageData;

  const rateSeriesTypes = selectedSeriesTypes.filter(item => item.category === 'rate');

  const originalData = predictions.target_ramp_rate?.[0];
  const timestampToFind = originalData?.timestamp;

  if (!rateSeriesTypes.length || !timestampToFind) {
    return [];
  }

  const targetWit = minBy(wits, item => Math.abs(timestampToFind - item.timestamp));

  const series = rateSeriesTypes.map(seriesType => {
    const data = [
      [
        refTimestamp ? (targetWit.timestamp - refTimestamp) / 60 : targetWit.timestamp,
        targetWit[seriesType.key],
        [['Wellhead Pressure', originalData.wellhead_pressure]],
      ],
    ];

    const color = TARGET_RAMP_ITEM.color;

    const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
    const id = getEventSeriesId({
      seriesType,
      unit,
      color: TARGET_RAMP_ITEM.color,
      eventName: TARGET_RAMP_ITEM.tooltipName,
      ...stageData,
    });

    return makeEventSeries(
      assetId,
      assetName,
      stageNumber,
      id,
      seriesType.name,
      yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
      data,
      'T',
      color
    );
  });

  return series;
};

export const getProppantInjectionEvents = (stageData, selectedSeriesTypes, yAxes, refTimestamp) => {
  const {
    predictions,
    wits,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;
  const [proppantConc] = PROPPANTS_CON_TYPES;
  const [proppantMass] = PROPPANTS_MASS_TYPES;
  const allowedSeries = [proppantConc.key, proppantMass.key];

  let proppantSeriesTypes = selectedSeriesTypes.filter(({ key }) => allowedSeries.includes(key));

  if (proppantSeriesTypes.length === allowedSeries.length) {
    proppantSeriesTypes = proppantSeriesTypes.filter(({ key }) => key === proppantConc.key);
  }

  const timestampToFind = predictions.proppant_injection_start_timestamp;

  if (!proppantSeriesTypes.length || !timestampToFind) {
    return [];
  }

  const targetWit = minBy(wits, item => Math.abs(timestampToFind - item.timestamp));

  const series = proppantSeriesTypes.map(seriesType => {
    const data = [
      [
        refTimestamp ? (targetWit.timestamp - refTimestamp) / 60 : targetWit.timestamp,
        targetWit[seriesType.key],
      ],
    ];

    const color =
      getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;

    const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
    const id = getEventSeriesId({
      seriesType,
      unit,
      color,
      eventName: 'Proppant Injection',
      ...stageData,
    });

    return makeEventSeries(
      assetId,
      assetName,
      stageNumber,
      id,
      seriesType.name,
      yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId),
      data,
      'P',
      color
    );
  });

  return series;
};

export const getStageEventsSeries = (
  stageData,
  selectedSeriesTypes,
  isRampEnabled,
  yAxes,
  refTimestamp
) => {
  if (!stageData.predictions) {
    return [];
  }

  const breakdownEventsSeries = getBreakdownEvents(
    stageData,
    selectedSeriesTypes,
    yAxes,
    refTimestamp
  );
  const isipEventsSeries = getIsipEvents(stageData, selectedSeriesTypes, yAxes, refTimestamp);
  const openWellheadPressureEventsSeries = getOpenWellheadPressureEvents(
    stageData,
    selectedSeriesTypes,
    yAxes,
    refTimestamp
  );
  const pumpingEventsSeries = getPumpingEvents(stageData, selectedSeriesTypes, yAxes, refTimestamp);
  const proppantEventsSeries = getProppantInjectionEvents(
    stageData,
    selectedSeriesTypes,
    yAxes,
    refTimestamp
  );

  const rampEventSeries = isRampEnabled
    ? getRampEvents(stageData, selectedSeriesTypes, yAxes, refTimestamp)
    : [];

  return [
    ...breakdownEventsSeries,
    ...isipEventsSeries,
    ...openWellheadPressureEventsSeries,
    ...pumpingEventsSeries,
    ...proppantEventsSeries,
    ...rampEventSeries,
  ];
};

function getTimelineSeries(stageData, filteredActivities, isRampEnabled, yAxes) {
  const timelineHeight = 8;
  const data = [];

  filteredActivities.forEach(activityItem => {
    data.push({
      name: activityItem.activity,
      value: [0, activityItem.start, activityItem.end, activityItem.duration],
      itemStyle: {
        normal: {
          color: activityItem.color,
        },
      },
    });
  });

  const padActivity = filteredActivities.find(activity => activity.activity === PAD_ACTIVITY);
  const targetRampTimestamp = stageData?.predictions?.target_ramp_rate?.[0]?.timestamp;

  // custom target ramp rate overlay, as target ramp rate is not actually an activity here
  if (isRampEnabled && targetRampTimestamp && padActivity) {
    const duration = targetRampTimestamp - padActivity.start;
    data.push({
      name: TARGET_RAMP_ITEM.name,
      value: [0, padActivity.start, targetRampTimestamp, duration],
      itemStyle: {
        normal: {
          color: TARGET_RAMP_ITEM.background,
          border: 1,
          borderColor: TARGET_RAMP_ITEM.color,
        },
      },
    });
  }

  if (!data.length) {
    return [];
  }

  return [
    {
      assetId: stageData.asset_id,
      stageNumber: stageData.stage_number,
      category: CATEGORIES.timeline,
      id: `${stageData.asset_id}-${stageData.stage_number}-${CATEGORIES.timeline}${
        stageData.is_offset ? '-offset' : ''
      }`,
      type: 'custom',
      renderItem: function renderItem(params, api) {
        const start = api.coord([api.value(1)]);
        const end = api.coord([api.value(2)]);
        const { height } = params.coordSys;

        const rectShape = eCharts.graphic.clipRectByRect(
          {
            x: start[0],
            y: height + GRID_TOP_MARGIN,
            width: end[0] - start[0],
            height: timelineHeight,
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: height + GRID_TOP_MARGIN + timelineHeight,
          }
        );

        return (
          rectShape && {
            type: 'rect',
            shape: { ...rectShape, r: [3] },
            style: api.style(),
          }
        );
      },
      encode: {
        x: [1, 2],
        y: 0,
      },
      yAxisIndex: yAxes.length - 1,
      data,
      tooltip: {
        show: true,
        trigger: 'item',
        confine: true,
        transitionDuration: 0,
        backgroundColor: 'rgba(59, 59, 59, 0.9)',
        borderRadius: 4,
        padding: 5,
        textStyle: {
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 500,
          lineHeight: 16,
        },
        position: pos => {
          return { left: pos[0], bottom: 30 };
        },
        formatter: param => {
          return param?.data?.name;
        },
        extraCssText: 'box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12); z-index: 1',
      },
    },
  ];
}

function getFilteredStageData(wits, activities, disabledActivityNames) {
  let filteredWits = wits;
  const filteredActivities = [];

  activities.forEach(activityItem => {
    const isActivityDisabled = disabledActivityNames.includes(activityItem.activity);
    if (!isActivityDisabled) {
      const activityMeta = ACTIVITIES.find(meta => meta.name === activityItem.activity);
      if (activityMeta) {
        filteredActivities.push({
          ...activityItem,
          color: activityMeta.color,
        });
      }
    } else {
      filteredWits = filteredWits.filter(
        witItem => witItem.timestamp <= activityItem.start || witItem.timestamp >= activityItem.end
      );
    }
  });

  return {
    filteredWits,
    filteredActivities,
  };
}

function getStageStats(assetId, stageNumber, filteredWits, refTimestamp) {
  const stats = {
    asset_id: assetId,
    stage_number: stageNumber,
    data: [],
    aggregation: {
      wellhead_pressure: 0,
      slurry_flow_rate_in: 0,
    },
  };

  filteredWits.forEach(witItem => {
    const { aggregation, data } = stats;

    const timestamp = refTimestamp ? (witItem.timestamp - refTimestamp) / 60 : witItem.timestamp;

    const item = {
      timestamp,
      wellhead_pressure: witItem.wellhead_pressure,
      slurry_flow_rate_in: witItem.slurry_flow_rate_in,
    };

    aggregation.wellhead_pressure += item.wellhead_pressure;
    aggregation.slurry_flow_rate_in += item.slurry_flow_rate_in;

    data.push(item);
  });

  return stats;
}

// Note: skipProcessing flag is used to skip some expensive calculations in live mode.
// This functions returns the newly updated series only in live mode by using this flag
export const getStageContinuousSeries = (
  stageData,
  selectedSeriesTypes,
  yAxes,
  disabledActivities,
  skipProcessing = []
) => {
  const {
    wits,
    activities,
    misc,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const isRampEnabled = disabledActivities.includes(TARGET_RAMP_ITEM.name); // on the contrast to other activities, ramp is disabled by default

  const { filteredWits, filteredActivities } = getFilteredStageData(
    wits,
    activities,
    disabledActivities
  );

  const dataGroupedBySeries = selectedSeriesTypes.reduce((result, seriesType) => {
    const seriesKey = seriesType.key;
    const subResult = filteredWits.map(witItem => {
      const newDataPoint = [witItem.timestamp, witItem[seriesKey]];
      return newDataPoint;
    });

    return {
      ...result,
      [seriesKey]: subResult,
    };
  }, {});

  const fixedMisc = {
    ...misc,
    alpha: 1,
  };

  const mainSeries = selectedSeriesTypes.reduce((result, seriesType) => {
    if (seriesType.collection === ABRA_COLLECTION) {
      return result;
    }

    const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
    const color =
      getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;
    const yAxisIndex = yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId);
    const id = getMainSeriesId({ seriesName: seriesType.name, unit, color, ...stageData });

    const series = makeMainSeries(
      assetId,
      assetName,
      stageNumber,
      id,
      seriesType.name,
      yAxisIndex,
      dataGroupedBySeries[seriesType.key],
      color,
      fixedMisc,
      0
    );

    return [...result, series];
  }, []);

  const stats = !skipProcessing.includes('stats')
    ? getStageStats(assetId, stageNumber, filteredWits)
    : null;

  const eventsSeries = !skipProcessing.includes('events')
    ? getStageEventsSeries(stageData, selectedSeriesTypes, isRampEnabled, yAxes)
    : [];

  const timelineSeries =
    !skipProcessing.includes('timeline') && filteredActivities.length
      ? getTimelineSeries(stageData, filteredActivities, isRampEnabled, yAxes)
      : [];

  return {
    mainSeries,
    eventsSeries,
    timelineSeries,
    stats,
  };
};

export const getContinuousSeries = (selectedSeriesTypes, data, yAxes, disabledActivities) => {
  return data.reduce(
    (result, stageData) => {
      const { mainSeries, stats, eventsSeries, timelineSeries } = getStageContinuousSeries(
        stageData,
        selectedSeriesTypes,
        yAxes,
        disabledActivities
      );

      return {
        mainSeries: [...result.mainSeries, ...mainSeries],
        eventsSeries: [...result.eventsSeries, ...eventsSeries],
        timelineSeries: [...result.timelineSeries, ...timelineSeries],
        stats: [...result.stats, stats],
      };
    },
    {
      mainSeries: [],
      eventsSeries: [],
      timelineSeries: [],
      stats: [],
    }
  );
};

export const getRefTimestamp = (wits, predictions, refPointKey) => {
  if (predictions && predictions[refPointKey]) {
    const refPointVal = predictions[refPointKey];

    if (Number.isFinite(refPointVal)) {
      return refPointVal;
    } else if (refPointVal && refPointVal.length) {
      return refPointVal[refPointVal.length - 1].timestamp;
    }
  }

  return wits[0].timestamp;
};

export const getStageOverlaySeries = (
  stageData,
  selectedSeriesTypes,
  yAxes,
  disabledActivities,
  refPointKey,
  skipProcessing = []
) => {
  const {
    wits,
    predictions,
    activities,
    misc,
    asset_id: assetId,
    asset_name: assetName,
    stage_number: stageNumber,
    is_offset: isOffset,
  } = stageData;

  const { filteredWits } = getFilteredStageData(wits, activities, disabledActivities);

  const refTimestamp = getRefTimestamp(filteredWits, predictions, refPointKey);

  const dataGroupedBySeries = selectedSeriesTypes.reduce((result, seriesType) => {
    const seriesKey = seriesType.key;
    const subResult = wits.map(witItem => {
      const timeDiff = (witItem.timestamp - refTimestamp) / 60;
      const newDataPoint = [timeDiff, witItem[seriesKey]];
      return newDataPoint;
    });

    return {
      ...result,
      [seriesKey]: subResult,
    };
  }, {});

  const mainSeries = selectedSeriesTypes.reduce((result, seriesType) => {
    const unit = seriesType.unitTo || getUnitDisplay(seriesType.unitType);
    const color =
      getSeriesColor(seriesType, isOffset) || `#${globalUtils.getColorFromString(seriesType.name)}`;
    const yAxisIndex = yAxes.findIndex(yAxis => yAxis.id === seriesType.axisId);
    const id = getMainSeriesId({ seriesName: seriesType.name, unit, color, ...stageData });

    const series = makeMainSeries(
      assetId,
      assetName,
      stageNumber,
      id,
      seriesType.name,
      yAxisIndex,
      dataGroupedBySeries[seriesType.key],
      color,
      misc,
      refTimestamp
    );

    return [...result, series];
  }, []);

  const stats = !skipProcessing.includes('stats')
    ? getStageStats(assetId, stageNumber, filteredWits, refTimestamp)
    : null;

  const eventsSeries = !skipProcessing.includes('events')
    ? getStageEventsSeries(stageData, selectedSeriesTypes, false, yAxes, refTimestamp)
    : [];

  return {
    mainSeries,
    eventsSeries,
    timelineSeries: [],
    stats,
    refTimestamp,
  };
};

export const getOverlaySeries = (
  selectedSeriesTypes,
  data,
  yAxes,
  disabledActivities,
  refPointKey
) => {
  return data.reduce(
    (result, stageData) => {
      const { mainSeries, eventsSeries, stats, refTimestamp } = getStageOverlaySeries(
        stageData,
        selectedSeriesTypes,
        yAxes,
        disabledActivities,
        refPointKey
      );

      return {
        mainSeries: [...result.mainSeries, ...mainSeries],
        eventsSeries: [...result.eventsSeries, ...eventsSeries],
        timelineSeries: [],
        stats: [...result.stats, stats],
        refTimestamps: [...result.refTimestamps, refTimestamp],
      };
    },
    {
      mainSeries: [],
      eventsSeries: [],
      timelineSeries: [],
      stats: [],
      refTimestamps: [],
    }
  );
};

export const getAbraSeries = (abraData, selectedSeriesTypes, yAxis) => {
  if (!abraData?.length) {
    return [];
  }

  const series = selectedSeriesTypes.filter(type => type.collection === ABRA_COLLECTION);
  const axisIndex = yAxis.findIndex(yAxis => yAxis.id === 'offsetPressure');

  if (axisIndex === -1) {
    return [];
  }

  return series
    .map(type => {
      const dataItem = abraData.find(({ key }) => key === type.key);
      if (!dataItem) {
        return;
      }
      const { data = [], assetId, name, key } = dataItem;
      const { unitType, unitTo, color } = type;

      const id = getMainSeriesId({
        seriesName: key,
        unit: unitTo || getUnitDisplay(unitType),
        color,
        asset_id: assetId,
        asset_name: name,
        stage_number: 0,
        is_offset: false,
      });

      return makeMainSeries(
        assetId,
        name,
        0,
        id,
        `${ABRA_COLLECTION} ${name}`.toUpperCase(),
        axisIndex,
        data.map(item => {
          return [item.timestamp, item.pressure];
        }) || [],
        type.color,
        {},
        data?.[0]?.timestamp
      );
    })
    .filter(Boolean);
};

export const getModeSeries = (
  selectedSeriesTypes,
  data,
  yAxes,
  disabledActivities,
  refPointKey,
  viewMode
) => {
  return viewMode === 'overlay'
    ? getOverlaySeries(selectedSeriesTypes, data, yAxes, disabledActivities, refPointKey)
    : getContinuousSeries(selectedSeriesTypes, data, yAxes, disabledActivities);
};

const getPressureGoalSeries = (goal, yAxisIndex) => {
  const { min, max, color, name } = goal;
  if (yAxisIndex === -1) {
    return null;
  }

  const markLine = {
    silent: true,
    symbol: 'none',
  };

  const markLineDataOption = {
    lineStyle: {
      normal: {
        width: 1,
        color,
      },
    },
  };

  const labelOptions = {
    position: 'insideStartTop',
    show: true,
    fontSize: 10,
    color,
    distance: [1, 0],
    padding: [2, 4, 2, 4],
    backgroundColor: 'rgba(39, 39, 39, 0.50)',
  };

  const markLineData = [];
  if (min) {
    markLineData.push({
      yAxis: min,
      label: {
        ...labelOptions,
        formatter: `Min ${name}`,
      },
      ...markLineDataOption,
    });
  }
  if (max) {
    markLineData.push({
      yAxis: max,
      label: {
        ...labelOptions,
        formatter: `Max ${name}`,
      },
      ...markLineDataOption,
    });
  }

  markLine.data = markLineData;

  const markArea =
    min && max
      ? {
          silent: true,
          itemStyle: {
            normal: {
              color,
              opacity: 0.06,
            },
          },
          data: [
            [
              {
                yAxis: max,
              },
              {
                yAxis: min,
              },
            ],
          ],
        }
      : {};

  return {
    id: `goals_${name}`,
    name: `Goal ${name} Window`,
    type: 'line',
    itemStyle: {
      normal: {
        color,
      },
    },
    yAxisIndex,
    markLine,
    markArea,
  };
};

// Note: This utility was optimized for live subscription data
export const getNewStageSeries = (
  selectedSeriesTypes,
  stageData,
  skipProcessing,
  yAxes,
  disabledActivities,
  refPointKey,
  viewMode
) => {
  return viewMode === 'overlay'
    ? getStageOverlaySeries(
        stageData,
        selectedSeriesTypes,
        yAxes,
        disabledActivities,
        refPointKey,
        skipProcessing
      )
    : getStageContinuousSeries(
        stageData,
        selectedSeriesTypes,
        yAxes,
        disabledActivities,
        skipProcessing
      );
};

// Note: There will be more goal series in the future
export const getGoalSeries = (goals, yAxes) => {
  const goalSeries = [];

  goals.forEach(goal => {
    const axisIndex = yAxes.findIndex(yAxisItem => yAxisItem.id === goal.axis);

    const current = getPressureGoalSeries(goal, axisIndex);
    if (current) {
      goalSeries.push(current);
    }
  });

  return goalSeries;
};

export const getPredictionKeyByEventName = eventName => {
  switch (eventName) {
    case 'Breakdown':
      return 'breakdown';
    case 'ISIP':
      return 'isip';
    case 'Opening Wellhead Pressure':
      return 'opening_wellhead_pressure';
    case 'Rate Start':
      return 'main_pumping_start_timestamp';
    case 'Proppant Injection':
      return 'proppant_injection_start_timestamp';
    case 'Target Ramp Rate':
      return 'target_ramp_rate';
    default:
      return '';
  }
};

export const getOverallStats = (stats, zoom, viewMode) => {
  const allAggregation = {
    wellhead_pressure: 0,
    slurry_flow_rate_in: 0,
    elapsed_time: 0,
    data_count: 0,
    stage_count: 0,
  };

  if (!stats) {
    return allAggregation;
  }

  for (let i = 0; i < stats.length; i += 1) {
    const { data, aggregation } = stats[i];
    if (!zoom) {
      allAggregation.wellhead_pressure += aggregation.wellhead_pressure;
      allAggregation.slurry_flow_rate_in += aggregation.slurry_flow_rate_in;
      allAggregation.elapsed_time += data.length
        ? data[data.length - 1].timestamp - data[0].timestamp
        : 0;
      allAggregation.data_count += data.length || 0;
      allAggregation.stage_count += 1;
    } else if (
      data.length &&
      (data[0].timestamp <= zoom.endValue || data[data.length - 1] >= zoom.startValue)
    ) {
      const filteredData = [];
      for (let j = 0; j < data.length; j += 1) {
        const dataItem = data[j];
        if (dataItem.timestamp >= zoom.startValue && dataItem.timestamp <= zoom.endValue) {
          filteredData.push(dataItem);
          allAggregation.wellhead_pressure += dataItem.wellhead_pressure;
          allAggregation.slurry_flow_rate_in += dataItem.slurry_flow_rate_in;
          allAggregation.data_count += 1;
        } else if (dataItem.timestamp > zoom.endValue) {
          break;
        }
      }

      if (filteredData.length) {
        allAggregation.elapsed_time +=
          filteredData[filteredData.length - 1].timestamp - filteredData[0].timestamp;
        allAggregation.stage_count += 1;
      }
    }
  }

  const areaPressure = allAggregation.wellhead_pressure / allAggregation.data_count;
  const areaRate = allAggregation.slurry_flow_rate_in / allAggregation.data_count;
  let areaElapsedTime;

  if (viewMode === 'overlay') {
    areaElapsedTime = allAggregation.elapsed_time / allAggregation.stage_count;
  } else {
    areaElapsedTime = allAggregation.elapsed_time / 60;
  }

  return {
    area_wellhead_pressure: areaPressure,
    area_slurry_flow_rate_in: areaRate,
    area_elapsed_time: areaElapsedTime,
  };
};

export const chartTimeRange = (zoom, isLive, dataRange) => {
  if (zoom)
    return {
      startTimestamp: Math.round(zoom.startValue),
      endTimestamp: Math.round(zoom.endValue),
    };

  const [rangeStart, rangeEnd] = dataRange;

  if (isLive)
    return {
      startTimestamp: rangeStart,
      endTimestamp: Math.round(rangeEnd + (rangeEnd - rangeStart) / 5),
    };

  return {
    startTimestamp: rangeStart,
    endTimestamp: rangeEnd,
  };
};

// Note: ISIPs and 2 Flushes exist. In Event Editor, both can be moved. The scope of this ticket is to:
// - Only allow the FINAL ISIP to be moved
// - FINAL ISIP cannot be before any other ISIP
// - FINAL ISIP cannot be before the FINAL flush activity in activity summary
export const getMinISIPFromChartOptions = (targetItem, instance) => {
  const timelineSeries = instance
    .getOption()
    .series.find(seriesItem => seriesItem.category === CATEGORIES.timeline);
  const flushData = timelineSeries.data.filter(dataItem => dataItem.name === FLUSH_ACTIVITY);
  const finalFlushActivity = maxBy(flushData, item => item.value[2]);
  const flushDataEndTimestamp = finalFlushActivity.value[2];

  const { id, data } = targetItem;
  const meta = id.split(EVENT_ID_SEPARATOR);
  let minFinalISIP = 0;
  if (meta[4] === ISIPEvent.name && data.length > 1) {
    minFinalISIP = data[0][0];
  }

  return minFinalISIP === 0 ? null : max([minFinalISIP, flushDataEndTimestamp]);
};
