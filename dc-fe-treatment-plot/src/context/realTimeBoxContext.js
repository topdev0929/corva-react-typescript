import { createContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import reducer from './realTimetBoxReducer';

const initialState = {
  isDialogOpen: false,
  paramToEdit: '',
};

export const RealTimeBoxContext = createContext(initialState);

export const RealTimeBoxContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <RealTimeBoxContext.Provider value={contextValue}>{props.children}</RealTimeBoxContext.Provider>
  );
};

RealTimeBoxContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
