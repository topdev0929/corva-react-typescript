import { useGlobalStore } from '@/contexts/global';

import styles from './index.module.css';

export const WellInfo = () => {
  const store = useGlobalStore();

  return (
    <div className={styles.container}>
      <p className={styles.rig}>{store.rigName}</p>
      <p className={styles.well}>{store.currentWell.name}</p>
    </div>
  );
};
