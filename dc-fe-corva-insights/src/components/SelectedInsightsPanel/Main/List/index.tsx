import { FC } from 'react';
import moment from 'moment';

import { Insight } from '@/entities/insight';
import { VIEWS } from '@/constants';

import { InsightItem } from '../Item';

type Props = {
  insights: Insight[];
  date: Date;
};

export const InsightsList: FC<Props> = ({ insights, date }) => {
  return (
    <>
      {insights.map((insight, index) => (
        <InsightItem
          insight={insight}
          key={insight.id}
          testId={`${VIEWS.DAY_PANEL}_feed_${moment(date).format('DD-MM-YYYY')}_${index}`}
        />
      ))}
    </>
  );
};
