import { useContext } from 'react';

import { DIListContext } from './context';

export const useDIListStore = () => {
  return useContext(DIListContext);
};
