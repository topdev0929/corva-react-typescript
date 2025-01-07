import { useTheme } from '@material-ui/core';
import { Left as LeftIcon, Right as RightIcon } from '@icon-park/react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { useCalendarStore } from '@/contexts/calendar';
import { Theme } from '@/shared/types';
import { VIEWS } from '@/constants';

import styles from './index.module.css';

export const MonthSelector = observer(() => {
  const theme = useTheme<Theme>();
  const store = useCalendarStore();

  return (
    <div className={styles.container}>
      <button
        data-testid={`${VIEWS.CALENDAR}_prevMonthBtn`}
        className={styles.button}
        onClick={() => store.setPreviousMonth()}
      >
        <LeftIcon size={20} fill={theme.palette.primary.main} />
      </button>
      <span className={styles.month}>{moment(store.selectedMonth).format('MMMM, YYYY')}</span>
      <button
        data-testid={`${VIEWS.CALENDAR}_nextMonthBtn`}
        className={classNames(styles.button, styles.right)}
        onClick={() => store.setNextMonth()}
      >
        <RightIcon size={20} fill={theme.palette.primary.main} />
      </button>
    </div>
  );
});

MonthSelector.displayName = 'MonthSelector';
