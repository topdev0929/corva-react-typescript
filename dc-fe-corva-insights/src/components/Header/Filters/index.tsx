import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';
import { APP_SIZE } from '@/shared/types';

import { FiltersContent } from './Content';
import { SmallScreenVariant } from './SmallScreen';
import styles from './index.module.css';

export const Filters = observer(() => {
  const globalStore = useGlobalStore();

  if (globalStore.appSize !== APP_SIZE.DESKTOP) {
    return <SmallScreenVariant />;
  }

  return (
    <div className={styles.container}>
      <FiltersContent />
    </div>
  );
});

Filters.displayName = 'Filters';
