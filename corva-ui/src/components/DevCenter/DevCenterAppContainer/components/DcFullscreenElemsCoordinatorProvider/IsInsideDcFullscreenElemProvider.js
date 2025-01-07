import { createContext, useContext } from 'react';

const IsInsideDcFullscreenElemContext = createContext(false);

export function IsInsideDcFullscreenElemProvider({ children }) {
  return (
    <IsInsideDcFullscreenElemContext.Provider value>
      {children}
    </IsInsideDcFullscreenElemContext.Provider>
  );
}

export function useIsInsideDcFullscreenElem() {
  return useContext(IsInsideDcFullscreenElemContext);
}
