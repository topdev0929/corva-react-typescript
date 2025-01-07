import { FC, memo } from 'react';

import styles from './index.module.css';

type Props = {
  title: string;
};

export const TableRow: FC<Props> = memo(({ title, children }) => {
  return (
    <>
      <p className={styles.title}>{title}</p>
      {children}
    </>
  );
});

TableRow.displayName = 'TableRow';
