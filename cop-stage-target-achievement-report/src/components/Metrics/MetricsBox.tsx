import { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';

import { Theme } from '../../types';

const useStyles = makeStyles<Theme>(theme => ({
  boxContainer: {
    display: 'flex',
    height: 60,
    gap: 4,
    padding: '0px 8px 0px 12px',
    borderRadius: 5,
    background: 'rgba(39, 39, 39, 0.80)',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  line: {
    height: 12,
    width: 2,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
  },
  label: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    color: theme.palette.primary.text6,
    fontSize: 12,
    lineHeight: '16px',
  },
  unit: {
    color: theme.palette.primary.text6,
    fontSize: 12,
    lineHeight: '16px',
  },
  value: {
    color: theme.palette.primary.text1,
    fontSize: 18,
    lineHeight: '24px',
  },
}));

type MetricsBoxProps = {
  label: string;
  unit?: string;
  value: number;
};

const MetricsBox: FunctionComponent<MetricsBoxProps> = ({ label, unit, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.boxContainer}>
      <div className={classes.label}>
        <div className={classes.line} />
        {label}
      </div>
      <div className={classes.value}>
        {+value.toFixed(1)}
        {unit && <span className={classes.unit}> {unit}</span>}
      </div>
    </div>
  );
};

export default MetricsBox;
