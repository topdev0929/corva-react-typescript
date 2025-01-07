import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: theme.spacing(1) / 2,
  },
  formationItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  label: {
    color: theme.palette.primary.text6,
    fontSize: '10px',
    marginLeft: theme.spacing(1),
  },
}));

function FormationsLegend({ formations, formationColors }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {formations.map(formation => (
        <div key={formation} className={classes.formationItem}>
          <div className={classes.marker} style={{ backgroundColor: formationColors[formation] }} />
          <Typography className={classes.label}>{formation}</Typography>
        </div>
      ))}
    </div>
  );
}

FormationsLegend.propTypes = {
  formations: PropTypes.arrayOf(PropTypes.string).isRequired,
  formationColors: PropTypes.shape({}).isRequired,
};

export default FormationsLegend;
