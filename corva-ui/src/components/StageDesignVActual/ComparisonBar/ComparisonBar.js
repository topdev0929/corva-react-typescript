import { number, bool } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import { getDifference, getIsGreaterThanTenPercent } from '~/utils/StageDesignVActualUtils';

import { getBarPercents } from './utils';

const useStyles = makeStyles(theme => ({
  barContainer: {
    position: 'relative',
    height: '24px',
    width: '100%',
  },
  designBar: ({ designBarPercent }) => ({
    position: 'absolute',
    background: '#2BCCFF',
    opacity: 0.2,
    top: '4px',
    bottom: '4px',
    width: `${designBarPercent}%`,
    borderRadius: '2px',
  }),
  actualBar: ({ showWarning, actualBarPercent }) => ({
    position: 'absolute',
    background: showWarning ? 'linear-gradient(to right, #2BCCFF , #F44336)' : '#2BCCFF',
    top: '8px',
    bottom: '8px',
    width: `${actualBarPercent}%`,
    borderRadius: '2px',
  }),
  emptyBar: {
    position: 'absolute',
    top: '4px',
    bottom: '4px',
    width: '100%',
    borderRadius: '2px',
    background: theme.isLightTheme ? '#e2e2e2' : '#484848',
  },
}));

const ComparisonBar = ({ designVal, actualVal, isCalcMode }) => {
  const { designBarPercent, actualBarPercent } = getBarPercents(designVal, actualVal);

  const difference = getDifference(designVal, actualVal);

  const isGreaterThanTenPercent = getIsGreaterThanTenPercent(difference);

  // NOTE: If view mode is calc and actual value comes from prediction summary,
  // we should only show warning for the actual value which is greater than design amount
  const showWarning = isCalcMode ? actualVal > designVal : isGreaterThanTenPercent;

  const classes = useStyles({ showWarning, designBarPercent, actualBarPercent });

  return (
    <div className={classes.barContainer}>
      {!designVal && !actualVal && <div className={classes.emptyBar} />}
      <div className={classes.designBar} />
      <div className={classes.actualBar} />
    </div>
  );
};

ComparisonBar.propTypes = {
  designVal: number,
  actualVal: number,
  isCalcMode: bool,
};

ComparisonBar.defaultProps = {
  designVal: undefined,
  actualVal: undefined,
  isCalcMode: false,
};

export default ComparisonBar;
