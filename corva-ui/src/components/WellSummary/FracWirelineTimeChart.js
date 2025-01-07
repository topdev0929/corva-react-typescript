import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { makeStyles, Typography } from '@material-ui/core';

import CircleGradientIcon from './assets/circle_gradient.svg';
import CircleGlowIcon from './assets/circle_glow.svg';

import { drawDonutSlice } from './utils';

const WIRELINE_COLOR = '#FF9C00';
const FRACTURING_COLOR = '#8572FF';

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
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    left: 0,
    top: 0,
  },
  timeRange: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: theme.palette.primary.text7,
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: '1px',
    position: 'absolute',
    top: 36,
  },
  time: { marginTop: 42 },
  timing: {
    fontFamily: 'Roboto',
    fontSize: 36,
    lineHeight: '24px',
    letterSpacing: 0.4,
    fontWeight: 300,
    color: theme.palette.background.b9,
  },
  wirelineText: { color: WIRELINE_COLOR },
  wirelineDot: { backgroundColor: WIRELINE_COLOR },
  fracturingText: { color: FRACTURING_COLOR },
  fracturingDot: { backgroundColor: FRACTURING_COLOR },
  legend: { marginTop: 24 },
  legendItem: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: '14px',
    letterSpacing: 0.4,
    display: 'flex',
    margin: '2px 0',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '100%',
    marginRight: 9,
  },
  chart: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: '100%',
    height: '100%',
    padding: '12px',
  },
  noData: {
    width: 90,
    height: 90,
  },
  noDataText: {
    marginTop: 24,
    color: '#9E9E9E',
    display: 'flex',
    justifyContent: 'center',
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

const HOURS_24 = 24 * 60 * 60;

function drawActivity(activityRef, centerX, centerY, radius, startPos, endPos, color, isRounded) {
  const ref = activityRef.current;
  if (ref) {
    ref.width = CANVAS_WH;
    ref.height = CANVAS_WH;
    ref.style.width = `${CANVAS_WH}px`;
    ref.style.height = `${CANVAS_WH}px`;

    const activityContext = ref.getContext('2d');

    drawDonutSlice(activityContext, centerX, centerY, radius, startPos, endPos, color, isRounded);
  }
}

function FracWirelineTimeChart({ wirelineTime, fracturingTime }) {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const wirelineRef = useRef(null);
  const fracingRef = useRef(null);

  const totalTime = HOURS_24;

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = CANVAS_WH;
    canvas.height = CANVAS_WH;
    canvas.style.width = `${CANVAS_WH}px`;
    canvas.style.height = `${CANVAS_WH}px`;

    const radius = CANVAS_WH / 2;
    const centerX = CANVAS_WH / 2;
    const centerY = CANVAS_WH / 2;

    const wirelineStartPos = ((wirelineTime * 60) / totalTime) * Math.PI * 2;
    const fracStartPos = wirelineStartPos + ((fracturingTime * 60) / totalTime) * Math.PI * 2;

    drawActivity(wirelineRef, centerX, centerY, radius, 0, wirelineStartPos, WIRELINE_COLOR, true);

    drawActivity(
      fracingRef,
      centerX,
      centerY,
      radius,
      wirelineStartPos,
      fracStartPos,
      FRACTURING_COLOR,
      true
    );
  });

  return (
    <div className={classes.root}>
      <div
        className={classnames(classes.backgroundRoot, {
          [classes.emptyStateBackground]: !wirelineTime || !fracturingTime,
        })}
      >
        <div className={classes.dropShadowRoot} />
      </div>

      <div className={classes.content}>
        <Typography className={classes.timeRange}>Previous 24hrs</Typography>
        {wirelineTime && fracturingTime ? (
          <>
            <div className={classes.time}>
              <Typography
                className={classnames(classes.timing, classes.wirelineText)}
                display="inline"
              >
                {(wirelineTime / 60).toFixed(1)}
              </Typography>
              <Typography className={classes.timing} display="inline">
                /
              </Typography>
              <Typography
                className={classnames(classes.timing, classes.fracturingText)}
                display="inline"
              >
                {(fracturingTime / 60).toFixed(1)}
              </Typography>
              <Typography display="inline"> h</Typography>
            </div>
            <div className={classes.legend}>
              <Typography className={classes.legendItem} display="inline">
                <div className={classnames(classes.dot, classes.wirelineDot)} /> Wireline
              </Typography>
              <Typography className={classes.legendItem} display="inline">
                <div className={classnames(classes.dot, classes.fracturingDot)} />
                Fracturing
              </Typography>
            </div>
          </>
        ) : (
          <div className={classes.noData}>
            <Typography className={classes.noDataText}>No Data</Typography>
          </div>
        )}
      </div>

      <div className={classes.chart}>
        <canvas ref={canvasRef} className={classes.canvas} />
        <canvas ref={wirelineRef} className={classes.activities} />
        <canvas ref={fracingRef} className={classes.activities} />
      </div>
    </div>
  );
}

FracWirelineTimeChart.propTypes = {
  wirelineTime: PropTypes.number,
  fracturingTime: PropTypes.number,
};

FracWirelineTimeChart.defaultProps = {
  wirelineTime: undefined,
  fracturingTime: undefined,
};

export default FracWirelineTimeChart;
