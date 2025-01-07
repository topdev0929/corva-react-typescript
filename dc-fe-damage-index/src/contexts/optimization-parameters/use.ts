import { useContext } from 'react';

import { OPContext } from './context';

export const useOPStore = () => {
  return useContext(OPContext);
};
