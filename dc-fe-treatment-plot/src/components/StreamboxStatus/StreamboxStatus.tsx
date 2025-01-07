import { FunctionComponent } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import { MuiTheme } from '@/types/MuiTheme';
import StreamboxStatusItem from './StreamboxStatusItem';
import { AssetStreamStatus } from '@/types/Stream';

const useStyles = makeStyles((theme: MuiTheme) => ({
  streamboxStatusContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
    flexWrap: 'wrap',
    rowGap: 8,
  },
  title: {
    marginRight: 8,
    fontSize: 12,
    color: theme.palette.primary.text6,
  },
}));

type StreamboxStatusProps = {
  streamsData: AssetStreamStatus[];
  className?: string;
};

const StreamboxStatus: FunctionComponent<StreamboxStatusProps> = ({ streamsData, className }) => {
  const styles = useStyles();

  return (
    <>
      {streamsData.length > 0 && (
        <div className={classNames(styles.streamboxStatusContainer, className)}>
          <div className={styles.title}>Streambox Status</div>
          {streamsData.map(({ wellId, streamType, activityTimestamp, index }) => (
            <StreamboxStatusItem
              key={`${wellId}-${streamType}`}
              activityTimestamp={activityTimestamp}
              streamIndex={index}
              streamType={streamType}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default StreamboxStatus;
