import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    fontSize: '11px',
    lineHeight: '16px',
    color: '#BDBDBD',
    marginBottom: '4px',
  },
  content: {
    fontSize: '11px',
    lineHeight: '16px',
    color: '#FFFFFF',
  },
});
function CounterTooltip(props) {
  const { series } = props;
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.title}>{`${series.length} Channels Plotted:`}</Typography>
      {series.map(item => (
        <Typography key={item.key} className={classes.content}>
          {item.name}
        </Typography>
      ))}
    </>
  );
}

CounterTooltip.propTypes = {
  series: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CounterTooltip;
