import classNames from 'classnames';

import { useGlobalStore } from '@/contexts/global';

import { BHAsSelector } from './BHAsSelector';
import styles from './index.module.css';

export const Filters = () => {
  const globalStore = useGlobalStore();
  return (
    <div
      className={classNames(styles.container, {
        [styles.isMobile]: globalStore.isMobileSize,
      })}
    >
      <BHAsSelector />
    </div>
  );
};
