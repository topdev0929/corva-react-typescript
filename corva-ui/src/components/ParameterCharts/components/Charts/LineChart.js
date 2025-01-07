import { useRef, useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { toNumber } from 'lodash';

import DataContext from '../../DataContext';
import SettingsContext from '../../SettingsContext';
import ChartsContext from '../../ChartsContext';

import EmptyChart from './EmptyChart';

import { getLineOptionsByTrack } from './options';

import styles from './LineChart.css';

const LineChart = ({ traceSettings, trackIndex }) => {
  const { parsedData, indexes } = useContext(DataContext);
  const { onChartChange } = useContext(ChartsContext);
  const { maxTracesCount, multipleAssets, assestColors } = useContext(SettingsContext);
  const chartRef = useRef();

  const options = useMemo(() => {
    const result = getLineOptionsByTrack(trackIndex);
    const defaultYAxis = result.yAxis;
    result.yAxis = [];
    if (multipleAssets) {
      const traceSetting = traceSettings[0];
      if (!traceSetting) return result;
      const assetKeys = Object.keys(parsedData);
      assetKeys.forEach(assetKey => {
        result.series.push({
          ...traceSetting,
          lineColor: assestColors[assetKey],
          ...parsedData[assetKey][`${traceSetting.collection}.${traceSetting.key}`],
          name: assetKey,
        });
        result.yAxis.push({
          ...defaultYAxis,
          min:
            !traceSetting.autoScale && traceSetting.scaleMin
              ? toNumber(traceSetting.scaleMin)
              : undefined,
          max:
            !traceSetting.autoScale && traceSetting.scaleMax
              ? toNumber(traceSetting.scaleMax)
              : undefined,
        });
      });
    } else {
      traceSettings.forEach(item => {
        result.series.push({ ...item, ...parsedData[`${item.collection}.${item.key}`] });
        result.yAxis.push({
          ...defaultYAxis,
          min: !item.autoScale && item.scaleMin ? toNumber(item.scaleMin) : undefined,
          max: !item.autoScale && item.scaleMax ? toNumber(item.scaleMax) : undefined,
        });
      });
    }

    return result;
  }, [traceSettings, parsedData]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.xAxis[0].setExtremes(indexes.min, indexes.max);
    }
  }, [indexes.min, indexes.max]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.chart.setSize();
  }, [maxTracesCount]);

  useEffect(() => {
    onChartChange(trackIndex, chartRef);
  }, [chartRef]);

  const isEpmty =
    !options.series ||
    !options.series.length ||
    (options.series.length === 1 && !options.series[0].data);

  return useMemo(() => {
    if (isEpmty) {
      return <EmptyChart />;
    }

    return (
      options && (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
          containerProps={{ className: styles.container }}
        />
      )
    );
  }, [options]);
};

LineChart.propTypes = {
  traceSettings: PropTypes.arrayOf(
    PropTypes.shape({
      dashStyle: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      key: PropTypes.string,
      color: PropTypes.string,
      name: PropTypes.string,
      traceType: PropTypes.string.isRequired,
      unit: PropTypes.string,
      lineWidth: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  trackIndex: PropTypes.number.isRequired,
};

export default LineChart;
