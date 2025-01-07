import { FC, PropsWithChildren } from 'react';
import { Counter } from '@corva/ui/components';

import styles from './index.module.css';

type Props = {
  badge: number;
};

export const IconWithBadge: FC<PropsWithChildren<Props>> = ({ badge, children }) => {
  return (
    <div className={styles.container}>
      {children}
      <Counter size="small" label={badge.toString()} className={styles.badge} />
    </div>
  );
};
