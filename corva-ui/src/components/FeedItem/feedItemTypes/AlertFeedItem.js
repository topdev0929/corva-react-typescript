import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router';

import TimelineIcon from '@material-ui/icons/Timeline';

const useStyles = makeStyles(theme => ({
  alertContanier: {
    display: 'inline-block',
    width: 'calc(100% - 35px)',
  },
  timlineIconRoot: {
    verticalAlign: 'bottom',
    marginRight: 15,
  },
  timelineText: {
    color: theme.palette.grey[400],
  },
  item: {
    color: '#fff',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const AlertFeedItem = ({
  feedItem: {
    context: {
      alert: { id, name, description, decision_path: desicionPath },
    },
  },
}) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.alertContanier}>
        <Typography variant="body1">
          <Link className={classes.item} to={`/alerts/${id}/`}>
            {name}
          </Link>
        </Typography>

        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>

        <Typography variant="body1" className={classes.timelineText}>
          <TimelineIcon className={classes.timlineIconRoot} color="action" />
          {desicionPath}
        </Typography>
      </div>
    </div>
  );
};

AlertFeedItem.propTypes = {
  feedItem: PropTypes.shape({
    context: PropTypes.shape({
      alert: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        decision_path: PropTypes.string.isRequired,
        level: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default AlertFeedItem;
