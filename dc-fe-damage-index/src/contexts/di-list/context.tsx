import { createContext, FC, useState } from 'react';

import { DIListStore, IDIListStore } from '@/stores/di-list';
import { diRepository } from '@/repositories/damage-indexes';
import { DEFAULT_DI_CHANGES } from '@/constants';

export const DIListContext = createContext<IDIListStore>({
  currentDI: null,
  diList: [],
  diChanges: DEFAULT_DI_CHANGES,
  isCurrentLoading: true,
  isListLoading: true,
  loadData: () => Promise.resolve(),
  onUnmount: () => null,
});

export const DIListProvider: FC = ({ children }) => {
  const [store] = useState(() => new DIListStore(diRepository));

  return <DIListContext.Provider value={store}>{children}</DIListContext.Provider>;
};
