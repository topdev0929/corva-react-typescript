import { createContext, useState, FC } from 'react';

import { FiltersStore, IFiltersStore } from '@/stores/filters';
import { wellsRepository } from '@/repositories/wells';
import { bhasRepository } from '@/repositories/bhas';

export const FiltersContext = createContext<IFiltersStore>({
  wellsOptions: [],
  bhasOptions: [],
  selectedWellsId: [],
  selectedBHAsId: [],
  selectedWells: [],
  bhasToRemove: [],
  isBHAsLoading: false,
  isWellsLoading: false,
  isWellsLoadingFailed: false,
  loadWells: () => Promise.resolve(),
  loadBHAs: () => Promise.resolve(),
  setSelectedWellsId: () => null,
  setSelectedBHAsId: () => null,
});

export const FiltersProvider: FC = ({ children }) => {
  const [store] = useState(
    () => new FiltersStore({ getWells: wellsRepository.get, getBHAs: bhasRepository.get })
  );

  return <FiltersContext.Provider value={store}>{children}</FiltersContext.Provider>;
};
