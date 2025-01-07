import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';

import { StageScore, Theme } from '../../types';

import MetricsBox from './MetricsBox';
import { upperFirst } from 'lodash';

interface StylesProps {
  pixelWidth: number;
}
const DESKTOP_WIDTH = 1060;

const useStyles = makeStyles<Theme, StylesProps>({
  metricsList: {
    display: 'grid',
    gridGap: 8,
    gridTemplateRows: ({ pixelWidth }) => (pixelWidth < DESKTOP_WIDTH ? '1fr 1fr' : '1fr'),
    gridAutoFlow: 'column',
    marginBottom: 16,
    overflow: 'auto',
  },
});

type MetricsProps = {
  scores: StageScore[];
  metricsFunction: 'avg' | 'sum';
  designRate: number;
  pixelWidth: number;
};

// Time before target = (Time stamp of ISIP - Time stamp of Rate Start) / 60 - (vol / design rate)
const calculateTimeBeforeTarget = (
  scores: StageScore[],
  designRate: number,
  metricsFunction = 'avg'
): number => {
  const totalLostTime = scores.reduce((result, score) => {
    const lossTime =
      (score.data.isip_timestamp - score.data.rate_start) / 60 -
      score.data.total_volume_pumped / designRate;

    return result + (lossTime > 0 ? lossTime : 0);
  }, 0);

  return metricsFunction === 'avg' ? totalLostTime / scores.length : totalLostTime;
};

const getMetric = (scores: StageScore[], metric: string, metricsFunction = 'avg'): number => {
  const sum = scores.reduce((result, score) => result + score.data[metric], 0);

  return metricsFunction === 'avg' ? sum / scores.length : sum;
};

const getAverage = (scores: StageScore[], metric: string): number => {
  const sum = scores.reduce((result, score) => result + score.data[metric], 0);

  return sum / scores.length;
};

const Metrics: FunctionComponent<MetricsProps> = ({
  scores,
  metricsFunction,
  designRate,
  pixelWidth,
}) => {
  const classes = useStyles({ pixelWidth });

  return (
    <div className={classes.metricsList}>
      <MetricsBox label="Numbers Of Stages" value={scores.length} />
      <MetricsBox
        label="Average Rate Post Breakdown"
        unit="bpm"
        value={getAverage(scores, 'mean_rate_breakdown_isip')}
      />
      <MetricsBox
        label="Average Pressure Post Breakdown"
        unit="psi"
        value={getAverage(scores, 'mean_pressure_breakdown_isip')}
      />
      <MetricsBox
        label="Time To Rate"
        unit="min"
        value={getMetric(scores, 'time_to_rate', metricsFunction) / 60}
      />
      <MetricsBox
        label="Time Below Target"
        unit="min"
        value={calculateTimeBeforeTarget(scores, designRate, metricsFunction)}
      />
      <MetricsBox
        label="Proppant Placed"
        unit="%"
        value={getAverage(scores, 'percentage_proppant_placed') * 100}
      />
      <MetricsBox
        label="Average FR Concentration"
        value={getAverage(scores, 'mean_friction_reducer')}
      />
    </div>
  );
};

export default Metrics;
