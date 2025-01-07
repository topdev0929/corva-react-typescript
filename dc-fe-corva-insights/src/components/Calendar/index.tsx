import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { useGlobalStore } from '@/contexts/global';
import { APP_SIZE } from '@/shared/types';

import { CalendarList } from './List';
import { Legend } from './Legend';
import { CalendarHeader } from './Header';
import { useListMaxHeight } from './useListMaxHeight';
import styles from './index.module.css';

export const Calendar = observer(() => {
  const globalStore = useGlobalStore();

  const legendRef = useRef<HTMLDivElement | null>(null);
  const listMaxHeight = useListMaxHeight(legendRef);

  return (
    <div
      className={classnames(styles.container, {
        [styles.isMobile]: globalStore.appSize !== APP_SIZE.DESKTOP,
      })}
    >
      <CalendarHeader />
      <CalendarList maxHeight={listMaxHeight} />
      <Legend ref={legendRef} />
    </div>
  );
});

Calendar.displayName = 'Calendar';
