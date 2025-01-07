import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, createRef, useState } from 'react';
import classNames from 'classnames';
import { makeStyles, Typography, Tooltip } from '@material-ui/core';
import { sumBy, upperFirst } from 'lodash';
import { Regular14 } from '~/components/Typography';

import { drawDonutSlice, drawRadicalGradient } from './utils';

import CircleGradientIcon from './assets/circle_gradient.svg';
import CircleGlowIcon from './assets/circle_glow.svg';

const useStyles = makeStyles(theme => ({
  root: {
    width: '228px',
    height: '228px',
    borderRadius: '50%',
    padding: '6px',
    position: 'relative',
    background: `url(${CircleGradientIcon})`,
    backgroundRepeat: 'no-repeat',
  },
  backgroundRoot: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '2px solid #616161',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: `url(${CircleGlowIcon})`,
  },
  emptyStateBackground: {
    background:
      'radial-gradient(50% 50% at 50% 50%, rgba(100, 181, 246, 0) 54.4%, rgba(100, 181, 246, 0.01) 76.49%, rgba(100, 181, 246, 0.06) 100%)',
  },
  dropShadowRoot: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    filter: 'blur(36px)',
    border: '2px solid #64B5F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: ({ activitiesLength }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    left: 0,
    top: activitiesLength ? 40 : 57,
  }),
  lastActivityRoot: {
    width: '90px',
    height: '90px',
    background: '#3B3B3B',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1), inset 0px 1px 1px rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '8px 0',
  },
  activityDuration: {
    marginTop: '9px',
    color: theme.palette.primary.text1,
    fontSize: '36px',
    lineHeight: '24px',
    fontWeight: 300,
    letterSpacing: '0.4px',
  },
  durationUnit: {
    fontSize: '12px',
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: '0.4px',
  },
  activityTimeRange: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: '#9E9E9E',
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: '1px',
  },
  activityName: {
    width: '106px',
    textAlign: 'center',
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: 500,
    letterSpacing: '0.4px',
    color: theme.palette.primary.text1,
  },
  noOperationsRoot: {
    width: 90,
    height: 90,
  },
  noOperationsText: {
    marginTop: 24,
    color: '#9E9E9E',
  },
  chart: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: '100%',
    height: '100%',
    padding: '12px',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  activities: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
}));

const CANVAS_WH = 200;

function ActivitySummaryChart({ title, currentActivityName, activities, showTooltip }) {
  const classes = useStyles({ activitiesLength: activities.length });
  const canvasRef = useRef(null);
  const activitiesRef = useRef([]);
  const [tooltipId, setTooltipId] = useState(null);
  const availableActivities = useMemo(() => {
    return activities.filter(activity => activity.duration);
  }, [activities]);

  const totalTime = useMemo(() => sumBy(activities, 'duration'), [activities]);
  const currentActivity = useMemo(() => {
    return tooltipId === null
      ? activities.find(item => item.name === currentActivityName)
      : availableActivities[tooltipId];
  }, [activities, currentActivityName, availableActivities, tooltipId]);

  const handleMouseMove = e => {
    let innerPoint = false;
    activitiesRef.current.forEach((ref, index) => {
      const activityRef = ref.current;
      if (!activityRef) return;
      if (innerPoint) return;
      const activityContext = activityRef.getContext('2d');

      innerPoint = activityContext.isPointInPath(e.offsetX, e.offsetY);
      if (innerPoint) setTooltipId(index);
    });
    if (!innerPoint) setTooltipId(null);
  };

  const handleMouseLeave = () => {
    setTooltipId(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = CANVAS_WH;
    canvas.height = CANVAS_WH;
    canvas.style.width = `${CANVAS_WH}px`;
    canvas.style.height = `${CANVAS_WH}px`;

    const radius = CANVAS_WH / 2;
    const centerX = CANVAS_WH / 2;
    const centerY = CANVAS_WH / 2;

    const activitiesLength = availableActivities.length;
    if (activitiesRef.current.length !== activitiesLength) {
      // add or remove refs
      activitiesRef.current = Array(activitiesLength)
        .fill()
        .map((_, i) => activitiesRef.current[i] || createRef());
    }

    let prevEndAngle = 0;
    availableActivities.forEach((activity, index) => {
      const startAngle = prevEndAngle;
      const endAngle = startAngle + (activity.duration / totalTime) * Math.PI * 2;
      if ((tooltipId === null && activity.name === currentActivityName) || index === tooltipId) {
        drawRadicalGradient(context, centerX, centerY, radius, startAngle, endAngle);
      }
      const activityRef = activitiesRef.current[index].current;
      if (activityRef) {
        activityRef.width = CANVAS_WH;
        activityRef.height = CANVAS_WH;
        activityRef.style.width = `${CANVAS_WH}px`;
        activityRef.style.height = `${CANVAS_WH}px`;
        if (showTooltip) {
          activityRef.onmousemove = handleMouseMove;
          activityRef.onmouseleave = handleMouseLeave;
        }
        const activityContext = activityRef.getContext('2d');

        drawDonutSlice(
          activityContext,
          centerX,
          centerY,
          radius,
          startAngle,
          endAngle,
          activity.color || '#000000',
          true
        );
      } else
        drawDonutSlice(
          context,
          centerX,
          centerY,
          radius,
          startAngle,
          endAngle,
          activity.color || '#000000',
          true
        );

      prevEndAngle = endAngle;
    });
  });

  return (
    <div className={classes.root}>
      <div
        className={classNames(classes.backgroundRoot, {
          [classes.emptyStateBackground]: !activities.length,
        })}
      >
        <div className={classes.dropShadowRoot} />
      </div>

      <div className={classes.content}>
        <Typography className={classes.activityTimeRange}>{title}</Typography>
        {activities.length ? (
          <>
            <div className={classes.lastActivityRoot}>
              {currentActivity && currentActivity.duration ? (
                <Typography className={classes.activityDuration}>
                  {(currentActivity.duration / 3600).toFixed(1)}
                  <span className={classes.durationUnit}>{' h'}</span>
                </Typography>
              ) : null}
            </div>
            <Typography className={classes.activityName}>
              {upperFirst(currentActivity?.name || '')}
            </Typography>
          </>
        ) : (
          <div className={classes.noOperationsRoot}>
            <Regular14 className={classes.noOperationsText}>No operations</Regular14>
          </div>
        )}
      </div>

      <Tooltip
        title={
          tooltipId !== null
            ? `${availableActivities[tooltipId].name}: ${(
                availableActivities[tooltipId].duration / 3600
              ).toFixed(3)}h`
            : ''
        }
        placement="bottom"
      >
        <div className={classes.chart}>
          <canvas ref={canvasRef} className={classes.canvas} />
          {availableActivities.map((activity, index) => (
            <canvas ref={activitiesRef.current[index]} className={classes.activities} />
          ))}
        </div>
      </Tooltip>
    </div>
  );
}

ActivitySummaryChart.propTypes = {
  title: PropTypes.string,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      day: PropTypes.number,
      night: PropTypes.number,
    })
  ).isRequired,
  currentActivityName: PropTypes.string.isRequired,
  showTooltip: PropTypes.bool,
};

ActivitySummaryChart.defaultProps = {
  title: 'Last 24hrs',
  showTooltip: false,
};

export default ActivitySummaryChart;
