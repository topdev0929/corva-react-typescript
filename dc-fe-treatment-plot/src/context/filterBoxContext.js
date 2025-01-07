import { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import reducer from './filterBoxReducer';

const initialState = {
  isDialogOpen: false,
  paramToEdit: '',
};

export const FilterBoxContext = createContext(initialState);

export const FilterBoxContextProvider = ({ children, isAssetViewer }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(
    () => ({ isAssetViewer, state, dispatch }),
    [isAssetViewer, state, dispatch]
  );

  return <FilterBoxContext.Provider value={contextValue}>{children}</FilterBoxContext.Provider>;
};

FilterBoxContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isAssetViewer: PropTypes.bool.isRequired,
};
