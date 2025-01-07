import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const PAGE_NAME = 'PeriodSelect';

export const PeriodSelect = ({ label, currentValue, options, onChange }) => {
  const handleChange = e => {
    onChange(e.target.value.includes('all') ? null : e.target.value);
  };
  return (
    <FormControl style={{ width: '100%' }}>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <Select
        data-testid={`${PAGE_NAME}_select`}
        value={currentValue}
        onChange={handleChange}
      >
        {options.map(({ value, label }) => (
          <MenuItem
            data-testid={`${PAGE_NAME}_option_${value}MenuItem`}
            key={value}
            value={value}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

PeriodSelect.propTypes = {
  label: PropTypes.string,
  currentValue: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
};

PeriodSelect.defaultProps = {
  label: '',
};
