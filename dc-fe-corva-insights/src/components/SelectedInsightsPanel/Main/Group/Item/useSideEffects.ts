import { useEffect, useMemo, useRef } from 'react';

import { useFiltersStore } from '@/contexts/filters';
import { isSameDay } from '@/shared/utils';

export const useSideEffects = (date: Date) => {
  const filtersStore = useFiltersStore();

  const elRef = useRef<HTMLDivElement | null>(null);

  const isSameDateSelected = useMemo(
    () => isSameDay(filtersStore.selectedDay, date),
    [filtersStore.selectedDay, date]
  );

  useEffect(() => {
    if (isSameDateSelected) {
      elRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSameDateSelected]);

  return {
    isSameDateSelected,
    elRef,
  };
};
