import { createContext, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { recordsApi } from '@/api/records';
import { insightsApi } from '@/api/insights';
import { SelectedInsightsStoreImpl, SelectedInsightsStore } from '@/stores/selected-insights';

import { useGlobalStore } from '../global';
import { useFiltersStore } from '../filters';
import { useInsightsStore } from '../useInsightsStore';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const SelectedInsightsContext = createContext<SelectedInsightsStore>();

export const SelectedInsightsProvider = observer(({ children }) => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();

  const insightsStore = useInsightsStore('full');
  const [store] = useState(
    () =>
      new SelectedInsightsStoreImpl(
        { records: recordsApi, insights: insightsApi },
        { insights: insightsStore, global: globalStore, filters: filtersStore }
      )
  );

  const range = useMemo(() => {
    let { range } = filtersStore;
    if (!range) {
      range = {
        start: filtersStore.selectedDay,
        end: filtersStore.selectedDay,
      };
    }
    return range;
  }, [filtersStore.range, filtersStore.selectedDay]);

  useEffect(() => {
    insightsStore.loadData(globalStore.currentAssetId, { types: filtersStore.types, range });
    return () => {
      store.reset();
      insightsStore.reset();
    };
  }, [globalStore.currentAssetId, filtersStore.types, range, globalStore.insightsRefreshed]);

  useEffect(() => {
    return () => {
      insightsStore.onDestroy();
    };
  }, []);

  return (
    <SelectedInsightsContext.Provider value={store}>{children}</SelectedInsightsContext.Provider>
  );
});
