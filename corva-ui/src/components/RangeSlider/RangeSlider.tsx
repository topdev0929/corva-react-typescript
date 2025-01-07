import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { round, throttle } from 'lodash';

import PropTypes from 'prop-types';
import { isMobileDetected } from '~/utils/mobileDetect';

import { horizontalStrategy } from './strategies/horizontal';
import { verticalStrategy } from './strategies/vertical';
import {
  calculatePercentForValue,
  calculateValueFromPercent,
  updateFromValue,
  updateToValue,
} from './utils';
import FromInput from './inputs/FromInput';
import ToInput from './inputs/ToInput';
import { RangeSliderControl, RangeSliderOrientation } from './constants';

import styles from './RangeSlider.css';

interface RangeSliderProps extends PropTypes.InferProps<typeof rangeSliderPropTypes> {}

const RangeSlider = (props: RangeSliderProps): JSX.Element => {
  const {
    min,
    max,
    from,
    to,
    minRange,
    disabled,
    onChange,
    orientation,
    precision,
    isSingleRange,
    isWithoutInput,
  } = props;

  const [fromInputValue, setFromInputValue] = useState(null);
  const [toInputValue, setToInputValue] = useState(null);

  const [strategy, setStrategy] = useState(null);

  const [lastMoved, setLastMoved] = useState(RangeSliderControl.FROM);
  const [activeInput, setActiveInput] = useState(null);
  const [computedStyles, setComputedStyles] = useState({});
  const [focusedEl, setFocusedEl] = useState({
    from: false,
    bar: false,
    to: false,
  });

  const railRef = useRef(null);
  const fromThumbRef = useRef(null);
  const toThumbRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const isHorizontalOrientation = orientation === RangeSliderOrientation.HORIZONTAL;
  const isVerticalOrientation = orientation === RangeSliderOrientation.VERTICAL;
  const isSingleRangeWithoutInput = isSingleRange && isWithoutInput;

  useEffect(() => {
    if (orientation === RangeSliderOrientation.HORIZONTAL) {
      setStrategy(horizontalStrategy);
    }

    if (orientation === RangeSliderOrientation.VERTICAL) {
      setStrategy(verticalStrategy);
    }
  }, [orientation]);

  useEffect(() => {
    if (isSingleRange) {
      onChange({ from: 0, to });
    }
  }, [isSingleRange]);

  useEffect(() => {
    if (strategy) {
      const roundedFrom = round(from, precision);
      const roundedTo = round(to, precision);
      const roundedMin = round(min, precision);
      const roundedMax = round(max, precision);

      const fromPercent = calculatePercentForValue(roundedFrom, roundedMin, roundedMax);
      const toPercent = calculatePercentForValue(roundedTo, roundedMin, roundedMax);

      setComputedStyles({
        [RangeSliderControl.FROM]: strategy.getThumbStyles(
          fromPercent,
          lastMoved === RangeSliderControl.FROM
        ),
        [RangeSliderControl.TO]: strategy.getThumbStyles(
          toPercent,
          lastMoved === RangeSliderControl.TO
        ),
        [RangeSliderControl.BAR]: strategy.getBarStyles(fromPercent, toPercent),
        [RangeSliderControl.FROM_INPUT]: strategy.getInputStyles(
          activeInput === RangeSliderControl.FROM ||
            activeInput === RangeSliderControl.BAR ||
            focusedEl.from
        ),
        [RangeSliderControl.TO_INPUT]: strategy.getInputStyles(
          activeInput === RangeSliderControl.TO ||
            activeInput === RangeSliderControl.BAR ||
            focusedEl.to
        ),
      });

      setFromInputValue(roundedFrom.toString());
      setToInputValue(roundedTo.toString());
    }
  }, [strategy, min, max, from, to, activeInput, focusedEl]);

  const onFromMove = event => {
    const coordinates = strategy.getCoordinates(event, railRef.current.getBoundingClientRect());
    const percent = calculatePercentForValue(coordinates.new, coordinates.min, coordinates.max);
    const newFrom = round(calculateValueFromPercent(percent, min, max), precision);

    if (newFrom !== from) {
      const range = updateFromValue(newFrom, from, to, min, minRange);
      onChange(range);
    }
  };

  const onToMove = event => {
    const coordinates =
      isVerticalOrientation && isSingleRange
        ? strategy.getRotatedCoordinates(event, railRef.current.getBoundingClientRect())
        : strategy.getCoordinates(event, railRef.current.getBoundingClientRect());
    const percent = calculatePercentForValue(coordinates.new, coordinates.min, coordinates.max);
    const newTo = round(calculateValueFromPercent(percent, min, max), precision);

    if (newTo !== to) {
      const range = updateToValue(newTo, from, to, max, minRange);
      onChange(range);
    }
  };

  const onBarMove = (event, startCoordinates) => {
    const coordinates = strategy.getBarCoordinates(
      event,
      startCoordinates,
      railRef.current.getBoundingClientRect()
    );
    const percent = calculatePercentForValue(coordinates.new, coordinates.min, coordinates.max);
    let newFrom = round(calculateValueFromPercent(percent, min, max), precision);
    let newTo = round(to + (newFrom - from), precision);

    if (newFrom < min) {
      const diff = min - newFrom;
      newFrom = min;
      newTo = round(newTo + diff, precision);
    }

    if (newTo > max) {
      const diff = newTo - max;
      newTo = max;
      newFrom = round(newFrom - diff, precision);
    }

    if (newFrom !== from && newTo !== to && newFrom >= min && newTo <= max) {
      onChange({ from: newFrom, to: newTo });
    }
  };

  const onMove = control => {
    if (control === RangeSliderControl.FROM) {
      return onFromMove;
    }

    if (control === RangeSliderControl.TO) {
      return onToMove;
    }

    return onBarMove;
  };

  const onMouseEnter = control => {
    if (control === RangeSliderControl.BAR) {
      setFocusedEl({
        from: true,
        bar: true,
        to: true,
      });
      return;
    }
    setFocusedEl({ ...focusedEl, [control]: true });
  };

  const onMouseLeave = control => {
    if (control === RangeSliderControl.BAR) {
      setFocusedEl({
        from: false,
        bar: false,
        to: false,
      });
      return;
    }
    setFocusedEl({ ...focusedEl, [control]: false });
  };

  const onMouseDown = (control, startEvent) => {
    if ((isSingleRange && control === RangeSliderControl.BAR) || disabled) {
      return;
    }
    // Block layout grid drag
    startEvent.stopPropagation();
    setLastMoved(control);
    setActiveInput(control);

    const { clientX, clientY } = startEvent;
    const { x, y } = startEvent.target.getBoundingClientRect();

    function onMouseMove(event) {
      onMove(control)(event, { clientX, clientY, x, y });
    }

    // lock slider update rate to 240+ per sec
    const throttledMove = throttle(onMouseMove, 4);

    function onMouseUp() {
      setActiveInput(null);
      document.removeEventListener('mousemove', throttledMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', throttledMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const setControlValue = control => {
    if (control === RangeSliderControl.FROM) {
      return setFromInputValue;
    }
    return setToInputValue;
  };

  const onInputChange = (control, event) => {
    const { value } = event.target;
    if (!Number.isNaN(Number(value))) {
      setControlValue(control)(value);
    }
  };

  const validateInputChange = (control, event) => {
    const { value } = event.target;
    const roundValue = round(value, precision);

    if (control === RangeSliderControl.FROM) {
      const range = updateFromValue(roundValue, from, to, min, minRange);
      onChange(range);
    }

    if (control === RangeSliderControl.TO) {
      const range = updateToValue(roundValue, from, to, max, minRange);
      onChange(range);
    }
  };

  return (
    <div
      className={classNames({
        [styles.disabled]: disabled,
        [styles.rangeSliderHorizontal]: isHorizontalOrientation,
        [styles.rangeSliderVertical]: isVerticalOrientation,
        [styles.rotatedVerticalRange]: isVerticalOrientation && isSingleRange,
      })}
    >
      {!isSingleRange && (
        <FromInput
          compStyles={computedStyles[RangeSliderControl.FROM_INPUT]}
          isVerticalOrientation={isVerticalOrientation}
          max={max}
          disabled={disabled}
          precision={precision}
          fromInputRef={fromInputRef}
          from={from}
          fromInputValue={fromInputValue}
          onInputChange={onInputChange}
          validateInputChange={validateInputChange}
        />
      )}
      <div
        className={classNames(styles.rangeSliderRail, {
          [styles.rangeSliderRailHorizontal]: isHorizontalOrientation,
          [styles.rangeSliderRailVertical]: isVerticalOrientation,
        })}
        ref={railRef}
      >
        {!isSingleRange && (
          <div
            ref={fromThumbRef}
            className={classNames(
              styles.rangeSliderThumb,
              isMobileDetected && styles.mobileRangeSliderThumb
            )}
            style={computedStyles[RangeSliderControl.FROM]}
            onMouseDown={event => onMouseDown(RangeSliderControl.FROM, event)}
            onMouseEnter={() => {
              onMouseEnter(RangeSliderControl.FROM);
            }}
            onMouseLeave={() => {
              onMouseLeave(RangeSliderControl.FROM);
            }}
          >
            <div className={styles.rangeSliderLabel} />
          </div>
        )}
        <div
          className={classNames(styles.rangeSliderBar, {
            [styles.rangeSliderBarHorizontal]: isHorizontalOrientation,
            [styles.rangeSliderBarVertical]: isVerticalOrientation,
          })}
          style={computedStyles[RangeSliderControl.BAR]}
          onMouseDown={event => onMouseDown(RangeSliderControl.BAR, event)}
          onMouseEnter={() => {
            onMouseEnter(RangeSliderControl.BAR);
          }}
          onMouseLeave={() => {
            onMouseLeave(RangeSliderControl.BAR);
          }}
        >
          <div
            className={classNames(styles.rangeSliderBarView, {
              [styles.rangeSliderBarViewHorizontal]: isHorizontalOrientation,
              [styles.rangeSliderBarViewVertical]: isVerticalOrientation,
            })}
          />
        </div>
        <div
          ref={toThumbRef}
          className={classNames(
            styles.rangeSliderThumb,
            isMobileDetected && styles.mobileRangeSliderThumb
          )}
          style={computedStyles[RangeSliderControl.TO]}
          onMouseDown={event => onMouseDown(RangeSliderControl.TO, event)}
          onMouseEnter={() => {
            onMouseEnter(RangeSliderControl.TO);
          }}
          onMouseLeave={() => {
            onMouseLeave(RangeSliderControl.TO);
          }}
        >
          <div className={styles.rangeSliderLabel} />
        </div>
      </div>
      {!isSingleRangeWithoutInput && (
        <ToInput
          compStyles={computedStyles[RangeSliderControl.TO_INPUT]}
          disabled={disabled}
          isVerticalOrientation={isVerticalOrientation}
          rotated={isVerticalOrientation && isSingleRange}
          max={max}
          precision={precision}
          toInputRef={toInputRef}
          to={to}
          toInputValue={toInputValue}
          onInputChange={onInputChange}
          validateInputChange={validateInputChange}
        />
      )}
    </div>
  );
};

const rangeSliderPropTypes = {
  min: PropTypes.number,
  max: PropTypes.number,

  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,

  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  precision: PropTypes.number,

  minRange: PropTypes.number,
  // maxDiffRange: PropTypes.number, //todo

  onChange: PropTypes.func,

  isSingleRange: PropTypes.bool,
  isWithoutInput: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
};

RangeSlider.propTypes = rangeSliderPropTypes;

RangeSlider.defaultProps = {
  min: 0,
  max: 100,
  orientation: 'horizontal',
  precision: 0,
  minRange: 0,
  onChange: () => {},
  isSingleRange: false,
  isWithoutInput: false,
};

export default RangeSlider;
