import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useOPStore } from '@/contexts/optimization-parameters';
import { useGlobalStore } from '@/contexts/global';

import { ViewSelector } from './ViewSelector';
import { Table } from './Table';
import { BlockContainer } from '../Container';
import styles from './index.module.css';

export const RecommendedParameters: FC = observer(() => {
  const globalStore = useGlobalStore();
  const opStore = useOPStore();

  useEffect(() => {
    opStore.loadOP(globalStore.currentAssetId);
    return () => opStore.onUnmount();
  }, [globalStore.currentAssetId]);

  return (
    <BlockContainer isLoading={opStore.isLoading}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recommended Parameters</h3>
        <ViewSelector />
      </div>
      <Table />
    </BlockContainer>
  );
});

RecommendedParameters.displayName = 'RecommendedParameters';
