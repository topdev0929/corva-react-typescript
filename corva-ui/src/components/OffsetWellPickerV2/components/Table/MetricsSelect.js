import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const muiStyles = {
  select: {
    '&:before': {
      borderBottom: 0,
    },
    '&:after': {
      borderBottom: 0,
    },
  },
  formControl: {
    width: '150px',
  },
  listItem: {
    padding: 0,
  },
  listItemPrimaryText: {
    color: '#fff',
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  paper: {
    backgroundColor: '#414141',
    maxHeight: '300px',
  },
};

function MetricsSelect({ items, currentValue, onChange, classes, 'data-testid': dataTestId }) {
  return (
    <FormControl className={classes.formControl}>
      <Select
        data-testid={`${dataTestId}_select`}
        className={classes.select}
        MenuProps={{ classes: { paper: classes.paper } }}
        autoWidth
        value={currentValue}
        onChange={e => onChange(e.target.value)}
      >
        {items.map(item => (
          <MenuItem
            data-testid={`${dataTestId}_option_${item.key}MenuItem`}
            key={item.key}
            value={item.key}
          >
            <ListItemText
              primary={item.label}
              classes={{ root: classes.listItem, primary: classes.listItemPrimaryText }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

MetricsSelect.propTypes = {
  items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  currentValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  'data-testid': PropTypes.string,
};

MetricsSelect.defaultProps = {
  'data-testid': 'MetricsSelect',
};

export default withStyles(muiStyles)(MetricsSelect);
