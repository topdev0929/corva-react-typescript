import { useState } from 'react';

import { InsightsStoreImpl } from '@/stores/insights';
import { insightsApi } from '@/api/insights';
import { authorsApi } from '@/api/authors';
import { recordsApi } from '@/api/records';
import { useGlobalStore } from '@/contexts/global';

export const useInsightsStore = (mode: 'preview' | 'full' = 'preview') => {
  const globalStore = useGlobalStore();

  const [insightsStore] = useState(
    () =>
      new InsightsStoreImpl(
        { insights: insightsApi, authors: authorsApi, records: recordsApi },
        { global: globalStore },
        mode
      )
  );

  return insightsStore;
};
