import { ReactNode } from 'react';
import { LoadingIndicator } from '@corva/ui/components';
import { useTheme } from '@material-ui/core';

import { Theme } from '@/shared/types';

import styles from './index.module.css';

type Props<Data> = {
  isLoading: boolean;
  isEmpty?: boolean;
  children: ((data: Data) => ReactNode) | ReactNode;
  data?: Data | null;
};

export function BlockContainer({ children, isLoading, isEmpty, data }: Props<unknown>) {
  const theme = useTheme<Theme>();

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <LoadingIndicator white={!theme.isLightTheme} fullscreen={false} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.emptyContainer}>
        <h3 className={styles.noDataText}>No Data Found</h3>
        <div className={styles.noDataImage} />
      </div>
    );
  }

  if (typeof children === 'function' && data) {
    return children(data);
  }

  return children;
}
