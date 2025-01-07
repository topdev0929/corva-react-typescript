import { createContext, useReducer, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { bind, clear } from 'size-sensor';
import { debounce } from 'lodash';

import { MOBILE_SIZE_BREAKPOINT, TABLET_SIZE_BREAKPOINT } from '../constants';
import reducer from './layoutReducer';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    minHeight: 0,
    flex: 1,
    position: 'relative',
  },
});

export const LayoutContext = createContext();

export const LayoutContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, props.initialLayout);

  const contentContainer = useRef(null);
  const classes = useStyles();

  const resolveContainerSizes = width => {
    dispatch({ type: 'SET_IS_MOBILE_SIZE', value: width <= MOBILE_SIZE_BREAKPOINT });
    dispatch({
      type: 'SET_IS_TABLET_SIZE',
      value: width > MOBILE_SIZE_BREAKPOINT && width <= TABLET_SIZE_BREAKPOINT,
    });
  };

  useEffect(() => {
    if (!contentContainer.current) {
      return null;
    }

    bind(contentContainer.current, ({ clientWidth }) => {
      debounce(() => resolveContainerSizes(clientWidth), 500);
      resolveContainerSizes(clientWidth);
    });

    return () => {
      if (contentContainer.current) {
        clear(contentContainer.current);
      }
    };
  }, []);

  const contextValue = useMemo(() => {
    return { state, dispatch, isResponsive: state.isMobileSize || state.isTabletSize };
  }, [state, dispatch]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={classes.layout} ref={contentContainer}>
        {props.children}
      </div>
    </LayoutContext.Provider>
  );
};

LayoutContextProvider.propTypes = {
  initialLayout: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};
