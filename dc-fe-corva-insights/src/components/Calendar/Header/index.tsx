import { MonthSelector } from '@/components/Calendar/Header/MonthSelector';
import { WeekDays } from '@/components/Calendar/Header/WeekDays';

import styles from './index.module.css';

export const CalendarHeader = () => {
  return (
    <div className={styles.container}>
      <MonthSelector />
      <WeekDays />
    </div>
  );
};
