import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { bind, clear } from 'size-sensor';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import { AdvancedSlider } from '@corva/ui/components';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as eChartsLib from 'echarts';
import { debounce } from 'lodash';
import {
  DATASET_OPTIONS,
  HIGH_DIFF_SECONDS,
  LOW_DIFF_SECONDS,
  MEDIUM_DIFF_SECONDS,
  XHIGH_DIFF_SECONDS,
} from '~/constants';

const DEFAULT_DATE_FORMAT = 'MM/DD HH:mm';
const SERIES_COLOR = '#F50057';

const debouncedFunc = debounce(callback => {
  callback();
}, 1000);

const useStyles = makeStyles(theme => ({
  chartSliderContainer: {
    height: '32px',
    marginLeft: props => props.left,
    marginRight: props => props.right,
    position: 'relative',
    zIndex: 0,
  },
  sliderContainer: {
    height: '32px',
    '& > div > div': {
      // root class of AdvancedSlider
      '& > :nth-child(1):after, & > :nth-child(3):after': {
        content: "''",
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        background: theme.palette.background.b4,
        pointerEvents: 'none',
        opacity: 0.6,
        width: 'calc(100% - 2px)',
        height: 'calc(100% - 2px)',
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
      },
    },
  },
  chartContainer: {
    height: '32px',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 4,
    overflow: 'hidden',
  },
}));

function ChartSlider({
  viewDataset,
  allData,
  left,
  right,
  lastTimestamp,
  timeRange,
  setTimeRange,
}) {
  const styles = useStyles({ left, right });
  const chartContainer = useRef();
  const [chartInstance, setChartInstance] = useState(null);
  const [sliderValue, setSliderValue] = useState(null);
  const [sliderKey, setSliderKey] = useState(true);

  const chartOptions = useMemo(() => {
    return {
      animation: false,
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 32,
      },
      xAxis: {
        type: 'time',
        axisLabel: false,
      },
      yAxis: {
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'preview',
          type: 'line',
          lineWidth: 1,
          color: SERIES_COLOR,
          yAxisIndex: 0,
          lineStyle: {
            normal: {
              type: 'solid',
              width: 1,
            },
            emphasis: {
              type: 'solid',
              width: 1,
            },
          },
          showSymbol: false,
          data: allData.map(record => [record.timestamp, Object.values(record.data)?.[0]]),
        },
      ],
    };
  }, [allData]);

  useEffect(() => {
    if (!chartInstance && chartContainer.current) {
      const instance = eChartsLib.init(chartContainer.current);
      instance.setOption(chartOptions);
      setChartInstance(instance);

      bind(chartContainer.current, () => {
        instance.resize();
      });
    }

    return () => {
      if (chartContainer?.current) {
        chartInstance?.dispose();
        clear(chartContainer.current);
      }
    };
  }, []);

  useEffect(() => {
    chartInstance?.setOption(chartOptions);
  }, [chartOptions]);

  useEffect(() => {
    if (!sliderValue) return;

    let { start, end } = sliderValue;
    let maxTimeDiff;

    if (viewDataset === DATASET_OPTIONS[4].value) maxTimeDiff = LOW_DIFF_SECONDS;
    else if (viewDataset === DATASET_OPTIONS[3].value) maxTimeDiff = MEDIUM_DIFF_SECONDS;
    else if (viewDataset === DATASET_OPTIONS[2].value) maxTimeDiff = HIGH_DIFF_SECONDS;
    else if (viewDataset === DATASET_OPTIONS[1].value) maxTimeDiff = XHIGH_DIFF_SECONDS;
    else maxTimeDiff = timeRange.max - timeRange.min;

    if (sliderValue.end - sliderValue.start > maxTimeDiff) {
      if (timeRange.start === sliderValue.start) {
        end = sliderValue.start + maxTimeDiff;
      } else {
        start = sliderValue.end - maxTimeDiff;
      }
    }
    if (start !== timeRange.start || end !== timeRange.end) {
      setTimeRange(prev => ({
        ...prev,
        start,
        end,
        max: lastTimestamp,
      }));
    }
    setSliderKey(prev => !prev);
    setSliderValue(null);
  }, [viewDataset, timeRange, sliderValue]);

  // types are not defined for onChange and value and they are inferred from HTMLElement,
  // so we need to typecast to any
  const handleChange = ([startValue, endValue]) => {
    debouncedFunc(() => {
      setSliderValue({
        min: timeRange.min,
        max: timeRange.max,
        start: Math.min(startValue, endValue - 10),
        end: endValue,
      });
    });
  };

  return (
    <div className={styles.chartSliderContainer}>
      <div className={styles.sliderContainer}>
        <AdvancedSlider
          key={sliderKey}
          orientation="horizontal"
          min={timeRange?.min}
          max={timeRange?.max}
          editableHandles={false}
          displayFormatter={value => moment.unix(value).format(DEFAULT_DATE_FORMAT)}
          value={[timeRange?.start, timeRange?.end]}
          onChange={handleChange}
          minimal
        />
      </div>
      <div className={styles.chartContainer} ref={chartContainer} />
    </div>
  );
}

ChartSlider.propTypes = {
  viewDataset: PropTypes.string.isRequired,
  allData: PropTypes.arrayOf(PropTypes.shape({ data: PropTypes.shape({}) })).isRequired,
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  lastTimestamp: PropTypes.number.isRequired,
  timeRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
  }).isRequired,
  setTimeRange: PropTypes.func.isRequired,
};

export default ChartSlider;
