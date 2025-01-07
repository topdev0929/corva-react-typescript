import { useState, useEffect } from 'react';
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
  checkBox: {
    color: 'grey',
    paddingLeft: 0,
  },
  formControl: {
    marginLeft: 10,
    marginTop: 8,
    width: ({ size }) => size,
  },
  listItemPrimaryText: { color: '#fff' },
  paper: {
    backgroundColor: '#414141',
  },
});

function MultiSelect({ options,
                       currentValues,
                       title,
                       size,
                       renderValue,
                       onChange,
                       'data-testid': dataTestId,
                     }) {
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const classes = useStyles({ size });

  useEffect(() => {
    setValues(currentValues.filter(value => options.includes(value)));
  }, [currentValues, options]);

  const handleOpen = () => {
    setOpen(true);
    setIsChanged(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (isChanged) {
      onChange(values);
    }
    setIsChanged(false);
  };

  const handleChange = e => {
    const selectedValues = e.target.value;
    setValues(selectedValues.includes('all') ? [] : selectedValues);
    setIsChanged(true);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel shrink htmlFor={`c-owp-multi-select-${title}`}>
        {title}
      </InputLabel>
      <Select
        data-testid={`${dataTestId}_select_${title}`}
        className={classes.select}
        MenuProps={{ classes: { paper: classes.paper } }}
        multiple
        displayEmpty
        fullWidth
        value={values}
        inputProps={{
          name: `c-owp-multi-select-${title}`,
          id: `c-owp-multi-select-${title}`,
        }}
        renderValue={selected => renderValue(selected.length)}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={handleChange}
      >
        <MenuItem key="all" value="all">
          <Checkbox
            data-testid={`${dataTestId}_option_all`}
            checked
            indeterminate={values.length > 0}
            className={classes.checkBox}
          />
          <ListItemText
            primary={renderValue(0)}
            classes={{ primary: classes.listItemPrimaryText }}
          />
        </MenuItem>

        <Divider />

        {options.map(option => (
          <MenuItem key={option} value={option}>
            <Checkbox
              data-testid={`${dataTestId}_option_${option}MenuItem`}
              checked={values.indexOf(option) > -1}
              className={classes.checkBox}
            />
            <ListItemText primary={option} classes={{ primary: classes.listItemPrimaryText }} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  renderValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  'data-testid': PropTypes.string,
};

MultiSelect.defaultProps = {
  'data-testid': 'MultiSelect',
};

export default MultiSelect;
