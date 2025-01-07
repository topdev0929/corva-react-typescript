import { createContext, Context, useContext } from 'react';

type AppContextType = {
  isAssetViewer: boolean;
};

const AppContext: Context<AppContextType> = createContext(null);

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    console.warn('Cannot use AppContext outside of provider');
  }

  return context;
};

export { AppContext, useAppContext };
