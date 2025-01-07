import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { InputAdornment, TextField } from '@material-ui/core';

const MIN_VALUE = 0.1;
const MAX_VALUE = 120;
const ESCAPE_KEY_CODE = 'Enter';
const CONTROL_KEYS = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete', ESCAPE_KEY_CODE];

const isValidKey = e => {
  const pattern = /[\d\\.,]/;
  const { key } = e;

  return CONTROL_KEYS.includes(key) || pattern.test(key);
};

const isValidInput = input => {
  const pattern = /^[0-9]{1,3}([.,]\d{1,3})?$/;
  return pattern.test(input);
};

function LastCustomTimeInput({ value, className, onChange }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!isValidInput(currentValue)) {
      setErrorMessage('Enter valid number');
    } else if (currentValue < MIN_VALUE) {
      setErrorMessage(`Min value ${MIN_VALUE}hrs`);
    } else if (currentValue > MAX_VALUE) {
      setErrorMessage(`Max value ${MAX_VALUE}hrs`);
    } else {
      setErrorMessage(null);
    }
  }, [currentValue]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleValueSubmit = () => !errorMessage && currentValue !== value && onChange(currentValue);
  const handleKeyDown = e => {
    if (!isValidKey(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === ESCAPE_KEY_CODE) {
      handleValueSubmit();
    }
  };

  return (
    <TextField
      fullWidth
      label="Show Last"
      margin="none"
      type="text"
      className={className}
      value={currentValue}
      helperText={errorMessage}
      onChange={({ target }) => setCurrentValue(target.value)}
      onBlur={handleValueSubmit}
      onKeyDown={handleKeyDown}
      error={!!errorMessage}
      InputLabelProps={{ shrink: Number.isFinite(currentValue) || currentValue || !!errorMessage }}
      InputProps={{
        endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
      }}
    />
  );
}

LastCustomTimeInput.propTypes = {
  value: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default LastCustomTimeInput;
