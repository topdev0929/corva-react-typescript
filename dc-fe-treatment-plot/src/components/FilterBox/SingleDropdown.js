import { memo } from 'react';
import PropTypes from 'prop-types';

import { Select, InputLabel, MenuItem, FormControl, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  selectFormControl: {
    marginBottom: 16,
  },
});

function SingleDropdown(props) {
  const { paramList, paramName, label, value, onChange, dropdownMenuClass } = props;
  const classes = useStyles();

  return (
    <FormControl fullWidth className={classes.selectFormControl}>
      <InputLabel htmlFor={paramName}>{label}</InputLabel>
      <Select
        fullWidth
        value={value}
        inputProps={{ name: paramName, id: paramName }}
        MenuProps={{ PopoverClasses: { paper: dropdownMenuClass } }}
        onChange={e => {
          if (e.target.value) onChange(paramName, e.target.value);
        }}
      >
        {paramList.map(({ key, name }) => (
          <MenuItem value={key} key={key}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SingleDropdown.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  paramName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  dropdownMenuClass: PropTypes.string,
};

export default memo(SingleDropdown);
