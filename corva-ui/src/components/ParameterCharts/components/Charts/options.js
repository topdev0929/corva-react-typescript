export const getLineOptionsByTrack = index => {
  const isFirstTrack = index === 0;
  return {
    boost: {
      enabled: false
    },
    chart: {
      backgroundColor: 'transparent',
      plotBackgroundColor: '#272727',
      type: 'line',
      spacing: [0, 0, 0, 0],
      animation: false,
    },
    plotOptions: {
      series: {
        animation: false,
        states: { hover: { enabled: false } },
        enableMouseTracking: false,
        turboThreshold: 10000,
      },
      line: { marker: { enabled: false } },
    },
    xAxis: {
      gridLineColor: '#616161',
      gridLineWidth: 1,
      gridLineDashStyle: 'dot',
      tickLength: 0,
      lineWidth: 0,
      startOnTick: false,
      endOnTick: false,
      minPadding: 0,
      maxPadding: 0,
      opposite: Boolean(isFirstTrack),
      offset: isFirstTrack ? -5 : 0,
      labels: {
        style: { fontSize: '10px', color: '#9E9E9E', fontFamily: 'Roboto' },
        enabled: Boolean(isFirstTrack),
      },
    },
    yAxis: {
      title: { enabled: false },
      labels: {
        enabled: false,
      },
      gridLineColor: '#414141',
      gridLineWidth: 1,
      startOnTick: false,
      endOnTick: false,
      minPadding: 0.25,
      maxPadding: 0.25,
    },
    title: '',
    legend: { enabled: false },
    credits: { enabled: false },
    exporting: { enabled: false },
    series: [],
  };
};
