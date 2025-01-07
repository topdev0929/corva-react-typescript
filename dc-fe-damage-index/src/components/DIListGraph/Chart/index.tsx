import { FC, useEffect, useMemo, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import * as Highcharts from 'highcharts';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@material-ui/core';

import { useDIChartStore } from '@/contexts/di-chart';
import { debounce } from '@/shared/utils';
import { Theme } from '@/shared/types';

import { getOptions } from './options';

const DEFAULT_Y_AXIS_EXTREMES = {
  MIN: 0,
  MAX: 0.5,
};

export const LineChart: FC = observer(() => {
  const theme = useTheme<Theme>();
  const store = useDIChartStore();
  const chartRef = useRef<HighchartsReact | null>(null);

  const updateChart = (chart: Highcharts.Chart, options: Highcharts.Options) => {
    chart.update(options, true, true);
  };

  const setDefaultYAxisExtremes = (chart: Highcharts.Chart) => {
    const yAxis = chart.yAxis[0];
    const extremes = yAxis.getExtremes();
    if (extremes.max < DEFAULT_Y_AXIS_EXTREMES.MAX) {
      yAxis.setExtremes(DEFAULT_Y_AXIS_EXTREMES.MIN, DEFAULT_Y_AXIS_EXTREMES.MAX);
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const options = getOptions(store.lines, store.selectedXAxis, theme, store.scales);
      updateChart(chartRef.current.chart, options);
      setDefaultYAxisExtremes(chartRef.current.chart);
    }
  }, [store.lines, theme.isLightTheme, store.scales]);

  useEffect(() => {
    if (chartRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const element = chartRef.current.chart.renderTo.parentElement;
      const resizeObserver = new ResizeObserver(
        debounce(() => chartRef.current?.chart.setSize(), 100)
      );
      resizeObserver.observe(element);
      return () => {
        resizeObserver.unobserve(element);
      };
    }
  }, []);

  return useMemo(() => {
    const options = getOptions(store.lines, store.selectedXAxis, theme, store.scales);

    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <HighchartsReact
          ref={chartRef}
          containerProps={{ style: { width: '100%', height: '100%' } }}
          highcharts={Highcharts}
          options={options}
        />
      </>
    );
  }, []);
});

LineChart.displayName = 'LineChart';
