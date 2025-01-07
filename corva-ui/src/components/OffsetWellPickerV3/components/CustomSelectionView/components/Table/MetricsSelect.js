import PropTypes from 'prop-types';
import { Select, MenuItem, FormControl, ListItemText, withStyles } from '@material-ui/core';

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

function MetricsSelect({ items, currentValue, onChange, classes }) {
  return (
    <FormControl className={classes.formControl}>
      <Select
        className={classes.select}
        MenuProps={{ classes: { paper: classes.paper } }}
        autoWidth
        value={currentValue}
        onChange={e => onChange(e.target.value)}
      >
        {items.map(item => (
          <MenuItem key={item.key} value={item.key}>
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
};

export default withStyles(muiStyles)(MetricsSelect);
