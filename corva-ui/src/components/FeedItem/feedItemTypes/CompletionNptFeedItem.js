import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography, Grid, makeStyles } from '@material-ui/core';

import blue from '@material-ui/core/colors/blue';

import { convertValue, getUnitDisplay } from '~/utils/convert';

const PAGE_NAME = 'nptActivity';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm';

const useStyles = makeStyles(theme => ({
  columnWithMargin: {
    marginRight: 40,
  },
  highlightedText: {
    color: blue[300],
    textTransform: 'capitalize',
  },
  valueWrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  unit: {
    color: theme.palette.grey[400],
    marginLeft: 5,
  },
  text: {
    color: theme.palette.grey[400],
    marginRight: 5,
  },
}));

const CompletionNptFeedItem = ({
  feedItem: {
    context: {
      completion_npt_event: {
        data: { comment = '', depth, end_time: endTime, start_time: startTime, type = '' },
      },
    },
  },
}) => {
  const classes = useStyles();
  const startTimePrepared = startTime ? moment.unix(startTime) : moment();

  const endTimePrepared = endTime ? moment.unix(endTime) : undefined;

  const duration =
    endTimePrepared && moment.duration(endTimePrepared - startTimePrepared).asHours();

  const depthConverted = convertValue(depth, 'length', 'ft');

  return (
    <Grid spacing={8} justify="flex-start" container>
      <Grid item className={classes.columnWithMargin}>
        <Typography variant="body2" className={classes.valueWrapper}>
          Type:&nbsp;
          <Typography
            variant="body2"
            data-testid={`${PAGE_NAME}_type`}
            component="span"
            className={classes.highlightedText}
          >
            {type}
          </Typography>
        </Typography>
        <Typography variant="body2">Duration:</Typography>
        <Typography variant="body2" className={classes.valueWrapper}>
          <Typography
            data-testid={`${PAGE_NAME}_duration`}
            component="span"
            variant="h6"
            className={classes.highlightedText}
          >
            {(Number.isFinite(duration) && duration.toFixed(2)) || '-'}
          </Typography>
          {duration && (
            <Typography
              data-testid={`${PAGE_NAME}_durationUnits`}
              component="span"
              variant="caption"
              className={classes.unit}
            >
              (hrs)
            </Typography>
          )}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_startTime`}
          className={classes.valueWrapper}
        >
          <Typography variant="body2" component="span" className={classes.text}>
            Start Time:
          </Typography>
          {startTimePrepared.format(TIME_FORMAT)}
        </Typography>
        <Typography
          variant="body2"
          data-testid={`${PAGE_NAME}_depth`}
          className={classes.valueWrapper}
        >
          <Typography variant="body2" component="span" className={classes.text}>
            Depth:
          </Typography>
          {Number.isFinite(depthConverted) ? depthConverted.formatNumeral('0,0.00') : 'N/A'}
          <Typography component="span" variant="caption" className={classes.unit}>
            ({getUnitDisplay('length')})
          </Typography>
        </Typography>
        {comment && (
          <Typography
            variant="body2"
            data-testid={`${PAGE_NAME}_comment`}
            className={classes.valueWrapper}
          >
            <Typography variant="body2" component="span" className={classes.text}>
              Comment:
            </Typography>
            {comment}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

CompletionNptFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      completion_npt_event: PropTypes.shape({
        data: PropTypes.shape({
          comment: PropTypes.string.isRequired,
          depth: PropTypes.number.isRequired,
          end_time: PropTypes.number.isRequired,
          start_time: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CompletionNptFeedItem;
