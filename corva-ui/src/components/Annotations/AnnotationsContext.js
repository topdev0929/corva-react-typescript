import { createContext, useReducer, useContext } from 'react';
import { node } from 'prop-types';

import {
  SET_ANNOTATIONS,
  APPEND_ANNOTATIONS,
  ADD_ANNOTATION,
  DELETE_ANNOTATION,
  EDIT_ANNOTATION,
} from './constants';

const AnnotationsStateContext = createContext();
const AnnotationsDispatchContext = createContext();

function annotationsReducer(state, action) {
  switch (action.type) {
    case SET_ANNOTATIONS: {
      return { annotations: action.annotations };
    }
    case APPEND_ANNOTATIONS: {
      return {
        ...state,
        annotations: {
          data: [...state.annotations.data, ...action.annotations.data],
          included: action.annotations.included.reduce(
            (acc, item) =>
              acc.find(({ id, type }) => id === item.id && type === item.type)
                ? acc
                : acc.concat([item]),
            state.annotations.included
          ),
        },
      };
    }
    case ADD_ANNOTATION: {
      return {
        ...state,
        annotations: state.annotations.data
          ? {
              data: [action.annotation.data, ...state.annotations.data],
              included: action.annotation.included.reduce(
                (acc, item) =>
                  acc.find(({ id, type }) => id === item.id && type === item.type)
                    ? acc
                    : acc.concat([item]),
                state.annotations.included
              ),
            }
          : {
              data: [action.annotation.data],
              included: action.annotation.included,
            },
      };
    }
    case DELETE_ANNOTATION: {
      const { data } = state.annotations;

      return {
        ...state,
        annotations: { ...state.annotations, data: data.filter(({ id }) => id !== action.id) },
      };
    }
    case EDIT_ANNOTATION: {
      return {
        ...state,
        annotations: {
          ...state.annotations,
          data: state.annotations.data.map(item =>
            item.id === action.id ? action.annotation.data : item
          ),
          included: action.annotation.included.reduce(
            (acc, item) =>
              acc.find(({ id, type }) => id === item.id && type === item.type)
                ? acc
                : acc.concat([item]),
            state.annotations.included
          ),
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AnnotationsProvider({ children }) {
  const [state, dispatch] = useReducer(annotationsReducer, {
    annotations: [],
  });

  return (
    <AnnotationsStateContext.Provider value={state}>
      <AnnotationsDispatchContext.Provider value={dispatch}>
        {children}
      </AnnotationsDispatchContext.Provider>
    </AnnotationsStateContext.Provider>
  );
}
AnnotationsProvider.propTypes = { children: node.isRequired };

function useAnnotationsState() {
  const context = useContext(AnnotationsStateContext);
  if (context === undefined) {
    throw new Error('useAnnotationsState must be used within a AnnotationsProvider');
  }
  return context;
}

function useAnnotationsDispatch() {
  const context = useContext(AnnotationsDispatchContext);
  if (context === undefined) {
    throw new Error('useAnnotationsDispatch must be used within a AnnotationsProvider');
  }
  return context;
}

export { AnnotationsProvider, useAnnotationsState, useAnnotationsDispatch };
