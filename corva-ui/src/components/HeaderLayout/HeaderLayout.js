/**
 * A wrapper component that handles the layout of completion app headers
 *
 * MUST 1: "key" props must be specified to make "auto layout" working
 * --------- "title": App Title
 * --------- "subtitle": App SubTitle
 * --------- "expander": Offset Picker expander
 * --------- "offset-picker": Offset Picker
 * --------- "secondary-asset": Active Well Chip
 * --------- "mode-select": Completion Mode Select
 * --------- "primary-asset": Pad (or Well) Chip
 * --------- "offset-chip": Offset Well Chips
 * MUST 2: Each child component must be "inline-block" style
 *
 *
 * If the above conditions meet, this component will auto-place children components.
 *
 * Layout 1: Large Size
 * ---------------------------------------------------------------------------------------------------
 * | title                | secondary-asset | mode-select | expander | offset-picker | primary-asset |
 * ---------------------------------------------------------------------------------------------------
 * | subtitle                                                                                        |
 * ---------------------------------------------------------------------------------------------------
 * |                                                                      | chip 1 | chip 2 | chip 3 |
 *
 * Layout 2: Medium/Small Size Size
 * --------------------------------------------------------------------------
 * | title                                                  | primary-asset |
 * --------------------------------------------------------------------------
 * | subtitle                                                               |
 * --------------------------------------------------------------------------
 * | secondary-asset | mode-select | expander | offset-picker |
 * --------------------------------------------------------------------------
 * | chip 1 | chip 2 | chip 3 |
 *
 */

import { useMemo, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { SizeMe } from 'react-sizeme';
import { Collapse } from '@material-ui/core';

import { useComonentsWidth, useFilterLayout } from './effects';
import {
  getAppTitle,
  getAppSubTitle,
  getExpander,
  getOffsetPicker,
  getSecondaryAsset,
  getModeSelect,
  getPrimaryAsset,
  getOffsetWellsChip,
  getPadChip,
} from './utils';
import { LARGE_SIZE_LAYOUT, MEDIUM_SIZE_LAYOUT, SMALL_SIZE_LAYOUT } from './constants';

import styles from './HeaderLayout.css';

function formatAssetName(assetName) {
  const words = assetName.split(' ');
  const firstChar = assetName[0];
  const endWord = words[words.length - 1];
  return `${firstChar} ${endWord}`;
}

function getShortComponent(layout, primaryAssetComponent) {
  if (layout === SMALL_SIZE_LAYOUT && primaryAssetComponent) {
    // NOTE: When asset name is long, use its shorthand
    const clonedComponent = cloneElement(
      primaryAssetComponent,
      primaryAssetComponent.props,
      formatAssetName(primaryAssetComponent.props.children)
    );
    return clonedComponent;
  }

  return primaryAssetComponent;
}

function HeaderLayout({ children, appWidth }) {
  // NOTE: Calcualte width of each components
  const componentsWidth = useComonentsWidth(children);

  // NOTE: Determine layout to be shown based on the calculated width
  const layout = useFilterLayout(children, componentsWidth, appWidth);

  const titleComponent = getAppTitle(children);
  const subTitleComponent = getAppSubTitle(children);
  const expanderComponent = getExpander(children);
  const offsetPickerComponent = getOffsetPicker(children);
  const secondaryAssetComponent = getSecondaryAsset(children);
  const modeSelectComponent = getModeSelect(children);
  const padChipComponent = getPadChip(children);
  const primaryAssetComponent = getPrimaryAsset(children);
  const offsetWellChipsComponent = getOffsetWellsChip(children);

  // NOTE: Drilling apps won't have primaryAsset chip in asset dashabord
  const primaryAssetShortComponent = useMemo(
    () => getShortComponent(layout, primaryAssetComponent),
    [layout, primaryAssetComponent]
  );

  const padChipShortComponent = useMemo(() => getShortComponent(layout, padChipComponent), [
    layout,
    padChipComponent,
  ]);

  return (
    <div style={{ width: '100%' }}>
      <Collapse timeout={10} in={layout === LARGE_SIZE_LAYOUT}>
        <div className={styles.layoutContainer}>
          <div className={styles.layoutTopLarge}>
            <div>{titleComponent}</div>

            <div className={styles.layoutTopRightLarge}>
              {secondaryAssetComponent}
              {modeSelectComponent}
              <div className={styles.layoutOffsetpicker}>
                {expanderComponent}
                {offsetPickerComponent}
              </div>
              {padChipComponent}
              {primaryAssetComponent}
            </div>
          </div>

          <div>{subTitleComponent}</div>

          <div className={styles.layoutOffsetwellChipsLarge}>{offsetWellChipsComponent}</div>
        </div>
      </Collapse>

      <Collapse timeout={10} in={[MEDIUM_SIZE_LAYOUT, SMALL_SIZE_LAYOUT].includes(layout)}>
        <div className={styles.layoutContainer}>
          <div className={styles.layoutTopSmall}>
            <div>{titleComponent}</div>
            <div className={styles.assetChips}>
              {layout === MEDIUM_SIZE_LAYOUT && (
                <>
                  {padChipComponent}
                  {primaryAssetComponent}
                </>
              )}
              {layout === SMALL_SIZE_LAYOUT && primaryAssetShortComponent}
            </div>
          </div>

          <div>{subTitleComponent}</div>

          <div className={styles.layoutBottomSmall}>
            {secondaryAssetComponent}
            {modeSelectComponent}
            {layout === SMALL_SIZE_LAYOUT && padChipShortComponent}
            <div className={styles.layoutOffsetpicker}>
              {expanderComponent}
              {offsetPickerComponent}
            </div>
          </div>

          <div className={styles.layoutOffsetwellChipsSmall}>{offsetWellChipsComponent}</div>
        </div>
      </Collapse>
    </div>
  );
}

HeaderLayout.propTypes = {
  appWidth: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

function WithSizeMe(props) {
  return (
    <SizeMe monitorWidth>
      {({ size }) => <HeaderLayout appWidth={size.width - 21}>{props.children}</HeaderLayout>}
    </SizeMe>
  );
}

WithSizeMe.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default WithSizeMe;
