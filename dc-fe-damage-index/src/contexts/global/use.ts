import { useContext } from 'react';

import { GlobalContext } from './context';

export const useGlobalStore = () => {
  return useContext(GlobalContext);
};
