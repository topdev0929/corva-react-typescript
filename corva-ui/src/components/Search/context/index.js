import { createContext, useContext } from 'react';

const PaperContext = createContext({});

const usePaperContext = () => {
  const context = useContext(PaperContext);

  if (!context) {
    console.warn('PaperContext cannot be used outside Provider');
  }

  return context;
};

export { PaperContext };
export default usePaperContext;
