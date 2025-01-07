import PropTypes from 'prop-types';

import { FormControl, Select, InputLabel, MenuItem, withStyles } from '@material-ui/core';

const TraceSelect = ({ value, onChange, mapping, classes, showLabel }) => {
  // eslint-disable-next-line no-nested-ternary
  const label = showLabel ? 'Trace Name' : value ? '' : 'Choose a trace';
  return (
    <FormControl>
      <InputLabel htmlFor="traceKey">{label}</InputLabel>
      <Select
        displayEmpty
        value={value}
        className={classes.select}
        onChange={e => onChange(e.target.value)}
        inputProps={{
          name: 'traceKey',
        }}
      >
        {mapping &&
          mapping.map(({ key, name }) => (
            <MenuItem key={key} value={key}>
              {name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

TraceSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  showLabel: PropTypes.bool,
  mapping: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};

TraceSelect.defaultProps = {
  value: '',
  showLabel: false,
};

export default withStyles({
  select: {
    width: 200,
  },
})(TraceSelect);
