import { observer } from 'mobx-react-lite';
import { FC, useRef } from 'react';

import { useCalendarStore } from '@/contexts/calendar';
import { useFiltersStore } from '@/contexts/filters';
import { useGlobalStore } from '@/contexts/global';
import { ListWithGradient } from '@/shared/components/ListWithGradient';
import { isDayInRange, isSameDay, isToday } from '@/shared/utils';

import { CalendarDay } from './Day';
import { useDaySize } from './useDaySize';
import styles from './index.module.css';

const FIRST_DAY_OF_THE_MONTH = 1;

type Props = {
  maxHeight: string;
};

export const CalendarList: FC<Props> = observer(({ maxHeight }) => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();
  const store = useCalendarStore();

  const listRef = useRef<HTMLDivElement | null>(null);

  const daySize = useDaySize(listRef);

  const onDayClick = (date: Date) => {
    filtersStore.setSelectedDay(date);
    globalStore.openFullscreenInsightsDetails();
  };

  return (
    <ListWithGradient style={{ maxHeight }} listClassName={styles.list} ref={listRef}>
      {[...store.insightsPerDay.entries()].map(([date, value]) => (
        <CalendarDay
          key={date.getTime()}
          date={date}
          onClick={() => onDayClick(date)}
          insightsPerDay={value}
          isSelected={isSameDay(date, filtersStore.selectedDay)}
          isInRange={
            !!filtersStore.range &&
            isDayInRange(date, filtersStore.range.start, filtersStore.range.end)
          }
          isToday={isToday(date)}
          isStartOfTheMonth={date.getDate() === FIRST_DAY_OF_THE_MONTH}
          size={daySize}
        />
      ))}
    </ListWithGradient>
  );
});

CalendarList.displayName = 'CalendarList';
