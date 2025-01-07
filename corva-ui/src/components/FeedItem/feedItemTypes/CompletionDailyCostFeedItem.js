import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, makeStyles } from '@material-ui/core';

import blue from '@material-ui/core/colors/blue';

const PAGE_NAME = 'costsActivity';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'inline-block',
  },
  firstItem: {
    marginRight: 45,
  },
  unit: {
    color: theme.palette.grey[400],
    marginRight: 5,
    display: 'inline-block',
  },
  value: {
    color: blue[300],
    display: 'inline-block',
  },
}));

const CompletionDailyCostFeedItem = ({
  feedItem: {
    context: {
      completion_daily_cost: {
        data: { cost, cumulative_cost: cumulativeCost },
      },
    },
  },
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="body2" className={classNames(classes.item, classes.firstItem)}>
        Daily Cost:
        <br />
        <Typography component="span" variant="caption" className={classes.unit}>
          $
        </Typography>
        <Typography
          data-testid={`${PAGE_NAME}_dailyCost`}
          component="span"
          variant="h6"
          className={classes.value}
        >
          {Number.isFinite(cost) ? cost.formatNumeral('0,0.00') : 'N/A'}
        </Typography>
      </Typography>

      <Typography variant="body2" className={classes.item}>
        Cumulative Cost:
        <br />
        <Typography component="span" variant="caption" className={classes.unit}>
          $
        </Typography>
        <Typography
          data-testid={`${PAGE_NAME}_cumulativeCost`}
          component="span"
          variant="h6"
          className={classes.value}
        >
          {Number.isFinite(cumulativeCost) ? cumulativeCost.formatNumeral('0,0.00') : 'N/A'}
        </Typography>
      </Typography>
    </>
  );
};

CompletionDailyCostFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      completion_daily_cost: PropTypes.shape({
        data: PropTypes.shape({
          cost: PropTypes.number.isRequired,
          cumulative_cost: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CompletionDailyCostFeedItem;
