import { createContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { CalendarStoreImpl, CalendarStore } from '@/stores/calendar';
import { Filters } from '@/stores/insights';
import { getEndOfCalendarMonth, getStartOfCalendarMonth, isSameMonth } from '@/shared/utils';

import { useGlobalStore } from '../global';
import { useFiltersStore } from '../filters';
import { useInsightsStore } from '../useInsightsStore';

const ONE_MINUTE = 1000 * 60;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const CalendarContext = createContext<CalendarStore>();

export const CalendarProvider = observer(({ children }) => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();

  const insightsStore = useInsightsStore();
  const [store] = useState(() => new CalendarStoreImpl(undefined, { insights: insightsStore }));

  useEffect(() => {
    if (!isSameMonth(store.selectedMonth, filtersStore.selectedDay)) {
      store.setMonth(filtersStore.selectedDay);
    }
  }, [filtersStore.selectedDay]);

  useEffect(() => {
    let insightsItemsLength = 0;
    async function refreshCommentsData() {
      const range = {
        start: getStartOfCalendarMonth(store.selectedMonth),
        end: getEndOfCalendarMonth(store.selectedMonth),
      };
      const filters: Filters = { types: filtersStore.types, range };
      await insightsStore.loadData(globalStore.currentAssetId, filters);
      if (insightsItemsLength !== insightsStore.list.length) {
        globalStore.onInsightsRefreshed();
      }
      insightsItemsLength = insightsStore.list.length;
    }
    const interval = setInterval(() => refreshCommentsData(), ONE_MINUTE);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const range = {
      start: getStartOfCalendarMonth(store.selectedMonth),
      end: getEndOfCalendarMonth(store.selectedMonth),
    };
    const filters: Filters = { types: filtersStore.types, range };
    insightsStore.loadData(globalStore.currentAssetId, filters);
    return () => {
      insightsStore.reset();
    };
  }, [globalStore.currentAssetId, filtersStore.types, store.selectedMonth]);

  useEffect(() => {
    return () => {
      insightsStore.onDestroy();
    };
  }, []);

  return <CalendarContext.Provider value={store}>{children}</CalendarContext.Provider>;
});
