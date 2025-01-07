import { shape } from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { isEmpty } from 'lodash';

import PredictionsItem from './PredictionsItem';
import NoData from './NoData';

const useStyles = makeStyles({
  wrapper: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
  },
});

const Predictions = ({ stages, predictionsData }) => {
  const classes = useStyles();

  if (isEmpty(stages)) return <NoData subject="predictions" />;

  return (
    <ul className={classes.wrapper}>
      <PredictionsItem
        title="Breakdown"
        fieldName="ave_breakdown"
        predictionsData={predictionsData}
      />
      <PredictionsItem title="ISIP" fieldName="ave_isip" predictionsData={predictionsData} />
      <PredictionsItem
        title="Max Treating Pressure"
        fieldName="max_treating_pressure"
        predictionsData={predictionsData}
      />
      <PredictionsItem
        title="Avg Treating Pressure"
        fieldName="ave_treating_pressure"
        predictionsData={predictionsData}
      />
      <PredictionsItem
        title="Max Flow Rate"
        fieldName="max_flow_rate"
        predictionsData={predictionsData}
      />
    </ul>
  );
};

Predictions.propTypes = {
  stages: shape().isRequired,
  predictionsData: shape().isRequired,
};

export default Predictions;
