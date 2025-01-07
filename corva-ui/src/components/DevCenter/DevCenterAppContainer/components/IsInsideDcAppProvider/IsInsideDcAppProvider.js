import { useContext , createContext } from 'react';

const IsInsideDcAppContext = createContext(false);

export const IsInsideDcAppProvider = IsInsideDcAppContext.Provider;

export function useIsInsideDcApp() {
  return useContext(IsInsideDcAppContext);
}
