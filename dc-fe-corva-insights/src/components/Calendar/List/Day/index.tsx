import { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { IconButton } from '@corva/ui/components';
import { Comment as CommentIcon } from '@icon-park/react';

import { getUniqueInsightTiles, InsightsPerDayValue } from '@/entities/insight';
import { VIEWS } from '@/constants';

import { IconWithBadge } from '../IconWithBadge';
import { InsightTiles } from '../InsightTiles';
import styles from './index.module.css';

type Props = {
  date: Date;
  insightsPerDay: InsightsPerDayValue;
  onClick: () => void;
  isSelected?: boolean;
  isInRange?: boolean;
  isToday?: boolean;
  isStartOfTheMonth?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export const CalendarDay: FC<Props> = ({
  date,
  insightsPerDay,
  isSelected,
  isInRange,
  isToday,
  isStartOfTheMonth,
  onClick,
  size = 'large',
}) => {
  let testId = `${VIEWS.CALENDAR}_day_${moment(date).format('DD-MM-YYYY')}`;
  if (isInRange) testId = `${testId}_isSelectedRange`;
  if (isSelected) testId = `${testId}_isSelectedDay`;
  if (isToday) testId = `${testId}_isToday`;

  return (
    <div
      className={classNames(styles.container, {
        [styles.isSelected]: isSelected,
        [styles.isToday]: isToday,
        [styles.isInRange]: isInRange,
        [styles.isMedium]: size === 'medium',
        [styles.isSmall]: size === 'small',
      })}
      onClick={onClick}
      data-testid={testId}
    >
      {isStartOfTheMonth && (
        <span className={styles.month}>{date.toLocaleString('en-US', { month: 'long' })}</span>
      )}
      <div className={styles.header}>
        <p className={styles.date}>{date.getDate()}</p>
        {size === 'large' && (
          <IconWithBadge badge={insightsPerDay.commentsNumber}>
            <IconButton
              tooltipProps={{ title: 'Comments per day' }}
              data-testid={`${testId}_commentsNumberBtn`}
              size="small"
            >
              <CommentIcon />
            </IconButton>
          </IconWithBadge>
        )}
      </div>
      <InsightTiles
        tiles={getUniqueInsightTiles(insightsPerDay.list)}
        minimized={size === 'small'}
        testId={testId}
      />
    </div>
  );
};
