import { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import StraightenIcon from '@material-ui/icons/Straighten';

import ChartWrapperContext from '../ChartWrapperContext';

const DEFAULT_AXIS_SIZE = 14;
const TOOLTIP_MARGIN = 14;
const AXIS_OFFSET = 5;

const useStyles = makeStyles(theme => ({
  axis: ({ width, left, bottom, height }) => ({
    position: 'absolute',
    cursor: 'pointer',
    width,
    left,
    bottom,
    height,
  }),
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 125,
    backgroundColor: theme.palette.background.b9,
    color: theme.palette.text.primary,
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.4px',
    borderRadius: '4px',
    padding: '4px',
    zIndex: 10000,
  },
  tooltipIcon: {
    fontSize: 16,
    color: theme.palette.primary.text6,
  },
}));

const AxisOverlay = ({
  left,
  width,
  top,
  bottom,
  right,
  labelOffset,
  height,
  coll,
  onCustomizeScaleClick,
  ...otherProps
}) => {
  const { chart } = useContext(ChartWrapperContext);
  const [tooltipPosition, setTooltipPosition] = useState({});
  const axisRef = useRef();
  const isInvertedChart = chart?.inverted;
  const isXAxis = isInvertedChart ? coll === 'yAxis' : coll === 'xAxis';

  const tooltipMargin = TOOLTIP_MARGIN + labelOffset;
  const axisSize = DEFAULT_AXIS_SIZE + labelOffset;

  const classes = useStyles({
    top,
    right,
    width: isXAxis ? width + axisSize : axisSize,
    height: isXAxis ? axisSize : height + axisSize,
    left: isXAxis ? left - AXIS_OFFSET : left - axisSize,
    bottom: isXAxis ? bottom - axisSize : bottom - AXIS_OFFSET,
  });

  const axisPosition = axisRef.current?.getBoundingClientRect();

  const tooltip = (
    <div className={classes.tooltip}>
      <StraightenIcon className={classes.tooltipIcon} /> Customize Scale
    </div>
  );

  const handleTooltipMouseMove = ({ pageX, pageY }) => {
    setTooltipPosition({ x: pageX, y: pageY });
  };

  const hangleAxisMouseOver = () => {
    chart.update({
      [coll]: {
        lineColor: '#03BCD4',
        lineWidth: 2,
        labels: {
          style: {
            color: '#ffffff',
          },
        },
        title: {
          style: {
            color: '#ffffff',
          },
        },
      },
    });
  };

  const hangleAxisMouseLeave = () => {
    chart.update({
      [coll]: {
        lineColor: '#3B3B3B',
        lineWidth: 1,
        labels: {
          style: {
            color: '#9E9E9E',
          },
        },
        title: {
          style: {
            color: '#9E9E9E',
          },
        },
      },
    });
  };

  const getToolipBoundingClientRect = () => ({
    top: isXAxis ? axisPosition.y : tooltipPosition.y,
    left: isXAxis ? tooltipPosition.x : axisPosition.x - tooltipMargin,
    right: isXAxis ? tooltipPosition.x : axisPosition.x + tooltipMargin,
    bottom: isXAxis ? axisPosition.y : tooltipPosition.y,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const { axisGroup } = chart;
    if (axisGroup) axisGroup.element.style.cursor = 'pointer';
  }, [chart]);

  return (
    <Tooltip
      title={tooltip}
      placement={isXAxis ? 'top' : 'right'}
      onMouseMove={handleTooltipMouseMove}
      PopperProps={{
        anchorEl: {
          clientHeight: 0,
          clientWidth: 0,
          getBoundingClientRect: getToolipBoundingClientRect,
        },
      }}
    >
      <div
        className={classes.axis}
        ref={axisRef}
        onClick={() => onCustomizeScaleClick(otherProps)}
        onMouseOver={hangleAxisMouseOver}
        onMouseLeave={hangleAxisMouseLeave}
        onFocus={hangleAxisMouseOver}
        onBlur={hangleAxisMouseLeave}
      />
    </Tooltip>
  );
};

export default AxisOverlay;
