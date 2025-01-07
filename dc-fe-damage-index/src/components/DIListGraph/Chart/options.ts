import * as Highcharts from 'highcharts';

import { formatDate, formatNumber, formatNumberPrecision, formatShortDate } from '@/shared/utils';
import { LINE_CHART_CONFIG } from '@/constants';
import { AxisOption } from '@/stores/di-chart';
import { DIListLine, getWellNameFromLine } from '@/entities/damage-index/chart-line';
import { Theme } from '@/shared/types';

const getTooltip = (theme: Theme) => ({
  useHTML: true,
  headerFormat: '',
  pointFormatter() {
    const renderTooltipRow = (label: string, value: number | string) => {
      return `
        <span>${label}: </span>
        <span style="color:${theme.palette.primary.text6};margin-right:.25rem;">${value}</span>
        <br/>
      `;
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!this.custom) return null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { time, depth, index, rop } = this.custom;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { name } = this.series;
    const formattedTime = formatDate(time * 1000);
    const depthWithUnits = `${formatNumber(depth)} ft`;
    const ropWithUnits = `${formatNumber(rop)} ft/h`;
    return `<div style="width: 180px; padding: 8px"><p style="margin: 0 0 8px 0; font-size: 12px">${name}</p>${renderTooltipRow(
      'Time',
      formattedTime
    )}${renderTooltipRow('Depth', depthWithUnits)}${renderTooltipRow(
      'Damage Index',
      formatNumberPrecision(index)
    )}${renderTooltipRow('ROP', ropWithUnits)}</div>`;
  },
});

export const getLineOptions = (theme: Theme, isMoreThemOneLine: boolean) => ({
  chart: {
    type: LINE_CHART_CONFIG.TYPE,
    backgroundColor: 'transparent',
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 'normal',
    },
    plotBackgroundColor: theme.palette.background.b3,
    // eslint-disable-next-line object-shorthand, func-names
    numberFormatter: function (number: number) {
      return formatNumber(number);
    },
    zoomType: 'x' as const,
    resetZoomButton: {
      position: {
        y: 8,
        x: -50,
      },
    },
  },
  credits: { enabled: false },
  exporting: { enabled: false },
  labels: {
    color: theme.palette.primary.text7,
  },
  title: { text: '' },
  legend: {
    alignColumns: false,
    maxHeight: 40,
    navigation: {
      activeColor: theme.palette.primary.text1,
      style: {
        color: theme.palette.primary.text6,
        fontSize: '11px',
      },
    },
    // eslint-disable-next-line object-shorthand, func-names
    labelFormatter: function (this: Highcharts.Point | Highcharts.Series) {
      return getWellNameFromLine(this.name);
    },
    margin: 50,
    itemHiddenStyle: {
      color: theme.palette.primary.text1,
      fontSize: '11px',
      fontWeight: 'normal',
      opacity: 0.6,
    },
    itemHoverStyle: {
      color: theme.palette.primary.text1,
      fontSize: '11px',
      fontWeight: 'normal',
      opacity: 1,
    },
    itemStyle: {
      color: theme.palette.primary.text1,
      fontSize: '11px',
      fontWeight: 'normal',
      opacity: 0.9,
    },
  },
  time: {
    useUTC: false,
  },
  plotOptions: {
    line: {
      tooltip: getTooltip(theme),
      turboThreshold: 100000,
      stickyTracking: !isMoreThemOneLine,
      events: {
        legendItemClick: () => false,
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(59, 59, 59, 0.8)',
    borderRadius: 4,
    borderWidth: 1,
    crosshairs: true,
    shadow: false,
    shared: true,
    style: { color: theme.palette.primary.text1 },
    useHTML: true,
    valueDecimals: 2,
  },
  yAxis: {
    title: { text: undefined },
    gridLineWidth: 0,
    labels: {
      style: {
        color: theme.palette.primary.text7,
        fontSize: '14px',
      },
    },
  },
});

export const getSeriesItemOptions = (line: DIListLine): Highcharts.SeriesOptionsType => {
  return {
    type: LINE_CHART_CONFIG.TYPE,
    data: line.points,
    name: line.name,
    color: line.color,
    dashStyle: line.isActive
      ? LINE_CHART_CONFIG.MAIN_LINE_DASH_STYLE
      : LINE_CHART_CONFIG.SECONDARY_LINE_DASH_STYLE,
    lineWidth: line.isActive
      ? LINE_CHART_CONFIG.MAIN_LINE_WIDTH
      : LINE_CHART_CONFIG.SECONDARY_LINE_WIDTH,
    showInLegend: line.showInLegend,
  };
};

const getXAxisOptions = (selectedXAxis: AxisOption, theme: Theme): Highcharts.XAxisOptions => {
  return {
    title: { text: undefined },
    gridLineColor: theme.palette.background.b6,
    gridLineWidth: 1,
    lineColor: theme.palette.background.b5,
    tickLength: 0,
    startOnTick: false,
    endOnTick: false,
    labels: {
      style: {
        color: theme.palette.primary.text7,
        fontSize: '14px',
      },
      // eslint-disable-next-line object-shorthand, func-names
      formatter: function (this) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { value } = this;
        if (selectedXAxis.label === LINE_CHART_CONFIG.X_AXIS_OPTIONS[2].label) {
          return formatShortDate(value * 1000);
        }
        return formatNumber(value);
      },
    },
  };
};

export const getOptions = (
  lines: DIListLine[],
  selectedXAxis: AxisOption,
  theme: Theme,
  scales: number[],
): Highcharts.Options => {
  return {
    ...getLineOptions(theme, lines.length > 1),
    xAxis: getXAxisOptions(selectedXAxis, theme),
    series: lines.map(line => getSeriesItemOptions(line)),
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      gridLineColor: theme.palette.background.b6,
      gridLineWidth: 0,
      plotLines: [
        {
          color: 'rgba(255, 193, 7, 1)',
          width: 2,
          value: scales[1],
          dashStyle: LINE_CHART_CONFIG.SECONDARY_LINE_DASH_STYLE,
          label: {
              text: 'Medium DI',
              align: 'left',
              style: {
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: '11px',
                color: 'rgba(255, 193, 7, 1)',
              },
              x: 5,
              y: scales[1] > 0.5 ? 12 : -4,
            },
            zIndex: 4,
          },
        {
          color: 'rgba(244, 67, 54, 1)',
          width: 2,
          value: scales[2],
          dashStyle: LINE_CHART_CONFIG.SECONDARY_LINE_DASH_STYLE,
          label: {
              text: 'High DI',
              align: 'left',
              style: {
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: '11px',
                color: 'rgba(244, 67, 54, 1)',
              },
              x: 5,
              y: scales[2] - scales[1] > 0.5 ? 12 : -4,
            },
            zIndex: 4,
        },
      ]
    },
  };
};
