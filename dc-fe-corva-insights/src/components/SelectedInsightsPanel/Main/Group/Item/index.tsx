import { FC } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { observer } from 'mobx-react-lite';

import { Insight } from '@/entities/insight';

import { InsightsList } from '../../List';
import { useSideEffects } from './useSideEffects';
import styles from './index.module.css';

type Props = {
  insights: Insight[];
  date: Date;
  isSelected?: boolean;
};

export const InsightsGroupItem: FC<Props> = observer(({ insights, date }) => {
  const { isSameDateSelected, elRef } = useSideEffects(date);

  return (
    <div className={styles.container} ref={elRef}>
      <p className={classnames(styles.date, { [styles.isSelected]: isSameDateSelected })}>
        {moment(date).format('DD MMM')}
      </p>
      <InsightsList insights={insights} date={date} />
    </div>
  );
});

InsightsGroupItem.displayName = 'InsightsGroupItem';
