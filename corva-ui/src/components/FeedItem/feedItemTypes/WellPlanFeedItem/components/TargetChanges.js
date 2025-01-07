import { shape, number } from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

import { getUnitDisplay } from '~/utils/convert';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
  },
  targetLabel: {
    color: theme.palette.grey[400],
    marginRight: 10,
  },
  targetValue: {
    marginRight: 15,
  },
}));

const TargetChanges = ({ targetChanges }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography variant="body2" gutterBottom>
        Target Changes:
      </Typography>
      <div className={classes.wrapper}>
        <Typography variant="body2" className={classes.targetLabel}>
          MD:
        </Typography>
        <Typography variant="body2" className={classes.targetValue}>
          {`${targetChanges.measured_depth || 0} (${getUnitDisplay('length')})`}
        </Typography>

        <Typography variant="body2" className={classes.targetLabel}>
          Vertical Section:
        </Typography>
        <Typography variant="body2" className={classes.targetValue}>
          {`${targetChanges.vertical_section || 0} (${getUnitDisplay('length')})`}
        </Typography>

        <Typography variant="body2" className={classes.targetLabel}>
          TVD Change:
        </Typography>
        <Typography variant="body2" className={classes.targetValue}>
          {`${targetChanges.tvd_change || 0} (${getUnitDisplay('length')})`}
        </Typography>
      </div>
    </div>
  );
};

TargetChanges.propTypes = {
  targetChanges: shape({
    measured_depth: number,
    vertical_section: number,
    tvd_change: number,
  }),
};

TargetChanges.defaultProps = {
  targetChanges: {},
};

export default TargetChanges;
