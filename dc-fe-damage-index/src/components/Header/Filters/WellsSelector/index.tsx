import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useFiltersStore } from '@/contexts/filters';

import { CommonFilterSelector } from '../CommonFilterSelector';
import { LoadWellsButton } from '../LoadWellsButton';
import styles from './index.module.css';

export const WellsSelector = observer(() => {
  const store = useFiltersStore();

  const onChange = useCallback(selectedValues => store.setSelectedWellsId(selectedValues), []);

  return (
    <div className={styles.container}>
      <CommonFilterSelector
        label="Offset wells"
        filterKey="wells"
        loading={{ is: store.isWellsLoading, label: 'Wells are loading...' }}
        options={store.wellsOptions}
        value={store.selectedWellsId}
        onChange={onChange}
      />
      {store.isWellsLoadingFailed && <LoadWellsButton />}
    </div>
  );
});

WellsSelector.displayName = 'WellsSelector';
