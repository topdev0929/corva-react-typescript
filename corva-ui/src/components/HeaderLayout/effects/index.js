import { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { isEqual, get } from 'lodash';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '~/config'
import {
  getAppTitle,
  getExpander,
  getOffsetPicker,
  getSecondaryAsset,
  getModeSelect,
  getPrimaryAsset,
} from '../utils';
import { LARGE_SIZE_LAYOUT, MEDIUM_SIZE_LAYOUT, SMALL_SIZE_LAYOUT } from '../constants';

// NOTE: Determine layout according to the width of elements
export function useFilterLayout(components, componentsWidth, appWidth) {
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    if (!appWidth || !componentsWidth) {
      return;
    }

    const titleComponent = getAppTitle(components);
    const expanderComponent = getExpander(components);
    const offsetPickerComponent = getOffsetPicker(components);
    const secondaryAssetComponent = getSecondaryAsset(components);
    const modeSelectComponent = getModeSelect(components);
    const primaryAssetComponent = getPrimaryAsset(components);

    const titleWidth = componentsWidth[get(titleComponent, 'key')] || 0;
    const expanderWidth = componentsWidth[get(expanderComponent, 'key')] || 0;
    const offsetPickerWidth = componentsWidth[get(offsetPickerComponent, 'key')] || 0;
    const secondaryAssetWidth = componentsWidth[get(secondaryAssetComponent, 'key')] || 0;
    const modeSelectWidth = componentsWidth[get(modeSelectComponent, 'key')] || 0;
    const primaryAssetWidth = componentsWidth[get(primaryAssetComponent, 'key')] || 0;

    const extraWidth =
      expanderWidth + offsetPickerWidth + secondaryAssetWidth + modeSelectWidth + primaryAssetWidth;

    if (titleWidth + extraWidth <= appWidth) {
      setLayout(LARGE_SIZE_LAYOUT);
    } else if (titleWidth + primaryAssetWidth <= appWidth) {
      setLayout(MEDIUM_SIZE_LAYOUT);
    } else {
      setLayout(SMALL_SIZE_LAYOUT);
    }
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

    // NOTE: There's data loading in offset picker
    const offsetPickerComponent = getOffsetPicker(components);
    const offsetPickerKey = get(offsetPickerComponent, 'key');

    widthRef.current = offsetPickerKey ? { [offsetPickerKey]: 36 } : {};

    validComponents.forEach(component => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.visibility = 'hidden';
      document.body.appendChild(element);

      if (component && component.key !== offsetPickerKey) {
        ReactDOM.render(
          <MuiThemeProvider theme={theme.darkTheme}>{component}</MuiThemeProvider>,
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
