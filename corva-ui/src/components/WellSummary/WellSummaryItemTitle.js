import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  labelRoot: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  labelIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  label: {
    color: '#9E9E9E',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 10,
    lineHeight: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
});

function WellSummaryItemTitle({ item }) {
  const classes = useStyles();

  return (
    <div className={classes.labelRoot}>
      {item.icon && (
        <div className={classes.labelIcon} style={{ backgroundImage: `url(${item.icon})` }} />
      )}
      <Typography className={classes.label}>{item.label}:</Typography>
    </div>
  );
}

WellSummaryItemTitle.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.node,
  }).isRequired,
};

export default WellSummaryItemTitle;
