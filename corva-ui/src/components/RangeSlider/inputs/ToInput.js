import { round } from 'lodash';
import classNames from 'classnames';

import { RangeSliderControl } from '../constants';

import styles from '../Input.css';

const ToInput = props => {
  const {
    compStyles,
    rotated,
    precision,
    toInputRef,
    disabled,
    to,
    toInputValue,
    onInputChange,
    validateInputChange,
  } = props;

  const roundedTo = round(to, precision);

  const onKeyDown = event => {
    if (event.key === 'Enter') {
      validateInputChange(RangeSliderControl.TO, event);
    }
  };

  return (
    <div>
      <input
        style={compStyles}
        ref={toInputRef}
        disabled={disabled}
        className={classNames(styles.rangeSliderInput, { [styles.rotated]: rotated })}
        type="text"
        size={`${roundedTo}`.length || 1}
        value={toInputValue}
        onChange={event => onInputChange(RangeSliderControl.TO, event)}
        onBlur={event => validateInputChange(RangeSliderControl.TO, event)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default ToInput;
