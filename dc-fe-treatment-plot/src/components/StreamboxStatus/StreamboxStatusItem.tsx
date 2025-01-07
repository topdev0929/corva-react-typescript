import { FunctionComponent, useEffect, useState } from 'react';
import { Tooltip, makeStyles } from '@material-ui/core';

import { MuiTheme } from '@/types/MuiTheme';
import { STREAM_TYPES, StreamType } from '@/types/Stream';

import Latency from './Latency';
import { getCurrentTimestamp, getStatusInfo, getTooltipTitle } from './utils';

const useStyles = makeStyles((theme: MuiTheme) => ({
  statusContainer: {
    marginRight: 16,
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
  },
  statusTag: {
    display: 'inline-block',
    marginLeft: 4,
    padding: '1px 8px',
    borderRadius: 10,
    color: theme.palette.background.b2,
    fontWeight: 500,
    fontSize: 10,
    lineHeight: 1,
    letterSpacing: 0.4,
    cursor: 'default',
  },
}));

type StreamboxStatusItemProps = {
  activityTimestamp: number;
  streamIndex: number;
  streamType: StreamType;
};

const StreamboxStatusItem: FunctionComponent<StreamboxStatusItemProps> = ({
  activityTimestamp,
  streamIndex,
  streamType,
}) => {
  const [, setState] = useState({});
  const styles = useStyles();
  const currentTimestamp = getCurrentTimestamp();
  const delay = currentTimestamp - activityTimestamp;

  const { color, isLive, label } = getStatusInfo(delay);

  useEffect(() => {
    const interval = setInterval(() => setState({}), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const showLatency = isLive && streamType === STREAM_TYPES.frac;

  return (
    <div className={styles.statusContainer}>
      {streamType} #{streamIndex}
      <Tooltip title={getTooltipTitle(activityTimestamp, delay)}>
        <span className={styles.statusTag} style={{ backgroundColor: color }}>
          {label}
        </span>
      </Tooltip>
      <Latency show={showLatency} activityTimestamp={activityTimestamp} />
    </div>
  );
};

export default StreamboxStatusItem;
