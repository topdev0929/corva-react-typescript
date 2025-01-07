import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import { useFiltersStore } from '@/contexts/filters';

import { CommonFilterSelector } from '../CommonFilterSelector';

export const BHAsSelector = observer(() => {
  const store = useFiltersStore();

  const onChange = useCallback(selectedValues => store.setSelectedBHAsId(selectedValues), []);

  return (
    <CommonFilterSelector
      label="BHA"
      filterKey="bhas"
      loading={{ is: store.isBHAsLoading, label: 'BHAs are loading...' }}
      options={store.bhasOptions}
      value={store.selectedBHAsId}
      onChange={onChange}
    />
  );
});

BHAsSelector.displayName = 'BHAsSelector';
