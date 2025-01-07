import { FC, memo, ReactNode } from 'react';
import classNames from 'classnames';

import { Missing } from '@/constants';
import styles from './index.module.css';

type Props = {
  label: string;
  value: string | number;
  icon: ReactNode;
  unit?: string;
  className?: string;
};

export const CurrentDiMetaInfo: FC<Props> = memo(({ label, value, icon, unit, className }) => {
  return (
    <div className={classNames(styles.container, className)}>
      {icon}
      <p className={styles.label}>{label}:</p>
      {value !== Missing ? (
        <p className={styles.value}>{value}</p>
      ) : (
        <p className={styles.missing}>Missing</p>
      )}
      {value !== Missing && unit && <p className={styles.unit}>{unit}</p>}
    </div>
  );
});

CurrentDiMetaInfo.displayName = 'CurrentDiMetaInfo';
