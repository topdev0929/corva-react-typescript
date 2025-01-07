import { round } from 'lodash';

import { RangeSliderControl } from '../constants';

import styles from '../Input.css';

const FromInput = props => {
  const {
    compStyles,
    fromInputRef,
    disabled,
    precision,
    from,
    fromInputValue,
    onInputChange,
    validateInputChange,
  } = props;

  const roundedFrom = round(from, precision);

  const onKeyDown = event => {
    if (event.key === 'Enter') {
      validateInputChange(RangeSliderControl.FROM, event);
    }
  };

  return (
    <div>
      <input
        style={compStyles}
        ref={fromInputRef}
        disabled={disabled}
        className={styles.rangeSliderInput}
        type="text"
        size={`${roundedFrom}`.length || 1}
        value={fromInputValue}
        onChange={event => {
          onInputChange(RangeSliderControl.FROM, event);
        }}
        onBlur={event => validateInputChange(RangeSliderControl.FROM, event)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default FromInput;
