import { shape, string, number } from 'prop-types';
import moment from 'moment';
import { Typography, makeStyles } from '@material-ui/core';

import { convertValue, getUnitDisplay } from '~/utils/convert';
import { purifyPlanName, getColorBySeverity } from '~/utils/accuracy';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 20px 10px 0',
    minWidth: '290px',
  },
  planValueWrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  planUnit: {
    color: theme.palette.grey[400],
    marginLeft: 5,
  },
  planText: {
    color: theme.palette.grey[400],
  },
}));

const AccuracyPlan = ({ timestamp, initialPlanName, cumulativeTvdChange, accuracyData }) => {
  const classes = useStyles();
  const dateString = timestamp ? moment.unix(timestamp).format('MM/DD/YY') : '';

  let planName = purifyPlanName(initialPlanName);
  if (cumulativeTvdChange) {
    planName = `${planName}, ${cumulativeTvdChange} ft cumulative TVD change`;
  }

  return (
    <div className="c-survey-station-feed-item__accuracy-plan">
      <Typography variant="subtitle1">Minimum Distance to Plan:</Typography>
      <div className={classes.planValueWrapper}>
        <Typography variant="h5" style={{ color: getColorBySeverity(accuracyData) }}>
          {parseFloat(convertValue(accuracyData?.distance_to_plan, 'length', 'ft')?.toFixed(1))}
        </Typography>
        <Typography variant="caption" className={classes.planUnit}>
          ({getUnitDisplay('length')})
        </Typography>
      </div>
      <Typography variant="body1" className={classes.planText}>
        {planName || dateString}
      </Typography>
    </div>
  );
};

AccuracyPlan.propTypes = {
  timestamp: number,
  initialPlanName: string,
  cumulativeTvdChange: string,
  accuracyData: shape().isRequired,
};

AccuracyPlan.defaultProps = {
  timestamp: null,
  initialPlanName: '',
  cumulativeTvdChange: '',
};

export default AccuracyPlan;
