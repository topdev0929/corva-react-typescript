import { createContext, FC, useState } from 'react';

import { IOPStore, OPStore, VIEW_TYPES } from '@/stores/optimization-parameters';
import { opRepository } from '@/repositories/optimization-parameters';
import { IDIListStore } from '@/stores/di-list';

export const OPContext = createContext<IOPStore>({
  isLoading: true,
  isEmpty: true,
  viewType: VIEW_TYPES.CHART,
  fitInDIParametersList: [],
  fitInROPParametersList: [],
  setChartView: () => null,
  setTableView: () => null,
  loadOP: () => Promise.resolve(),
  onUnmount: () => null,
});

type Props = {
  diStore: IDIListStore;
};

export const OPProvider: FC<Props> = ({ children, diStore }) => {
  const [store] = useState(() => new OPStore(opRepository, diStore));

  return <OPContext.Provider value={store}>{children}</OPContext.Provider>;
};
