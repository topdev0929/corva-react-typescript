import { FunctionComponent } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import { Theme } from '../types';

const useStyles = makeStyles<Theme>(theme => ({
  container: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  label: {
    color: theme.palette.primary.text6,
    fontSize: 11,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  target: {
    background: theme.palette.success.bright,
  },
  pressure: {
    background: theme.palette.warning.main,
  },
  planned: {
    background: theme.palette.background.b8,
  },
  require: {
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

const Legend: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classNames(classes.target, classes.circle)} />
      <span className={classes.label}>On Target</span>
      <div className={classNames(classes.pressure, classes.circle)} />
      <span className={classes.label}>Pressure Limited</span>
      <div className={classNames(classes.planned, classes.circle)} />
      <span className={classes.label}>Planned</span>
      <div className={classNames(classes.require, classes.circle)} />
      <span className={classes.label}>Require Attention</span>
    </div>
  );
};

export default Legend;
