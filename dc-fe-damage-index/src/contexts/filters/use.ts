import { useContext } from 'react';

import { FiltersContext } from './context';

export const useFiltersStore = () => {
  return useContext(FiltersContext);
};
