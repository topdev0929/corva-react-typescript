import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { isEqual } from 'lodash';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { theme } from '~/config';
import FiltersToggler from '../components/FiltersToggler';

import { getStartComponent, getMiddleComponent, getEndComponents } from '../utils';
import { LARGE_SIZE_LAYOUT, MEDIUM_SIZE_LAYOUT, SMALL_SIZE_LAYOUT } from '../constants';

// NOTE: Determine layout according to the width of elements
export function useFilterLayout(components, componentsWidth, appFilterTogglerWidth, appWidth) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!appWidth || !componentsWidth) {
      return;
    }

    const filtersComponent = getStartComponent(components);
    const goalComponent = getMiddleComponent(components);
    const switchComponent = getEndComponents(components);

    const hasFiltersOnly = filtersComponent && !goalComponent && !switchComponent;
    const hasFiltersAndGoals = filtersComponent && goalComponent && !switchComponent;
    const hasFiltersAndSwitch = filtersComponent && !goalComponent && switchComponent;
    const hasAll = filtersComponent && goalComponent && switchComponent;

    if (hasFiltersOnly) {
      const filtersWidth = componentsWidth[filtersComponent.key];

      if (filtersWidth <= appWidth) {
        setLayout(LARGE_SIZE_LAYOUT);
        return;
      }

      if (filtersWidth <= appWidth / 2) {
        setLayout(MEDIUM_SIZE_LAYOUT);
        return;
      }
    } else if (hasFiltersAndGoals || hasFiltersAndSwitch) {
      const startWidth = componentsWidth[filtersComponent.key];
      const endWidth = hasFiltersAndGoals
        ? componentsWidth[goalComponent.key]
        : componentsWidth[switchComponent.key];

      if (startWidth + endWidth <= appWidth) {
        setLayout(LARGE_SIZE_LAYOUT);
        return;
      }

      if (appFilterTogglerWidth + endWidth <= appWidth) {
        setLayout(MEDIUM_SIZE_LAYOUT);
        return;
      }
    } else if (hasAll) {
      const startWidth = componentsWidth[filtersComponent.key];
      const middleWidth = componentsWidth[goalComponent.key];
      const endWidth = componentsWidth[switchComponent.key];

      if (startWidth + middleWidth + endWidth <= appWidth) {
        setLayout(LARGE_SIZE_LAYOUT);
        return;
      }

      if (appFilterTogglerWidth + middleWidth + endWidth <= appWidth) {
        setLayout(MEDIUM_SIZE_LAYOUT);
        return;
      }

      if (appFilterTogglerWidth + endWidth <= appWidth) {
        setLayout(SMALL_SIZE_LAYOUT);
        return;
      }
    }

    setLayout(SMALL_SIZE_LAYOUT);
  }, [componentsWidth, appWidth]);

  return layout;
}

// NOTE: Calculate the width of child components here
export function useComonentsWidth(components) {
  const widthRef = useRef({});
  const [widthDict, setWidthDict] = useState(null);
  const prevComponentsRef = useRef({});

  // NOTE: Calcualte width of each components
  useEffect(() => {
    const validComponents = components.filter(component => !!component);

    // NOTE: Don't calcuate width again
    if (isEqual(validComponents, prevComponentsRef.current)) {
      return;
    }

    widthRef.current = {};

    validComponents.forEach(component => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      document.body.appendChild(element);

      if (component) {
        ReactDOM.render(
          <MuiThemeProvider theme={theme.darkTheme}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
              {component}
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>,
          element,
          () => {
            const dims = element.getBoundingClientRect();
            element.remove();

            widthRef.current = {
              ...widthRef.current,
              [component.key]: dims.width,
            };

            if (Object.values(widthRef.current).length === validComponents.length) {
              if (!isEqual(widthDict, widthRef.current)) {
                setWidthDict(widthRef.current);
              }
            }
          }
        );
      }
    });

    prevComponentsRef.current = validComponents;
  });

  return widthDict;
}

// NOTE: Calculate the width of Toggler Component
export function useAppFilterTogglerWidth() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';
    document.body.appendChild(element);

    ReactDOM.render(
      <MuiThemeProvider theme={theme.darkTheme}>
        <FiltersToggler />
      </MuiThemeProvider>,
      element,
      () => {
        const dims = element.getBoundingClientRect();
        element.remove();
        setWidth(dims.width);
      }
    );
  }, []);

  return width;
}
