import { useState, useMemo, useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsStock from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { merge } from 'lodash';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';

import {
  AxisDropdown,
  ChartButtons,
  ChartWrapper,
  ChartSelect,
  DragToZoomButton,
  PanButton,
  ResetZoomButton,
  ZoomInButton,
  ZoomOutButton,
  HideAxesButton,
  ChartTypeButton,
} from './components';

import getChartOptions from './options';
import { getFormattedFormations, renderFormations } from './formations';

const containerProps = {
  style: { height: '100%', width: '100%' },
};

const useStyles = makeStyles(() => {
  return {
    root: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    chart: {
      flex: 8,
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    smallChart: {
      height: 250,
    },
    horizontalControls: {
      display: 'flex',
      flexDirection: 'row',
      top: 8,
      bottom: 'unset',
    },
    mobileButtons: {
      top: 8,
    },
  };
});

const seriesCount = 3;
const recordsCount = 50;

export const Chart = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const CustomizeScaleChart = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
    setMounted(true);
  }, []);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const onCustomizeScaleClick = event => {
    // eslint-disable-next-line no-alert
    alert(
      JSON.stringify({
        min: event.min,
        max: event.max,
      })
    );
  };

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} onCustomizeScaleClick={onCustomizeScaleClick} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const CustomizeScaleChartInverted = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
    setMounted(true);
  }, []);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const onCustomizeScaleClick = event => {
    // eslint-disable-next-line no-alert
    alert(
      JSON.stringify({
        min: event.min,
        max: event.max,
      })
    );
  };

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...options, chart: { ...options.chart, inverted: true } }}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} onCustomizeScaleClick={onCustomizeScaleClick} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const ChartWithFormations = props => {
  const [, setMounted] = useState(false);
  const chartRef = useRef();
  const classes = useStyles();

  const plotLines = getFormattedFormations(props.formations, props.axis === 'y');

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.setSize();
      renderFormations({ chart: chartRef.current.chart, plotLines, axis: props.axis });
    }
    setMounted(true);
  }, [props.axis]);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} withFormations {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const AdditionalButtonsChart = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    setMounted(true);
  }, []);
  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const handleChartTypeChange = chartType => {
    if (chartType === 'bar') {
      chartRef.current.chart.update({
        legend: {
          symbolHeight: 12,
        },
      });
    }
  };

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons className={classes.horizontalControls}>
            <ChartTypeButton onClick={handleChartTypeChange} />
            <ChartSelect
              defaultValue="test1"
              options={[
                {
                  label: 'test 1',
                  value: 'test1',
                },
                {
                  label: 'test 2',
                  value: 'test2',
                },
                {
                  label: 'test 3',
                  value: 'test3',
                },
              ]}
            />
            <HideAxesButton tooltipProps={{ placement: 'bottom' }} />
          </ChartButtons>
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const SmallChart = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.smallChart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

const useDropdownStyles = makeStyles({
  horizontalDropdown: { position: 'absolute', bottom: 42, left: '46%' },
  verticalDropdown: {
    position: 'absolute',
    bottom: '50%',
    left: -20,
    transform: 'rotate(-90deg) translateY(50%)',
  },
});

export const AxisDropdownChart = props => {
  const [, setMounted] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('test1');

  const chartRef = useRef();
  const classes = useStyles();
  const dropdownClasses = useDropdownStyles();

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
    setMounted(true);
  }, []);

  const dropdownOptions = [
    { label: 'test1', value: 'test1' },
    { label: 'test2', value: 'test2' },
    { label: 'test3', value: 'test3' },
  ];

  const handleDropdownValueChange = ({ target }) => {
    setDropdownValue(target.value);
  };

  const options = merge(
    getChartOptions({
      seriesCount,
      recordsCount,
    }),
    {
      chart: {
        spacingLeft: 60,
      },
      yAxis: {
        title: {
          margin: 16,
          text: null,
        },
      },
      xAxis: {
        min: 0,
        max: 48,
        minorTicks: false,
        tickAmount: 2,
        tickPositions: [0, 48],
        title: {
          margin: -14,
          text: null,
        },
      },
    }
  );

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
        <AxisDropdown
          className={dropdownClasses.horizontalDropdown}
          value={dropdownValue}
          unit="ft"
          onChange={handleDropdownValueChange}
          options={dropdownOptions}
        />
        <AxisDropdown
          className={dropdownClasses.verticalDropdown}
          value={dropdownValue}
          unit="gb"
          onChange={handleDropdownValueChange}
          options={dropdownOptions}
        />
      </div>
    </div>
  );
};

export const ChartRightAxis = () => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
    setMounted(true);
  }, []);

  const options = merge(
    {
      yAxis: {
        lineWidth: 1,
        lineColor: '#3B3B3B',
        opposite: true,
      },
    },
    getChartOptions({
      seriesCount,
      recordsCount,
    })
  );

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        {options && (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={containerProps}
            ref={chartRef}
          />
        )}
      </div>
    </div>
  );
};

export const ChartTwoValuesAxis = () => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
    setMounted(true);
  }, []);

  const options = merge(
    {
      yAxis: {
        min: 0,
        max: 8000,
        minorTicks: false,
        tickAmount: 2,
        tickPositions: [0, 8000],
        title: {
          margin: -14,
        },
      },
      xAxis: {
        min: 0,
        max: 48,
        minorTicks: false,
        tickAmount: 2,
        tickPositions: [0, 48],
        title: {
          margin: -14,
        },
      },
    },
    getChartOptions({
      seriesCount,
      recordsCount,
    })
  );

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        {options && (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={containerProps}
            ref={chartRef}
          />
        )}
      </div>
    </div>
  );
};

export const MobileResponsiveChart = props => {
  const [, setMounted] = useState(false);
  const chartRef = useRef();
  const classes = useStyles();

  const theme = useTheme();
  const isTabletView = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = merge(
    {},
    getChartOptions({
      seriesCount,
      recordsCount,
    }),
    isTabletView && {
      xAxis: {
        maxPadding: 0,
      },
      responsive: null,
      legend: {
        enabled: false,
      },
    }
  );

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons className={isTabletView && classes.mobileButtons}>
            <ResetZoomButton />
            {!isTabletView && (
              <>
                <PanButton />
                <DragToZoomButton />
                <ZoomInButton />
                <ZoomOutButton />
              </>
            )}
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export const HighchartStockChart = props => {
  const [, setMounted] = useState(false);

  const chartRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    setMounted(true);
  }, []);

  const options = getChartOptions({
    seriesCount,
    recordsCount,
  });

  const stockOptions = {
    ...options,
    tooltip: {
      headerFormat: '',
      ...options.tooltip,
    },
    rangeSelector: {
      enabled: false,
    },
    yAxis: {
      opposite: false,
      ...options.yAxis,
      title: null,
      crosshair: {
        ...options.yAxis.crosshair,
        label: {
          enabled: true,
          format: '{value:.2f}',
          shape: 'box',
          borderRadius: '4px',
          backgroundColor: 'rgba(82, 80, 80, 0.5)',
          padding: 2,
          style: {
            color: '#ffffff',
            backgroundColor: 'rgba(82, 80, 80, 0.8)',
          },
        },
      },
    },
    xAxis: {
      ...options.xAxis,
      crosshair: {
        ...options.xAxis.crosshair,
        label: {
          enabled: true,
          format: '{value:.2f}',
          shape: 'box',
          borderRadius: '4px',
          backgroundColor: 'rgba(82, 80, 80, 0.8)',
          padding: 2,
          style: {
            color: '#ffffff',
            backgroundColor: 'rgba(82, 80, 80, 0.8)',
          },
        },
      },
    },
  };

  const chartElement = useMemo(() => {
    return (
      <HighchartsReact
        highcharts={HighchartsStock}
        constructorType="stockChart"
        options={stockOptions}
        containerProps={containerProps}
        ref={chartRef}
      />
    );
  }, [options]);

  return (
    <div className={classes.root}>
      <div className={classes.chart}>
        <ChartWrapper chartRef={chartRef} {...props}>
          {options && chartElement}
          <ChartButtons>
            <ResetZoomButton />
            <PanButton />
            <DragToZoomButton />
            <ZoomInButton />
            <ZoomOutButton />
          </ChartButtons>
        </ChartWrapper>
      </div>
    </div>
  );
};

export default {
  title: 'Components/Chart',
  component: Chart,
  subcomponents: {
    CustomizeScaleChart,
    AdditionalButtonsChart,
    SmallChart,
    AxisDropdownChart,
    ChartRightAxis,
    ChartTwoValuesAxis,
    HighchartStockChart,
  },
  argTypes: {
    onZoomChangeCallback: {},
    chartOptions: {},
    isAxesCoordinatesShown: {
      control: {
        type: 'boolean',
      },
    },
    formations: {
      control: {
        type: ['object'],
      },
    },
    axis: {
      control: 'radio',
      options: ['y', 'x'],
    },
  },
  args: {
    onZoomChangeCallback: () => {},
    chartOptions: null,
    isAxesCoordinatesShown: false,
    axis: 'y',
    formations: [
      {
        value: 975,
        text: 'Santa Rosa',
      },
      {
        value: 1364.68,
        text: 'Tecovas',
      },
      {
        value: 1725,
        text: 'Rustler',
      },
      {
        value: 1752.9,
        text: 'Salado',
      },
      {
        value: 2777.7,
        text: 'Yates',
      },
      {
        value: 3134.4,
        text: 'Seven Rivers',
      },
      {
        value: 4000,
        text: 'Queen',
      },
      {
        value: 4400,
        text: 'Grayburg',
      },
      {
        value: 4620.76,
        text: 'San Andres',
      },
      {
        value: 6184,
        text: 'Glorieta',
      },
      {
        value: 7121,
        text: 'Clearfork',
      },
      {
        value: 7971,
        text: 'Upper Spraberry',
      },
      {
        value: 8274,
        text: 'Upper Spraberry Shale',
      },
      {
        value: 8600,
        text: 'Lower Spraberry',
      },
    ],
  },
};
