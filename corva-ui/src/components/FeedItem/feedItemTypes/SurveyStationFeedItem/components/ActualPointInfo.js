import { shape } from 'prop-types';
import { Grid, Typography, makeStyles } from '@material-ui/core';

import { convertValue, getUnitDisplay } from '~/utils/convert';

const PAGE_NAME = 'surveyStationActivity';

const useStyles = makeStyles(theme => ({
  labelGrid: {
    marginRight: 7,
  },
  planText: {
    color: theme.palette.grey[400],
  },
  planUnit: {
    fontSize: 12,
    color: theme.palette.grey[400],
    marginLeft: 5,
  },
  pointValue: {
    display: 'flex',
    alignItems: 'center',
  },
  columnWithMargin: {
    marginRight: 40,
  },
  actualPointContainer: {
    display: 'flex',
    flexGrow: 1,
  },
}));

const normalizeValue = value => (value && typeof value === 'number' ? value.toFixed(2) : '-');

const ActualPointInfo = ({ feedItem }) => {
  const classes = useStyles();
  const surveyStationData = feedItem.context?.survey_station?.data || {};
  const measuredDepth = surveyStationData.measured_depth;

  const { inclination, azimuth, tvd, vertical_section: vs, dls } = surveyStationData;

  const measuredDepthConverted = convertValue(measuredDepth, 'length', 'ft');
  const tvdConverted = convertValue(tvd, 'length', 'ft');
  const vsConverted = convertValue(vs, 'length', 'ft');
  const dlsConverted = convertValue(dls, 'anglePerLength', 'dp100f');

  return (
    <Grid spacing={16} justify="flex-start" className={classes.actualPointContainer}>
      <Grid item className={classes.labelGrid}>
        <Typography variant="body2" className={classes.planText}>
          Survey at:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          Inc:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          Azi:
        </Typography>
      </Grid>
      <Grid item className={classes.columnWithMargin}>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_lastSurvey`}
          className={classes.pointValue}
        >
          {normalizeValue(measuredDepthConverted)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            ({getUnitDisplay('length')})
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_inclination`}
          className={classes.pointValue}
        >
          {normalizeValue(inclination)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            °
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_azimuth`}
          className={classes.pointValue}
        >
          {normalizeValue(azimuth)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            °
          </Typography>
        </Typography>
      </Grid>
      <Grid item className={classes.labelGrid}>
        <Typography variant="body2" className={classes.planText}>
          TVD:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          VS:
        </Typography>
        <Typography variant="body2" className={classes.planText}>
          DLS:
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" data-testid={`${PAGE_NAME}_TVD`} className={classes.pointValue}>
          {normalizeValue(tvdConverted)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            ({getUnitDisplay('length')})
          </Typography>
        </Typography>
        <Typography variant="body2" data-testid={`${PAGE_NAME}_VS`} className={classes.pointValue}>
          {normalizeValue(vsConverted)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            ({getUnitDisplay('length')})
          </Typography>
        </Typography>
        <Typography variant="body2" data-testid={`${PAGE_NAME}_DLS`} className={classes.pointValue}>
          {normalizeValue(dlsConverted)}
          <Typography variant="body2" component="span" className={classes.planUnit}>
            {getUnitDisplay('anglePerLength')}
          </Typography>
        </Typography>
      </Grid>
    </Grid>
  );
};

ActualPointInfo.propTypes = {
  feedItem: shape({
    context: shape({
      survey_station: shape({
        data: shape().isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default ActualPointInfo;
