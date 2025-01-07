import { FC, useMemo } from 'react';

import { getFitInPercent } from '@/entities/optimization-parameter';

import { CellProps } from '../Table/types';
import styles from './index.module.css';

type Props = CellProps;

export const FitInChart: FC<Props> = ({ fitInParameters }) => {
  const fitInPercent = useMemo(() => getFitInPercent(fitInParameters), [fitInParameters]);

  return (
    <span className={styles.container}>
      <span className={styles.value} style={{ left: `${fitInPercent}%` }} />
    </span>
  );
};
