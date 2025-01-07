import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Tooltip, withStyles } from '@material-ui/core';
import { debounce } from 'lodash';

const muiStyles = {
  formControl: {
    width: 130,
    marginLeft: 10,
    marginTop: 8,
  },
};

const debouncedFunc = debounce(callback => {
  callback();
}, 1500);

function RadiusInput({ radius, editable, onChange, classes, 'data-testid': dataTestId }) {
  const [value, setValue] = useState(radius);
  const [error, setError] = useState(null);

  useEffect(() => {
    setValue(radius);
  }, [radius]);

  const handleChangeValue = e => {
    const newValue = e.target.value;

    if (!Number.isFinite(+newValue) || +newValue < 0) {
      setError('Incorrect radius');
    } else {
      setError(null);
      debouncedFunc(() => {
        onChange(+newValue);
      });
    }

    setValue(newValue);
  };

  return (
    <Tooltip title={!editable ? 'To make radius active select Subject Well.' : ''}>
      <TextField
        data-testid={dataTestId}
        type="number"
        label="Radius (miles)"
        value={value}
        disabled={!editable}
        onChange={handleChangeValue}
        error={!!error}
        helperText={error}
        className={classes.formControl}
      />
    </Tooltip>
  );
}

RadiusInput.propTypes = {
  radius: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

RadiusInput.defaultProps = {
  'data-testid': 'RadiusInput',
};

export default withStyles(muiStyles)(RadiusInput);
