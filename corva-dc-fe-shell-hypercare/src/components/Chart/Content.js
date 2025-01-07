import { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { debounce, throttle } from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// NOTE: Enable these lines during development if the chart rendering is slow
// import boost from 'highcharts/modules/boost';
// boost(Highcharts);

import { getChartOptions } from '~/utils/chartUtils';

const debouncedFunc = debounce(callback => {
  callback();
}, 500);

const throttledFunc = throttle(callback => {
  callback();
}, 10);

function ChartContent({
  chartRef,
  width,
  height,
  data,
  preResetRange,
  setPreResetRange,
  timeRange,
  setTimeRange,
  channels,
  addedPhases,
  filteredPhases,
  setChart,
  isOverlay,
  sourceType,
  setActiveSensorId,
  setIsDetailLoading,
  isEditing,
  showAxes,
  invisibleLegends,
  panEnable,
  setPanningTime,
}) {
  return useMemo(() => {
    const options = getChartOptions(
      data,
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
    );
    options.chart.events = {
      selection: e => {
        if (e.resetSelection) {
          setTimeRange(preResetRange);
          setPreResetRange(null);
        } else {
          e.preventDefault();
          setIsDetailLoading(true);
          setTimeout(() => {
            if (!preResetRange) {
              setPreResetRange(timeRange);
            }
            setTimeRange(prev => ({ ...prev, start: e.xAxis[0].min, end: e.xAxis[0].max }));
          });
        }
      },
      pan: e => {
        throttledFunc(() => {
          setPanningTime({
            min: Math.round(e.target.xAxis?.[0]?.min),
            max: Math.floor(e.target.xAxis?.[0]?.max),
          });
        });

        debouncedFunc(() => {
          if (e.target.xAxis?.[0]?.min && e.target.xAxis?.[0]?.max) {
            setTimeRange(prev => ({
              ...prev,
              start: Math.round(e.target.xAxis[0].min),
              end: Math.floor(e.target.xAxis[0].max),
            }));
            setPanningTime(null);
          }
        });
      },
    };

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        immutable
        containerProps={{ style: { height: '100%', width: '100%' } }}
        ref={chartRef}
        callback={chart => {
          setChart(chart);
          const root = document.documentElement;
          root.style.setProperty('--reset-button', `${chart.plotLeft + 8}px`);
        }}
      />
    );
  }, [
    width,
    height,
    data,
    channels,
    timeRange,
    addedPhases,
    filteredPhases,
    isOverlay,
    sourceType,
    preResetRange,
    isEditing,
    showAxes,
    invisibleLegends,
    panEnable,
  ]);
}

ChartContent.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setTimeRange: PropTypes.func.isRequired,
  chartRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  channels: PropTypes.arrayOf({}).isRequired,
  addedPhases: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filteredPhases: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setChart: PropTypes.func.isRequired,
  isOverlay: PropTypes.bool.isRequired,
  sourceType: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  showAxes: PropTypes.bool.isRequired,
  invisibleLegends: PropTypes.arrayOf(PropTypes.string).isRequired,
  panEnable: PropTypes.bool.isRequired,
};

export default memo(ChartContent);
