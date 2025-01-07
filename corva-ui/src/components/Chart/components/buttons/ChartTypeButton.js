import { useContext, useState } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import BarChartIcon from '@material-ui/icons/BarChart';
import ChartButton from '../ChartButton';
import ChartWrapperContext from '../../ChartWrapperContext';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    display: 'flex',
    marginRight: 4,
    '&:hover $button': {
      background: 'red !important',
    },
  },
  lineChartButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,

    '&:active': {
      background: palette.background.b7,
    },
  },
  barChartButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 0,

    '&:active': {
      background: palette.background.b7,
    },
  },
  hoveredContainer: {
    background: palette.background.b7,
  },
}));

const CHART_TYPES = {
  spline: 'spline',
  bar: 'bar',
};

const ChartTypeButton = ({ className, onClick }) => {
  const { chartType, handleChartTypeChange } = useContext(ChartWrapperContext);
  const [isContainerHovered, setIsContainerHovered] = useState(false);

  const handleContainerMouseEnter = () => {
    setIsContainerHovered(true);
  };

  const handleContainerMouseLeave = () => {
    setIsContainerHovered(false);
  };

  const styles = useStyles();

  return (
    <div
      className={classNames(styles.container, className)}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      <ChartButton
        className={classNames(
          styles.lineChartButton,
          isContainerHovered && styles.hoveredContainer
        )}
        tooltipProps={{ title: 'Line Chart', placement: 'bottom' }}
        isActive={chartType === CHART_TYPES.spline}
        onClick={() => {
          handleChartTypeChange(CHART_TYPES.spline);
          onClick(CHART_TYPES.spline);
        }}
      >
        <TimelineIcon />
      </ChartButton>
      <ChartButton
        className={classNames(styles.barChartButton, isContainerHovered && styles.hoveredContainer)}
        tooltipProps={{ title: 'Bar Chart', placement: 'bottom' }}
        isActive={chartType === CHART_TYPES.bar}
        onClick={() => {
          handleChartTypeChange(CHART_TYPES.bar);
          onClick(CHART_TYPES.bar);
        }}
      >
        <BarChartIcon />
      </ChartButton>
    </div>
  );
};

ChartTypeButton.defaultProps = {
  onClick: () => {},
  isHidden: false,
};

export default ChartTypeButton;
