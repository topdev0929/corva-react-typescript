import moment from 'moment';
import { makeStyles } from '@material-ui/core';

import { useThrottledValue } from '@/effects/useThrottledValue';
import { MuiTheme } from '@/types/MuiTheme';
import { getLatencyColor } from './utils';

const useStyles = makeStyles((theme: MuiTheme) => ({
  latency: {
    color: theme.palette.success.bright,
  },
  container: {
    marginLeft: 16,
    fontSize: 12,
    color: theme.palette.primary.text6,
    fontWeight: 400,
  },
}));

type Props = {
  activityTimestamp: number;
  show: boolean;
};

const Latency = ({ activityTimestamp, show }: Props) => {
  const styles = useStyles();

  const delay = Date.now() - activityTimestamp * 1000;
  const formattedDelay = moment(delay).format('s.S');
  const debouncedDelay = useThrottledValue(formattedDelay, 1000);
  const color = getLatencyColor(+debouncedDelay);

  if (!show) {
    return null;
  }

  return (
    <div data-testId="streambox-latency" className={styles.container}>
      Latency ≈{' '}
      <span style={{ color }} className={styles.latency}>
        {debouncedDelay} s
      </span>
    </div>
  );
};

export default Latency;
