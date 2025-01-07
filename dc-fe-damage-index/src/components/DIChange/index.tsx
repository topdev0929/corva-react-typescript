import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { useDIListStore } from '@/contexts/di-list';
import { useGlobalStore } from '@/contexts/global';

import { DIChangeValue } from './DIChangeValue';
import { BlockContainer } from '../Container';
import styles from './index.module.css';

export const DIChange = observer(() => {
  const globalStore = useGlobalStore();
  const store = useDIListStore();

  return (
    <BlockContainer isLoading={store.isListLoading}>
      <h3 className={styles.title}>Damage Index Change</h3>
      <div
        className={classNames(styles.values, {
          [styles.tabletSm]: globalStore.isTabletSmSize,
        })}
      >
        {store.diChanges.map(diChange => (
          <DIChangeValue
            key={diChange.label}
            label={`${diChange.label} (${diChange.unit})`}
            value={diChange.value}
          />
        ))}
      </div>
    </BlockContainer>
  );
});

DIChange.displayName = 'DIChange';
