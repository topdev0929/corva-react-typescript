import { FC, memo } from 'react';

import styles from './index.module.css';

type Props = {
  columns: string[];
};

export const TableHeader: FC<Props> = memo(({ columns }) => {
  return (
    <>
      {columns.map(column => (
        <p className={styles.headerTitle} key={column}>
          {column}
        </p>
      ))}
    </>
  );
});

TableHeader.displayName = 'TableHeader';
