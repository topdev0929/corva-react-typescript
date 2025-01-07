import { IconButton } from '@corva/ui/components';
import { makeStyles } from '@material-ui/core';
import { FC } from 'react';
import { FullScreen as FullScreenIcon } from '@icon-park/react';

import { DateRange } from '@/shared/types';
import { VIEWS } from '@/constants';

import { SelectedInsightsTitle } from '../Title';
import styles from './index.module.css';

const useStyles = makeStyles({
  fullScreen: {
    position: 'absolute',
    right: 12,
  },
});

type Props = {
  date: Date;
  range: DateRange | null;
  onExpand: () => void;
};

export const SelectedDayHeader: FC<Props> = ({ date, range, onExpand }) => {
  const classes = useStyles();

  const handleExpand = event => {
    event.stopPropagation();
    onExpand();
  };

  return (
    <div className={styles.container}>
      <SelectedInsightsTitle range={range} date={date} />
      <IconButton
        data-testid={`${VIEWS.DAY_PANEL}_fullscreenBtn`}
        className={classes.fullScreen}
        onClick={handleExpand}
        tooltipProps={{ title: 'Full Screen' }}
      >
        <FullScreenIcon size={24} />
      </IconButton>
    </div>
  );
};
