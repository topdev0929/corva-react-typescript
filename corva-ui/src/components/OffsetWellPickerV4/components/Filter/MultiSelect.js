import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Divider,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  multiMenuItem: {
    paddingLeft: '9px !important',
    paddingRight: '18px !important',
  },
});

export const MultiSelect = ({
  label,
  currentValues,
  options,
  ListMenuItem,
  ValueComponent,
  onChange,
  'data-testid': PAGE_NAME,
}) => {
  const classes = useStyles();
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setValues(currentValues || []);
  }, [currentValues, options]);

  const handleOpen = () => {
    setOpen(true);
    setIsChanged(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (isChanged) {
      onChange(values.length === 0 ? null : values);
    }
    setIsChanged(false);
  };

  const handleChange = e => {
    const selectedValues = e.target.value;
    setValues(selectedValues.includes('all') ? [] : selectedValues);
    setIsChanged(true);
  };

  const getSelectedValue = value => {
    if (ValueComponent && value.length === 1) return <ValueComponent value={value[0]} />;
    if (value.length === 0) return 'All';
    if (value.length === 1) return value[0];
    return `${value.length} Selected`;
  };

  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        data-testid={`${PAGE_NAME}_select_${label}`}
        multiple
        displayEmpty
        fullWidth
        value={values}
        renderValue={value => getSelectedValue(value)}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={handleChange}
      >
        <MenuItem key="all" value="all" classes={{ gutters: classes.multiMenuItem }}>
          <Checkbox
            data-testid={`${PAGE_NAME}_checkbox_all`}
            checked
            indeterminate={values.length > 0}
          />
          <ListItemText primary="All" />
        </MenuItem>

        <Divider />

        {options.map(option => (
          <MenuItem key={option} value={option} classes={{ gutters: classes.multiMenuItem }}>
            <Checkbox
              data-testid={`${PAGE_NAME}_checkbox_${option}`}
              checked={values.indexOf(option) !== -1}
            />
            <ListMenuItem value={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  ListMenuItem: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  ValueComponent: PropTypes.node,
  'data-testid': PropTypes.string,
};

MultiSelect.defaultProps = {
  ValueComponent: null,
  'data-testid': 'MultiSelect',
};
