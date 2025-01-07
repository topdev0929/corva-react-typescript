import { FC } from 'react';

import styles from './index.module.css';

type Props = {
  label: string;
  value: string;
};

export const SpecificType: FC<Props> = ({ label, value }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
};
