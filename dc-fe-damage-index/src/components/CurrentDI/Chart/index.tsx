import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FC, useMemo, useEffect, useRef, useState } from 'react';
import { useTheme } from '@material-ui/core';

import { DI_STATUS, getDIStatus } from '@/entities/damage-index';
import { roundValue } from '@/shared/utils';
import { Theme } from '@/shared/types';

import { getDIChartOptions, getSeriesOptions } from './options';
import styles from './index.module.css';

type Props = {
  value: number;
  scales: number[];
};

const getOptions = (value: number, status: DI_STATUS, theme: Theme) => {
  return {
    ...getDIChartOptions(theme),
    series: [getSeriesOptions(value, status, theme)],
  };
};

export const CurrentDiChart: FC<Props> = ({ value, scales }) => {
  const theme = useTheme<Theme>();
  const chartRef = useRef<HighchartsReact | null>(null);
  const roundedValue = useMemo(() => roundValue(value), [value]);
  const [status, setStatus] = useState<DI_STATUS>(DI_STATUS.SAFE);

  useEffect(() => {
    setStatus(getDIStatus(roundedValue, scales[1], scales[2]));
  }, [roundedValue, scales]);

  useEffect(() => {
    const ops = getOptions(roundedValue, status, theme);
    ops.yAxis.plotBands = ops?.yAxis?.plotBands?.map((band, index) => ({
      ...band,
      from: scales[index / 2],
      to: scales[index / 2 + 1],
    }));
    const options: Highcharts.Options = { ...ops };
    chartRef.current?.chart.update(options);
  }, [roundedValue, theme.isLightTheme, scales, status]);

  return useMemo(() => {
    const options: Highcharts.Options = getOptions(roundedValue, status, theme);

    return (
      <div className={styles.container}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <HighchartsReact
          ref={chartRef}
          containerProps={{ style: { width: '80%', maxWidth: 260 } }}
          highcharts={Highcharts}
          options={options}
        />
      </div>
    );
  }, []);
};
