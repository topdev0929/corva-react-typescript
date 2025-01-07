import { shape, string } from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

import blue from '@material-ui/core/colors/blue';

import { getUnitDisplay } from '~/utils/convert';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: '5%',
  },
  predictionItem: {
    color: blue[300],
  },
  unit: {
    display: 'inline',
    color: theme.palette.grey[400],
    marginLeft: 5,
  },
}));

const PredictionsItem = ({ title, fieldName, predictionsData }) => {
  const classes = useStyles();

  if (!predictionsData) return null;

  const itemValue = predictionsData[fieldName];

  if (!itemValue) return null;

  return (
    <li className={classes.wrapper}>
      <Typography variant="subtitle2">
        {title}
        <Typography className={classes.unit} variant="caption">
          ({getUnitDisplay('pressure')})
        </Typography>
      </Typography>
      <Typography variant="h6" className={classes.predictionItem}>
        {Number.isFinite(itemValue) ? parseFloat(itemValue.toFixed(0)) : itemValue}
      </Typography>
    </li>
  );
};

PredictionsItem.propTypes = {
  title: string.isRequired,
  fieldName: string.isRequired,
  predictionsData: shape().isRequired,
};

export default PredictionsItem;
