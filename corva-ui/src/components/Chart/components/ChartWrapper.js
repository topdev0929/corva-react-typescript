import { makeStyles } from '@material-ui/core';
import { isEmpty, merge } from 'lodash';
import { useEffect, useState } from 'react';
import ChartWrapperContext from '../ChartWrapperContext';
import { MIN_CHART_HEIGHT } from '../constants';
import { useChartModifier, useChartTypeSwitch, useZoom } from '../effects';
import AxisOverlay from './AxisOverlay';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

const defaultChartOptions = {
  zoomType: 'xy',
  panning: {
    enabled: true,
    type: 'xy',
  },
};

const ChartWrapper = ({
  children,
  chartRef,
  isAxesCoordinatesShown,
  onCustomizeScaleClick,
  onZoomChangeCallback,
  chartOptions,
}) => {
  const classes = useStyles();
  const [chartStyles, setChartStyles] = useState({});

  const {
    zoomStatus,
    zoomConfig,
    handleZoomEvent,
    handleResetZoom,
    isZoomEnabled,
    handleIsZoomEnabledChange,
    debouncedChartSelection,
  } = useZoom({
    chart: chartRef.current?.chart,
  });

  useEffect(() => {
    if (isEmpty(chartRef.current?.chart)) {
      return;
    }
    setChartStyles({ marginBottom: chartRef.current?.chart?.marginBottom });
  }, []);

  const handleChangeChartStyles = styles => {
    setChartStyles(prevState => ({ ...prevState, ...styles }));
  };
  const isMinHeightChart = chartRef.current?.chart?.plotBox?.height <= MIN_CHART_HEIGHT;

  useChartModifier({
    chart: chartRef.current?.chart,
    chartOptions: merge({}, defaultChartOptions, chartOptions),
    isZoomEnabled,
    isMinHeightChart,
    onZoomChangeCallback,
    handleChartSelection: debouncedChartSelection,
    isAxesCoordinatesShown,
  });

  const { chartType, handleChartTypeChange } = useChartTypeSwitch({
    chart: chartRef.current?.chart,
  });

  const contextValue = {
    chart: chartRef.current?.chart,
    chartType,
    zoomConfig,
    chartStyles,
    zoomStatus,
    isZoomEnabled,
    setChartStyles,
    handleChartTypeChange,
    handleResetZoom,
    handleZoomEvent,
    isMinHeightChart,
    handleChartSelection: debouncedChartSelection,
    handleChangeChartStyles,
    handleIsZoomEnabledChange,
  };

  return (
    <div className={classes.container}>
      <ChartWrapperContext.Provider value={contextValue}>
        {children}
        {onCustomizeScaleClick &&
          chartRef.current?.chart.axes.map(axis => (
            <AxisOverlay key={axis.coll} onCustomizeScaleClick={onCustomizeScaleClick} {...axis} />
          ))}
      </ChartWrapperContext.Provider>
    </div>
  );
};

ChartWrapper.defaultProps = {
  onZoomChangeCallback: () => {},
};

export default ChartWrapper;
