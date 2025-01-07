import { get, startCase, inRange } from 'lodash';
import moment from 'moment';
import { DATASET } from '~/constants';

const getMinMaxValue = (value, range, isMin = true) => {
  if (!value) return null;

  let divider = Math.ceil(range / 4);
  const len = divider.toString().length - 1;
  // eslint-disable-next-line no-restricted-properties
  divider = Math.ceil(divider / Math.pow(10, len)) * Math.pow(10, len);

  let convertedValue;
  if (isMin) {
    convertedValue = Math.floor(value / divider) * divider;
    convertedValue = Math.floor(convertedValue / 4) * 4;
  } else {
    convertedValue = Math.ceil(value / divider) * divider;
    convertedValue = Math.ceil(convertedValue / 4) * 4;
  }
  return convertedValue;
};

const getSeries = (mainData, channels, invisibleLegends) => {
  const witsSeries = [];
  mainData.forEach((stageData, idx) => {
    const { assetId, wellName, opacity, wits, range, refTimeDiff } = stageData;
    const traceSeries = channels.map(channel => {
      const { displayName, traceName, sensorName, sensorId } = channel;
      let name = sensorName ? `${startCase(traceName)} | ${sensorName}` : startCase(traceName);
      name = displayName || name;
      const legendKey = sensorName ? `${sensorName}_${traceName}` : traceName;
      return {
        id: `${channel.traceName}__${wellName}__${idx}`,
        sensorId,
        name,
        type: 'line',
        visible: !invisibleLegends.includes(legendKey),
        dashStyle: channel.lineStyle ?? 'Solid',
        color: channel.color,
        yAxis: channel.yAxisIndex,
        lineWidth: channel.lineWidth ?? 1,
        opacity,
        marker: {
          enabled: false,
          symbol: 'circle',
          fill: channel.color,
        },
        turboThreshold: 10000,
        custom: {
          assetId,
          wellName,
          unit: channel.unit,
          traceName,
          sensorName,
          range: range ?? [-Infinity, Infinity],
          refTimeDiff: refTimeDiff ?? 0,
        },
        connectNulls: true,
        data: [],
      };
    });

    wits.forEach(record => {
      channels.forEach(channel => {
        let name;
        if (channel.sensorId && record.data.sensorId === channel.sensorId) {
          name = `${startCase(channel.traceName)} | ${channel.sensorName}`;
        } else {
          name = startCase(channel.traceName);
        }
        name = channel.displayName || name;
        const seriesIndex = traceSeries.findIndex(item => item.name === name);
        if (
          seriesIndex !== -1 &&
          (!traceSeries[seriesIndex]?.sensorId ||
            traceSeries[seriesIndex].sensorId === record.data.sensorId)
        ) {
          traceSeries[seriesIndex].data.push([
            record.timestamp,
            Number(get(record, ['data', channel.traceName])),
          ]);
        }
      });
    });

    witsSeries.push(...traceSeries);
  });

  return witsSeries;
};

function tooltipFormatter(isOverlay, timeUnit, setActiveSensorId) {
  setActiveSensorId(this.points?.[0]?.point?.series?.userOptions?.sensorId);

  const formattedPoints = this.points?.reduce((result, point) => {
    const { y, series, color } = point.point;
    const { custom } = series?.userOptions ?? {};

    if (!Number.isFinite(y)) return result;
    if (custom) {
      return String.raw`${result}
        <div style="padding: 1px 0;">
          <svg height="8" width="8"><circle cx="4" cy="4" r="4" fill="${color}" /></svg> 
          ${series.name} ${custom.unit ? `(${custom.unit})` : ''}
        </div>
        <div style="padding: 1px 0;">(${custom.wellName}) : ${y.toFixed(2)}</div>
      `;
    } else {
      return '';
    }
  }, '');

  return `<div>
    <div style="padding: 1px 0;">${
      !isOverlay ? moment.unix(this.x).format('MM/DD/YYYY HH:mm:ss') : Math.round(this.x * timeUnit)
    }</div>
    <div style="padding: 1px 0;">${formattedPoints}</div>
  </div>`;
}

export const getChartOptions = (
  mainData,
  channels,
  addedPhases,
  isOverlay,
  sourceType,
  setActiveSensorId,
  timeRange,
  isEditing,
  showAxes,
  invisibleLegends,
  panEnable
) => {
  const addedPhasesStartTime =
    addedPhases?.length > 0 ? addedPhases[addedPhases.length - 1]?.start_time : null;
  const isPhaseStartTimeInRange = inRange(addedPhasesStartTime, timeRange?.start, timeRange?.end);
  const timeUnit = DATASET[sourceType].unit;
  const series = getSeries(mainData, channels, invisibleLegends);

  const phasePointSeries = {
    type: 'scatter',
    name: 'Adding Phases',
    id: 'Adding_Phases',
    data: isPhaseStartTimeInRange ? [[addedPhasesStartTime, 0]] : null,
    tooltip: {
      headerFormat: '<b>Timestamp: {point.x:%Y-%m-%d %H:%M:%S}</b><br>',
      pointFormat: 'Circle Size: {point.y}',
    },
    marker: {
      symbol: 'circle',
      radius: 5,
      lineWidth: 1,
      lineColor: 'white',
      fillColor: '#f44336',
    },
    turboThreshold: 10000,
    yAxis: 0,
  };

  const allSeries = series.concat([phasePointSeries]);

  const options = {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      plotBorderColor: isEditing ? '#03BCD4' : '#414141',
      plotBorderWidth: isEditing ? 2 : 1,
      plotBackgroundColor: isEditing ? 'rgba(3, 188, 212, 0.03)' : 'transparent',
      animation: false,
      spacingLeft: 0,
      spacingRight: 1,
      zoomType: panEnable ? null : 'x',
      resetZoomButton: {
        theme: { zIndex: -1, display: 'none' },
      },
      marginLeft: showAxes ? undefined : 2,
      panning: panEnable,
      pinchType: 'x',
      style: {
        cursor: panEnable ? 'grab' : 'default',
      },
    },
    title: {
      text: null,
    },
    tooltip: {
      borderWidth: 0,
      borderRadius: 4,
      shadow: false,
      shared: true,
      crosshairs: true,
      valueDecimals: 1,
      backgroundColor: '#3B3B3BE6',
      style: { color: '#fff', fontFamily: 'Roboto', fontSize: '11px', lineHeight: '16px' },
      useHTML: true,
      formatter: function tooltipFormat() {
        return tooltipFormatter.call(this, isOverlay, timeUnit, setActiveSensorId);
      },
    },
    xAxis: {
      type: !isOverlay ? 'datetime' : 'linear',
      lineWidth: 0,
      opposite: false,
      tickWidth: 0,
      gridLineWidth: 1,
      gridLineColor: '#333333',
      labels: {
        formatter: value =>
          !isOverlay
            ? moment.unix(value.value).format('MM/DD HH:mm')
            : Math.round(value.value * timeUnit),
        y: 24,
        enabled: showAxes,
        style: {
          fontFamily: 'Roboto',
          color: '#9E9E9E',
          fontSize: '11px',
          lineHeight: '16px',
        },
      },
      title: {
        enabled: showAxes,
      },
      min: !isOverlay ? timeRange.start : null,
      max: !isOverlay ? timeRange.end : null,
      maxPadding: 0.01,
    },
    yAxis: [
      ...channels
        .filter(channel => channel.yAxisGrouped)
        .map(channel => {
          const axisName = channel.displayName || startCase(channel.traceName);
          const min = channel.isAutoScale
            ? getMinMaxValue(channel.traceMin, channel.traceMax - channel.traceMin)
            : channel.minValue;
          const max = channel.isAutoScale
            ? getMinMaxValue(channel.traceMax, channel.traceMax - channel.traceMin, false)
            : channel.maxValue;
          const legendKey = channel.sensorName
            ? `${channel.sensorName}_${channel.traceName}`
            : channel.traceName;
          return {
            title: {
              enabled: showAxes,
              text: `${axisName} ${channel.unit ? `(${channel.unit})` : ''}`,
              style: {
                fontFamily: 'Roboto',
                color: '#9E9E9E',
                fontSize: '14px',
                lineHeight: '16px',
              },
            },
            labels: {
              enabled: showAxes,
              style: {
                fontFamily: 'Roboto',
                color: '#9E9E9E',
                fontSize: '11px',
                lineHeight: '8px',
              },
            },
            gridLineColor: '#333333',
            startOnTick: false,
            endOnTick: channel.isAutoScale,
            ...(!channel.isAutoScale
              ? {
                  tickPositioner() {
                    let tick = channel.minValue;
                    const positions = [];
                    const increment = (channel.maxValue - channel.minValue) / 4;

                    if (channel.maxValue !== null && channel.minValue !== null) {
                      for (tick; tick <= channel.maxValue; tick += increment) {
                        if (tick !== channel.minValue && tick !== channel.maxValue)
                          positions.push(parseFloat(tick.toFixed(2)));
                        else positions.push(tick);
                      }
                    }
                    return positions;
                  },
                }
              : {}),
            softMax: 1,
            min,
            max,
            opposite: channel.sidePosition === 'right',
            visible:
              (channel.yAxisLabelVisible || typeof channel.yAxisLabelVisible === 'undefined') &&
              !invisibleLegends.includes(legendKey),
          };
        }),
      {
        visible: false,
        startOnTick: false,
        endOnTick: false,
        top: '100%',
        height: 8,
        reversed: true,
        min: 0,
        max: 10,
      },
    ],
    legend: {
      enabled: false,
    },
    boost: {
      enabled: true,
      useGPUTranslations: true,
      usePreAllocated: true,
    },
    credits: {
      enabled: false,
    },
    exporting: { enabled: false },
    plotOptions: {
      series: {
        borderWidth: 0,
        borderRadius: 1,
        animation: false,
        boostThreshold: 10001,
      },
      xrange: {
        grouping: false,
        borderWidth: 0,
        borderRadius: 3,
        pointWidth: 8,
      },
    },
    series: allSeries,
  };

  return options;
};
