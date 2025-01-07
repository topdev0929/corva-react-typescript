import * as Highcharts from 'highcharts';

import { DI_STATUS } from '@/entities/damage-index';
import { setAlphaInRGBA } from '@/shared/utils';
import { Theme } from '@/shared/types';

enum PLOT_COLOR {
  SAFE = 'rgba(117, 219, 41, 1)',
  WARN = 'rgba(255, 193, 7, 1)',
  DANGER = 'rgba(244, 67, 54, 1)',
}

const PLOT_COLORS: Record<DI_STATUS, PLOT_COLOR> = {
  SAFE: PLOT_COLOR.SAFE,
  WARN: PLOT_COLOR.WARN,
  DANGER: PLOT_COLOR.DANGER,
};

const PLOT_BG_COLORS: Record<DI_STATUS, string> = {
  SAFE: setAlphaInRGBA(PLOT_COLOR.SAFE, 0.2),
  WARN: setAlphaInRGBA(PLOT_COLOR.WARN, 0.2),
  DANGER: setAlphaInRGBA(PLOT_COLOR.DANGER, 0.2),
};

const getValueColorByStatus = (diStatus: DI_STATUS): PLOT_COLOR => {
  return PLOT_COLORS[diStatus];
};

const chartOptions = {
  type: 'gauge',
  backgroundColor: 'transparent',
  style: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 'normal',
  },
  height: '100%',
  spacing: [0, 0, 0, 0],
};

const plotOptions = {
  gauge: {
    enableMouseTracking: false,
    wrap: false
  },
};

const paneOptions = {
  startAngle: -135,
  endAngle: 135,
  center: ['50%', '50%'],
  background: [
    {
      backgroundColor: 'transparent',
      borderWidth: 0,
      innerRadius: '60%',
      outerRadius: '100%',
    },
  ],
};

const plotBandsOptions = [
  {
    from: 0,
    to: 1,
    color: {
      linearGradient: { x1: 1, x2: 1, y1: 1, y2: 0 },
      stops: [
        [0, PLOT_BG_COLORS.SAFE] as const,
        [0.9, PLOT_BG_COLORS.SAFE] as const,
        [1, PLOT_BG_COLORS.WARN] as const,
      ],
    },
    thickness: 40,
  },
  {
    from: 0,
    to: 1,
    color: PLOT_COLORS.SAFE,
    innerRadius: '100%',
    outerRadius: '104%',
    thickness: 5,
  },
  {
    from: 1,
    to: 3,
    color: {
      linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
      stops: [
        [0, PLOT_BG_COLORS.WARN] as const,
        [0.85, PLOT_BG_COLORS.WARN] as const,
        [1, 'rgba(250, 136, 28, 0.2)'] as const,
      ],
    },
    thickness: 40,
  },
  {
    from: 1,
    to: 3,
    color: PLOT_COLORS.WARN,
    innerRadius: '100%',
    outerRadius: '104%',
    thickness: 5,
  },
  {
    from: 3,
    to: 6,
    color: {
      linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
      stops: [
        [0, 'rgba(250, 136, 28, 0.2)'] as const,
        [0.15, PLOT_BG_COLORS.DANGER] as const,
        [1, PLOT_BG_COLORS.DANGER] as const,
      ],
    },
    thickness: 40,
  },
  {
    from: 3,
    to: 6,
    color: PLOT_COLORS.DANGER,
    innerRadius: '100%',
    outerRadius: '104%',
    thickness: 5,
  },
];

const getYAxisOptions = (theme: Theme) => ({
  min: 0,
  max: 5,
  lineColor: 'transparent',
  tickPixelInterval: 72,
  tickPosition: 'inside' as const,
  tickColor: theme.palette.primary.text1,
  tickLength: 8,
  tickWidth: 2,
  minorTickInterval: 0.5,
  minorTickLength: 8,
  minorTickColor: theme.palette.primary.text1,
  labels: {
    distance: -20,
    style: {
      fontSize: '14px',
      color: theme.palette.primary.text1,
    },
  },
  plotBands: plotBandsOptions,
});

const getDialOptions = (theme: Theme) => ({
  backgroundColor: theme.palette.charts.gaugeArrow,
  radius: '55%',
  borderColor: 'transparent',
  baseWidth: 12,
  topWidth: 1,
  baseLength: '0',
  rearLength: '0',
});

const getPivotOptions = (theme: Theme) => ({
  backgroundColor: theme.palette.background.b4,
  borderColor: theme.palette.charts.gaugeArrow,
  borderWidth: 4,
  radius: 8,
});

const dataLabelOptions = {
  borderWidth: 0,
  padding: 40,
  // eslint-disable-next-line object-shorthand, func-names
  formatter: function (this: Highcharts.PointLabelObject) {
    return this.y || '0.00';
  },
  style: {
    fontSize: '36px',
    fontWeight: '500',
    textOutline: '0px',
  },
};
export const getDIChartOptions = (theme: Theme) => {
  return {
    chart: chartOptions,
    plotOptions,
    pane: paneOptions,
    yAxis: getYAxisOptions(theme),
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: '' },
    tooltip: { enabled: false },
  };
};

export const getSeriesOptions = (value: number, diStatus: DI_STATUS, theme: Theme) => {
  const color: PLOT_COLOR = getValueColorByStatus(diStatus);
  return {
    type: 'gauge' as const,
    name: 'Damage Index',
    data: [{ y: value }],
    dial: getDialOptions(theme),
    pivot: getPivotOptions(theme),
    color: color as string,
    dataLabels: {
      ...dataLabelOptions,
      color: color as string,
    },
  };
};
