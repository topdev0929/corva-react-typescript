import { createContext, FC, PropsWithChildren, useState } from 'react';

import { Insight } from '@/entities/insight';
import { recordsApi } from '@/api/records';
import { insightsApi } from '@/api/insights';
import { InsightFormStoreImpl, InsightFormStore } from '@/stores/insight-form';

import { useGlobalStore } from '../global';
import { useFiltersStore } from '../filters';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const InsightFormContext = createContext<InsightFormStore>();

type Props = {
  editedInsight: Insight | null;
};

export const InsightFormProvider: FC<PropsWithChildren<Props>> = ({ children, editedInsight }) => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();

  const [store] = useState(
    () =>
      new InsightFormStoreImpl(
        { records: recordsApi, insights: insightsApi },
        { global: globalStore, filters: filtersStore },
        editedInsight
      )
  );

  return <InsightFormContext.Provider value={store}>{children}</InsightFormContext.Provider>;
};
