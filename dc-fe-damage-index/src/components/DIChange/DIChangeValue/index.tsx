import { FC, memo } from 'react';

import styles from './index.module.css';

type Props = {
  label: string;
  value: number;
};

export const DIChangeValue: FC<Props> = memo(({ label, value }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
});

DIChangeValue.displayName = 'DIChangeValue';
