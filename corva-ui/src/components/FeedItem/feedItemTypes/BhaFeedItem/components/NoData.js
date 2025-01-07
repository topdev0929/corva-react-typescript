import { string } from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  noDataText: {
    color: theme.palette.grey[400],
    display: 'inline-block',
  },
  noDataIcon: {
    color: theme.palette.grey[400],
    marginRight: 10,
  },
}));

const NoDataMessage = ({ pageName }) => {
  const classes = useStyles();

  return (
    <div className="cBhaFeedItemNoDataMessage">
      <NotInterestedIcon className={classes.noDataIcon} />
      <Typography data-testid={`${pageName}_noData`} variant="body1" className={classes.noDataText}>
        Not enough data for BHA Schematic
      </Typography>
    </div>
  );
};

NoDataMessage.propTypes = {
  pageName: string.isRequired,
};

export default NoDataMessage;
