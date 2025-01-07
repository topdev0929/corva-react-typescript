import { FC, memo } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import { DateRange } from '@/shared/types';

import styles from './index.module.css';

type Props = {
  date: Date;
  range: DateRange | null;
  size?: 'medium' | 'large';
};

export const SelectedInsightsTitle: FC<Props> = memo(({ date, range, size = 'medium' }) => {
  const getDefaultDate = (date: moment.Moment) => {
    return date.format('MMMM DD, YYYY');
  };

  let parsedDate: string = getDefaultDate(moment(date));

  if (range) {
    const startDate = moment(range.start);
    const endDate = moment(range.end);
    const isSameDay = startDate.isSame(endDate, 'day');
    const isSameMonth = startDate.isSame(endDate, 'month');

    if (isSameDay) {
      parsedDate = getDefaultDate(startDate);
    } else if (isSameMonth) {
      parsedDate = `${startDate.format('MMMM')} ${startDate.format('DD/YYYY')} - ${endDate.format(
        'DD/YYYY'
      )}`;
    } else {
      parsedDate = `${startDate.format('MMM DD/YYYY')} - ${endDate.format('MMM DD/YYYY')}`;
    }
  }

  return <span className={classnames(styles.title, styles[size])}>{parsedDate}</span>;
});
