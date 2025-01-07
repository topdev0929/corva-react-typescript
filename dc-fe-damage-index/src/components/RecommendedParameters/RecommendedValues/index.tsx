import { FC } from 'react';

import { formatNumber } from '@/shared/utils';

import { CellProps } from '../Table/types';
import styles from './index.module.css';

type Props = CellProps;

export const RecommendedValues: FC<Props> = ({ fitInParameters }) => {
  return (
    <span className={styles.values}>
      {formatNumber(fitInParameters.min)} - {formatNumber(fitInParameters.max)}
    </span>
  );
};
