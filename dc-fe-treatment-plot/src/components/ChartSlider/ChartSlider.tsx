import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { bind, clear } from 'size-sensor';
import moment from 'moment';
import { min } from 'lodash';

import { makeStyles } from '@material-ui/core';
import { AdvancedSlider } from '@corva/ui/components';

import * as eChartsLib from 'echarts';

import { TimeRange } from './types';
import useSliderChartOptions from './useSliderChartOptions';
import { ScaleSetting } from '@/types/Settings';
import { GroupedWitsData } from '@/types/Data';
import { MuiTheme } from '@/types/MuiTheme';
import { DEFAULT_DATE_FORMAT } from '@/constants';

const useStyles = makeStyles((theme: MuiTheme) => ({
  chartSliderContainer: {
    height: 40,
    marginTop: 8,
    position: 'relative',
    zIndex: 0,
  },
  sliderContainer: {
    // custom styles for AdvancedSlider
    height: 40,
    '& > div > div': {
      // root class of AdvancedSlider
      '& > :nth-child(1):after, & > :nth-child(3):after': {
        // "handle" blocks creating space around slider body(2nd child)
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
    height: 40,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 4,
    overflow: 'hidden',
  },
}));

interface ChartSliderProps {
  chartGrid: {
    left: number;
    right: number;
  };
  scaleSettings: ScaleSetting[];
  assetTimeLimits: TimeRange;
  currentRange: TimeRange;
  data: GroupedWitsData[];
  onSliderChange: (range: TimeRange) => void;
}

const ChartSlider: FunctionComponent<ChartSliderProps> = ({
  chartGrid,
  data,
  scaleSettings,
  assetTimeLimits,
  currentRange,
  onSliderChange,
}) => {
  const styles = useStyles();
  const chartContainer = useRef();
  const [chartInstance, setChartInstance] = useState<eChartsLib.EChartsType>(null);
  const chartOptions = useSliderChartOptions(data, scaleSettings);

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

  // types are not defined for onChange and value and they are inferred from HTMLElement,
  // so we need to typecast to any
  const handleChange: any = ([startValue, endValue]) => onSliderChange({ startValue, endValue });
  const value: any = [
    currentRange?.startValue || assetTimeLimits.startValue || 0,
    min([currentRange?.endValue, assetTimeLimits.endValue]) || 0,
  ];

  return (
    <div
      className={styles.chartSliderContainer}
      style={{ marginLeft: chartGrid.left, marginRight: chartGrid.right }}
    >
      <div className={styles.sliderContainer}>
        {/* TS requires size prop for AdvancedSlider, which breaks the component */}
        {/* @ts-ignore */}
        <AdvancedSlider
          orientation="horizontal"
          handlePosition="top"
          min={assetTimeLimits.startValue || 0}
          max={assetTimeLimits.endValue || 0}
          editableHandles={false}
          displayFormatter={value => moment.unix(value).format(DEFAULT_DATE_FORMAT)}
          value={value}
          onChange={handleChange}
          minimal
        />
      </div>
      <div className={styles.chartContainer} ref={chartContainer} />
    </div>
  );
};

export default ChartSlider;
