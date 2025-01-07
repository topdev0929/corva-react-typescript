import PropTypes from 'prop-types';
import { MenuItem, Select, FormControl, InputLabel, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  formControl: {
    width: 130,
    marginLeft: 10,
    marginTop: 8,
  },
});

function SingleSelect({ items, currentValue, onChange, label, 'data-testid': dataTestId }) {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      {label && (
        <InputLabel shrink htmlFor="c-owp-single-select">
          {label}
        </InputLabel>
      )}
      <Select
        data-testid={dataTestId}
        autoWidth
        value={currentValue}
        onChange={onChange}
        inputProps={{
          name: 'c-owp-single-select',
          id: 'c-owp-single-select',
        }}
      >
        {items.map(item => (
          <MenuItem
            data-testid={`${dataTestId}_option_${item.title || item.name || item}MenuItem`}
            key={item.key || item.id || item}
            value={item.key || item.id || item}
          >
            {item.title || item.name || item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SingleSelect.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  'data-testid': PropTypes.string,
};

SingleSelect.defaultProps = {
  label: '',
  'data-testid': 'SingleSelect',
};

export default SingleSelect;
