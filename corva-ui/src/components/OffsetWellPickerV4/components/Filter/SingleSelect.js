import PropTypes from 'prop-types';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const PAGE_NAME = 'SingleSelect';

export const SingleSelect = ({
  label,
  currentValue,
  options,
  className,
  renderValue,
  onChange,
}) => {
  return (
    <FormControl className={className}>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <Select
        data-testid={`${PAGE_NAME}_select_${label}`}
        value={currentValue}
        renderValue={renderValue}
        onChange={onChange}
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

SingleSelect.propTypes = {
  label: PropTypes.string,
  currentValue: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  className: PropTypes.string.isRequired,
  renderValue: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

SingleSelect.defaultProps = {
  label: '',
  renderValue: null,
};
