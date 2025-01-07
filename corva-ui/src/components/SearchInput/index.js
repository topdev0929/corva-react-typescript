import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { Paper, InputBase, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 30,
    paddingLeft: 19,
    borderRadius: 30,
    boxShadow: 'none',
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
    },
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 200,
  },
  searchIcon: {
    height: 16,
    width: 16,
    color: theme.palette.primary.contrastText,
    marginRight: 9,
  },
  closeIcon: {
    height: 16,
    width: 16,
    margin: '0 10px',
    color: theme.palette.primary.text6,
    cursor: 'pointer',
  },
}));

function SearchInput({ handleSearch, className }) {
  const styles = useStyles();

  const [inputValue, setInputValue] = useState('');

  const handleChangeDebounced = useCallback(debounce(handleSearch, 500), []);

  const handleInputChange = targetValue => {
    setInputValue(targetValue);

    handleChangeDebounced(targetValue);
  };

  return (
    <Paper className={classNames(styles.root, className)}>
      <SearchIcon className={styles.searchIcon} />
      <InputBase
        className={styles.input}
        placeholder="Search ..."
        value={inputValue}
        inputProps={{ 'aria-label': 'search' }}
        onChange={e => handleInputChange(e.target.value)}
      />
      {inputValue && (
        <CloseIcon
          className={styles.closeIcon}
          onClick={() => {
            handleSearch('');
            setInputValue('');
          }}
        />
      )}
    </Paper>
  );
}

SearchInput.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

SearchInput.defaultProps = {
  className: '',
};

export default SearchInput;
