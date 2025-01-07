import { useMemo } from 'react';
import { shape } from 'prop-types';
import { isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/core';

import ComparisonHeader from '~/components/StageDesignVActual/ComparisonHeader';
import ComparisonRow from '~/components/StageDesignVActual/ComparisonRow';
import ElementsComparison from '~/components/StageDesignVActual/ElementsComparison';

import { getSummaries } from './utils';
import NoData from '../NoData';

const useStyles = makeStyles({
  wrapper: {
    flex: '1',
    overflowY: 'auto',
    padding: '0 5px',
  },
});

const Stages = ({ feedItem, stages, predictionsData }) => {
  const classes = useStyles();
  const actualData = feedItem.context?.completion_actual_stage || {};

  const summaries = useMemo(() => getSummaries(actualData, stages, predictionsData), [
    actualData,
    stages,
    predictionsData,
  ]);

  const stageNumber = () =>
    !isEmpty(actualData) ? `Stage Number: ${actualData.data?.stage_number}` : '';

  if (isEmpty(stages) && isEmpty(actualData)) return <NoData subject="stages" />;

  return (
    <div className={classes.wrapper}>
      <ComparisonHeader renderStages={stageNumber} />
      <ComparisonRow
        rowKey="top_perforation"
        label="Top Perforation"
        unitType="length"
        summaries={summaries}
      />
      <ComparisonRow
        rowKey="bottom_perforation"
        label="Bottom Perforation"
        unitType="length"
        summaries={summaries}
      />
      <ComparisonRow
        rowKey="perforated_length"
        label="Perforation Length"
        unitType="length"
        summaries={summaries}
      />
      <ComparisonRow rowKey="total_shots" label="Total Shots" summaries={summaries} />
      <ComparisonRow
        rowKey="flush_volume"
        label="Flush Volume"
        unitType="oil"
        summaries={summaries}
      />
      <ElementsComparison rowKey="chemicals" summaries={summaries} />
      <ElementsComparison rowKey="proppants" summaries={summaries} />
      <ElementsComparison rowKey="fluids" summaries={summaries} />
    </div>
  );
};

Stages.propTypes = {
  feedItem: shape().isRequired,
  stages: shape().isRequired,
  predictionsData: shape().isRequired,
};

export default Stages;
