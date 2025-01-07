import { FunctionComponent } from 'react';
import { makeStyles, LinearProgress } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    width: '80%',
    textAlign: 'center',
  },
});

const CalculationLoading: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.progress}>
        <p>Recalculating ...</p>
        <LinearProgress variant="indeterminate" />
      </div>
    </div>
  );
};

export default CalculationLoading;
