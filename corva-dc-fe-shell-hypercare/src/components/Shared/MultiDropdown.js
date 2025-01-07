import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  selectFormControl: { marginBottom: 16, width: '164px' },
});

function MultiDropdown(props) {
  const { paramList, paramName, label, value, onChange } = props;
  const classes = useStyles();

  return (
    <FormControl classes={{ root: classes.selectFormControl }}>
      <InputLabel htmlFor={paramName}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        inputProps={{ name: paramName, id: paramName }}
        onChange={e => onChange(paramName, e.target.value)}
        renderValue={selected => `${selected.length} selected`}
      >
        {paramList.map(item => (
          <MenuItem key={item.key} value={item.key}>
            <Checkbox checked={value.indexOf(item.key) > -1} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

MultiDropdown.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  paramName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default memo(MultiDropdown);
