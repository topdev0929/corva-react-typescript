/**
 * A wrapper component that handles the layout of completion app filters
 *
 * MUST 1: "key" props must be specified to make "auto layout" working
 * --------- "filter" or "start" needs to be included for Filter component key
 * --------- "goal" or "middle" needs to be included for Goal component key
 * --------- "switch" or "end" needs to be included for Switch component key
 * MUST 2: Each child component must be "inline-block" style
 * MUST 3: Filter components must be wrapped with <Fragment>
 *
 *
 * If the above conditions meet, this component will auto-place children components.
 *
 * Layout 1: Large Size
 * -----------------------------------------------
 * | filters                      | middle | end |
 * -----------------------------------------------
 *
 * Layout 2: Medium Size
 * -------------------------------
 * | icon |       | middle | end |
 * -------------------------------
 * | filters                     |
 * -------------------------------
 *
 * Layout 3: Small Size
 * ---------------------
 * | icon |      | end |
 * ---------------------
 *            | middle |
 * ---------------------
 *
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { SizeMe } from 'react-sizeme';
import { Popover, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import FiltersToggler from './components/FiltersToggler';
import PinAppSwitch from './components/PinAppSwitch';
import { useComonentsWidth, useFilterLayout, useAppFilterTogglerWidth } from './effects';
import { getStartComponent, getMiddleComponent, getEndComponents } from './utils';
import { LARGE_SIZE_LAYOUT, MEDIUM_SIZE_LAYOUT, SMALL_SIZE_LAYOUT } from './constants';

import styles from './PinnableFilters.css';

const muiStyles = {
  paper: {
    backgroundColor: '#414141',
  },
};

function PinnableFilters({
  children,
  classes,
  appWidth,
  isPinnedInitial,
  isShownInitial,
  onShowCallback,
  onPinCallback,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPinned, setIsPinned] = useState(isPinnedInitial);
  const [isShown, setIsShown] = useState(isShownInitial);
  const [showPin, setShowPin] = useState(false);
  const handleChangePinned = value => {
    setIsPinned(value);
    if (onPinCallback) onPinCallback(value);
  };
  const handleChangeShown = value => {
    setIsShown(value);
    if (onShowCallback) onShowCallback(value);
  };

  // NOTE: Calcualte width of each components
  const componentsWidth = useComonentsWidth(children);

  // NOTE: Calculate app filter toggler width
  const appFilterTogglerWidth = useAppFilterTogglerWidth();

  // NOTE: Determine layout to be shown based on the calculated width
  const layout = useFilterLayout(children, componentsWidth, appFilterTogglerWidth, appWidth);

  const filtersComponent = getStartComponent(children);
  const goalComponent = getMiddleComponent(children);
  const switchComponent = getEndComponents(children);

  const handleOpen = e => {
    if (isPinned) {
      handleChangeShown(!isShown);
    } else {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePinClick = () => {
    const newPinState = !isPinned;
    if (newPinState) {
      setAnchorEl(null);
      handleChangeShown(true);
    }
    handleChangePinned(newPinState);
  };

  return (
    <div style={{ width: '100%' }}>
      <Collapse timeout={10} in={layout === LARGE_SIZE_LAYOUT}>
        <div className={styles.containerLarge}>
          <div>{filtersComponent}</div>
          <div className={styles.containerLargeTopright}>
            {goalComponent}
            {switchComponent}
          </div>
        </div>
      </Collapse>

      <Collapse timeout={10} in={layout === MEDIUM_SIZE_LAYOUT}>
        <div className={styles.containerMedium}>
          <div className={styles.containerMediumTop}>
            <div
              className={styles.containerButtonsWrapper}
              onMouseEnter={() => setShowPin(true)}
              onMouseLeave={() => setShowPin(false)}
            >
              <FiltersToggler onClick={handleOpen} />
              {(showPin || isPinned || Boolean(anchorEl)) && (
                <PinAppSwitch isPinned={isPinned} onClick={handlePinClick} />
              )}
            </div>
            <div className={styles.containerMediumTopright}>
              {goalComponent}
              {switchComponent}
            </div>
          </div>

          <Collapse timeout={100} in={isPinned && isShown}>
            <div className={styles.containerMediumBottom}>{filtersComponent}</div>
          </Collapse>
        </div>
      </Collapse>

      <Collapse timeout={10} in={layout === SMALL_SIZE_LAYOUT}>
        <div className={styles.containerSmall}>
          <div className={styles.containerSmallTop}>
            <div
              className={styles.containerButtonsWrapper}
              onMouseEnter={() => setShowPin(true)}
              onMouseLeave={() => setShowPin(false)}
            >
              <FiltersToggler onClick={handleOpen} />
              {(showPin || isPinned || Boolean(anchorEl)) && (
                <PinAppSwitch isPinned={isPinned} onClick={handlePinClick} />
              )}
            </div>
            <div>{switchComponent}</div>
          </div>

          <Collapse timeout={100} in={isPinned && isShown}>
            <div className={styles.containerSmallMiddle}>{filtersComponent}</div>
          </Collapse>

          <div className={styles.containerSmallBottom}>{goalComponent}</div>
        </div>
      </Collapse>

      <Popover
        id="filters-popper"
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className={styles.containerPopper}>{filtersComponent}</div>
      </Popover>
    </div>
  );
}

PinnableFilters.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  appWidth: PropTypes.number.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  isPinnedInitial: PropTypes.bool,
  isShownInitial: PropTypes.bool,
  onShowCallback: PropTypes.func,
  onPinCallback: PropTypes.func,
};

PinnableFilters.defaultProps = {
  isPinnedInitial: false,
  isShownInitial: false,
  onShowCallback: undefined,
  onPinCallback: undefined,
};

const StyledPinnableFilters = withStyles(muiStyles)(PinnableFilters);

function WithSizeMe({ children, ...props }) {
  return (
    <SizeMe monitorWidth>
      {({ size }) => (
        <StyledPinnableFilters appWidth={size.width - 21} {...props}>
          {children}
        </StyledPinnableFilters>
      )}
    </SizeMe>
  );
}

WithSizeMe.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default WithSizeMe;
