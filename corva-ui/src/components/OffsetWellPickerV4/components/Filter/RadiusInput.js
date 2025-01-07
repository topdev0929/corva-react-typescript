import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextField, Tooltip } from '@material-ui/core';
import { debounce } from 'lodash';
import { convertValue } from '~/utils';
import { getIsImperial } from '../../utils/unitSystem';

const debouncedFunc = debounce(callback => {
  callback();
}, 1500);

export const isBuggySymbolEntered = event => {
  const char = event?.nativeEvent?.data;
  const isNotValidMinus = char === '-' && event.target.value === '';
  return char === 'e' || char === 'E' || char === '+' || char === '.' || isNotValidMinus;
};

export const RadiusInput = ({ radius, editable, onChange, 'data-testid': PAGE_NAME }) => {
  const [value, setValue] = useState(radius);
  const [error, setError] = useState(null);
  const isImperial = useMemo(() => getIsImperial(), []);

  useEffect(() => {
    const radiusValue = isImperial ? radius : convertValue(radius, 'length', 'mi', 'km', 3);
    setValue(Number.parseFloat(radiusValue).toFixed(2));
  }, [radius]);

  const handleChangeValue = e => {
    const newValue = e.target.value;
    if (isBuggySymbolEntered(e)) {
      return;
    }

    if (!Number.isFinite(+newValue) || +newValue < 0) {
      setError('Incorrect radius');
    } else {
      setError(null);
      const newRaduis = isImperial ? +newValue : convertValue(newValue, 'length', 'km', 'mi', 3);
      debouncedFunc(() => {
        onChange(+newRaduis);
      });
    }

    setValue(newValue);
  };
  return (
    <Tooltip title={!editable ? 'To make radius active select Subject Well.' : ''}>
      <TextField
        data-testid={`${PAGE_NAME}_input`}
        key="ows4-radius-input"
        type="number"
        label={`Radius (${isImperial ? 'miles' : 'km'})`}
        value={value || ''}
        disabled={!editable}
        onChange={handleChangeValue}
        error={!!error}
        helperText={error}
      />
    </Tooltip>
  );
};

RadiusInput.propTypes = {
  radius: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  "data-testid": PropTypes.string,
};

RadiusInput.defaultProps = {
  "data-testid": "RadiusInput",
};
