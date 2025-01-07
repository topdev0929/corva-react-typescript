/* eslint-disable react/prop-types */
import { isEmpty } from 'lodash';

import { Chip, makeStyles } from '@material-ui/core';

import { useWellStreamActivityTypeSubscription } from './effects/useWellStreamActivityTypeSubscription';
import { AssetStreamStatus } from './types';

const useStyles = makeStyles((theme: any) => ({
  chipRoot: {
    '&.MuiChip-root': {
      height: 12,
      padding: '2px 8px',
      fontSize: 10,
      backgroundColor: `${theme.palette.success.bright} !important`,
      marginLeft: 4,
      '&:hover': {
        '& .MuiChip-label': {
          color: theme.palette.background.b1,
        },
      },

      '& .MuiChip-label': {
        color: theme.palette.background.b1,
        padding: 0,
        fontWeight: 500,

        '&:hover': {
          color: theme.palette.background.b1,
        },
      },
    },
  },
}));

const WellStreamActivityStatus = props => {
  const { isStatusShown, currentWellId, subData } = props;
  const styles = useStyles();

  const streamsData: AssetStreamStatus = useWellStreamActivityTypeSubscription({
    currentWellId,
    isStatusShown,
  });

  const data = subData || streamsData;

  if (!isStatusShown || !currentWellId) {
    return null;
  }

  if (isEmpty(data)) return null;

  return (
    <Chip label={data?.streamType?.toUpperCase()} classes={{ root: styles.chipRoot }} />
  );
};

export default WellStreamActivityStatus;
