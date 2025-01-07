import { random, times } from 'lodash';
import { tooltipFormatter } from './tooltip';

function getRandomSeriesName(labelMinLengt, labelMaxLength) {
  const length = random(labelMinLengt, labelMaxLength);
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));

  return result;
}

const getRandomData = count => times(count, () => random(8000));

function getChartOptions({ seriesCount, recordsCount, labelMinLength = 4, labelMaxLength = 6 }) {
  return {
    series: times(seriesCount, () => ({
      name: getRandomSeriesName(labelMinLength, labelMaxLength),
      data: getRandomData(recordsCount),
    })),
    chart: {
      backgroundColor: '#191919',
      animation: false,
      selectionMarkerFill: 'rgba(99, 239, 255, 0.1)',
      panning: {
        enabled: true,
        type: 'xy',
      },
      zoomType: 'xy',
      resetZoomButton: {
        position: {
          y: -50,
        },
      },

      type: 'spline',
    },
    plotOptions: {
      series: {
        turboThreshold: 50000,
      },
      spline: { marker: { enabled: false } },
      area: {
        color: 'rgba(99, 239, 255, 0.1)',
        opacity: 0.8,
      },
    },
    xAxis: {
      gridLineWidth: 1,
      zIndex: 1000,
      gridLineColor: '#3B3B3B',
      minPadding: 0,
      maxPadding: 0.04,
      tickWidth: 0,
      lineColor: '#3B3B3B',
      lineWidth: 1,
      title: {
        text: 'Days',
        style: { fontSize: '14px', cursor: 'default', color: '#9E9E9E' },
      },
      labels: { padding: 4, style: { color: '#9E9E9E' } },
    },
    yAxis: {
      gridLineColor: '#3B3B3B',
      labels: { padding: 0, style: { color: '#9E9E9E' } },
      zIndex: 1000,
      lineColor: '#3B3B3B',
      lineWidth: 1,
      title: {
        text: 'Depth (ft)',
        style: {
          fontSize: '14px',
          cursor: 'default',
          color: '#9E9E9E',
        },
      },
    },
    title: '',
    tooltip: {
      backgroundColor: 'rgba(59, 59, 59, 0.9)',
      borderWidth: 0,
      shadow: false,
      useHTML: true,
      shared: true,
      split: false,
      padding: 0,
      hideDelay: 0,
      formatter: tooltipFormatter,
      valueDecimals: 2,
      style: {
        fontFamily: 'Roboto',
      },
    },
    legend: {
      enabled: true,
      itemStyle: { color: '#bdbdbd', fontSize: '11px', fontWeight: '400', fontFamily: 'Roboto' },
      itemHoverStyle: { color: '#ffffff' },
      itemHiddenStyle: { color: '#808080' },
      layout: 'horizontal',
      itemDistance: 16,
      navigation: { arrowSize: 8 },
      symbolWidth: 24,
      symbolHeight: 1,
      symbolPadding: 8,
    },
    responsive: {
      rules: [
        {
          condition: {
            minWidth: 0,
          },
          chartOptions: {
            xAxis: {
              maxPadding: 0.16,
            },
          },
        },
        {
          condition: {
            minWidth: 400,
          },
          chartOptions: {
            xAxis: {
              maxPadding: 0.1,
            },
          },
        },
        {
          condition: {
            minWidth: 600,
          },
          chartOptions: {
            xAxis: {
              maxPadding: 0.08,
            },
          },
        },
        {
          condition: {
            minWidth: 800,
          },
          chartOptions: {
            xAxis: {
              maxPadding: 0.06,
            },
          },
        },
        {
          condition: {
            minWidth: 1000,
          },
          chartOptions: {
            xAxis: {
              maxPadding: 0.04,
            },
          },
        },
      ],
    },
    credits: { enabled: false },
    exporting: { enabled: false },
  };
}

export default getChartOptions;
