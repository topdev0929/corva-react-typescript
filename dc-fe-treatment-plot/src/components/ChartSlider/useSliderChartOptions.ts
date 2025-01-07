import { useEffect, useMemo, useState } from 'react';

import { GroupedWitsData } from '@/types/Data';
import { ScaleSetting } from '@/types/Settings';

import { makeMainSeries } from '@/utils/eChartUtils';

const SCALE_KEYS = {
  scaleType: 'pressure',
  seriesType: 'wellhead_pressure',
};

const defaultChartOptions = {
  animation: false,
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: 40,
  },
  xAxis: {
    type: 'time',
    axisLabel: false,
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'solid',
        color: '#414141',
      },
    },
    position: 'bottom',
  },
  yAxis: {
    splitLine: {
      show: false,
    },
  },
  series: [],
};

const useSliderChartOptions = (
  groupedWitsData: GroupedWitsData[],
  scaleSettings: ScaleSetting[]
) => {
  const [chartConfig, setChartConfig] = useState(defaultChartOptions);

  const witsScale = useMemo(
    () =>
      scaleSettings
        .find(scale => scale.key === SCALE_KEYS.scaleType)
        ?.series.find(series => series.key === SCALE_KEYS.seriesType),
    [scaleSettings]
  );

  useEffect(() => {
    const series = groupedWitsData.map(({ asset_id, asset_name, stage_number, wits }) =>
      makeMainSeries(
        asset_id,
        asset_name,
        stage_number,
        `${asset_id}-${stage_number}`,
        witsScale?.name,
        0,
        wits.map(item => [item.timestamp, item.wellhead_pressure]),
        witsScale?.color,
        {
          lineStyle: 'solid',
          lineWidth: 1,
          alpha: 1,
        }
      )
    );

    setChartConfig({ ...defaultChartOptions, series });
  }, [groupedWitsData]);

  return chartConfig;
};

export default useSliderChartOptions;
