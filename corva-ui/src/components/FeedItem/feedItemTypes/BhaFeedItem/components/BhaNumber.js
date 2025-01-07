import { oneOfType, number, string } from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

const useStyles = makeStyles({
  wrapper: { marginRight: 40 },
  bhaId: { color: blue[300] },
});

const BhaNumber = ({ bhaId, pageName }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2">BHA#:</Typography>
      <Typography data-testid={`${pageName}_bhaNumber`} variant="h6" className={classes.bhaId}>
        {bhaId}
      </Typography>
    </div>
  );
};

BhaNumber.propTypes = {
  bhaId: oneOfType([number, string]).isRequired,
  pageName: string.isRequired,
};

export default BhaNumber;
