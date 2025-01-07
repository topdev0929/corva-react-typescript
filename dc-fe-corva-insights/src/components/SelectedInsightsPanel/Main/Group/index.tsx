import { FC } from 'react';

import { InsightsPerDay } from '@/entities/insight';

import { InsightsGroupItem } from './Item';
import styles from './index.module.css';

type Props = {
  insightsGroups: InsightsPerDay;
};

export const InsightsGroup: FC<Props> = ({ insightsGroups }) => {
  return (
    <div className={styles.container}>
      {Array.from(insightsGroups.entries()).map(([date, value]) => (
        <InsightsGroupItem key={date.toString()} insights={value.list} date={date} />
      ))}
    </div>
  );
};
