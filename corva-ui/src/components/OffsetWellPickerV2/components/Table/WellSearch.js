import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import AutoComplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles({
  paper: {
    boxShadow:
      '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
  },
  endAdornment: {
    display: 'none',
  },
});

// NOTE: For auto complete option labels
const getOptionLabel = option => option.name;
function WellSearch({ wells, onChange }) {
  const classes = useStyles();

  return (
    <AutoComplete
      openOnFocus
      options={wells}
      disableClearable
      blurOnSelect
      classes={{
        paper: classes.paper,
        endAdornment: classes.endAdornment,
      }}
      value={null}
      getOptionLabel={getOptionLabel}
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Add to List by Well Search"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      onChange={(e, newWell) => {
        if (newWell && newWell.id) {
          onChange(newWell.id);
        }
      }}
    />
  );
}

WellSearch.propTypes = {
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default WellSearch;
