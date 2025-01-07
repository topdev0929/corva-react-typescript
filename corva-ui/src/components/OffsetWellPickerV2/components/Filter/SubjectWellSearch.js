import { memo } from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles } from '@material-ui/core';
import AutoComplete from '@material-ui/lab/Autocomplete';

const PAGE_NAME = 'SubjectWellSearch';

const useStyles = makeStyles({
  root: {
    marginLeft: 10,
    marginTop: 8,
    width: 130,
  },
  paper: {
    maxHeight: 400,
    width: 320,
    boxShadow:
      '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
  },
});

function SubjectWellSearch({ wells, subjectWell, onChange }) {
  const getOptionLabel = option => option.name;

  const classes = useStyles();

  return (
    <AutoComplete
      data-testid={`${PAGE_NAME}_autocomplete`}
      openOnFocus
      options={wells}
      disableClearable
      blurOnSelect
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      value={subjectWell}
      getOptionLabel={getOptionLabel}
      renderInput={params => <TextField {...params} label="Subject Well" />}
      onChange={(e, newWell) => {
        onChange(newWell.id);
      }}
    />
  );
}

SubjectWellSearch.propTypes = {
  wells: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  subjectWell: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
};

SubjectWellSearch.defaultProps = {
  subjectWell: null,
};

export default memo(SubjectWellSearch);
