import PropTypes from 'prop-types';
import moment from 'moment';
import { startCase, round } from 'lodash';
import { Tooltip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  phaseTooltip: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px',
    '& div': {
      color: palette.primary.text1,
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  criticalTooltip: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '240px',
    padding: '4px',
    '& div': {
      color: palette.primary.text6,
      fontSize: '14px',
      lineHeight: '20px',
      paddingBottom: '8px',
    },
    '& span': {
      color: palette.primary.text1,
      fontSize: '12px',
      lineHeight: '20px',
    },
    '& > :last-child': {
      marginTop: '5px',
    },
  },
}));

export function PhaseTooltip({ data }) {
  const classes = useStyles();

  return (
    <Tooltip
      open
      title={
        <div className={classes.phaseTooltip}>
          <div>{data.phase.name}</div>
        </div>
      }
      placement="top-start"
      style={{
        position: 'absolute',
        left: data.x,
        top: data.y,
      }}
    >
      <div />
    </Tooltip>
  );
}

PhaseTooltip.propTypes = {
  data: PropTypes.shape({
    phase: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
      start_time: PropTypes.number,
      end_time: PropTypes.number,
      zone: PropTypes.number,
    }),
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
};

export function PointTooltip({ point }) {
  const classes = useStyles();

  return (
    <Tooltip
      open
      title={
        <div className={classes.criticalTooltip}>
          <div>{point.title}</div>
          <span>
            {point.timestamp}: {moment.unix(point.timestamp).format('h:mm:ss')}
          </span>
          <span>
            {startCase(point.trace)}: {round(point.top, 2)}
          </span>
          <span>Created by: {point.user?.name}</span>
        </div>
      }
      placement="top-start"
      style={{
        position: 'absolute',
        left: point.left + 12,
        top: point.top,
      }}
    >
      <div />
    </Tooltip>
  );
}

PointTooltip.propTypes = {
  point: PropTypes.shape({
    title: PropTypes.string,
    trace: PropTypes.string,
    timestamp: PropTypes.number,
    user: { name: PropTypes.string },
    left: PropTypes.number,
    top: PropTypes.number,
  }).isRequired,
};
