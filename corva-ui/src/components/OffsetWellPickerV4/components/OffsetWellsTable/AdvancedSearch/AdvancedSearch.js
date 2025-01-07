import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover, TextField, InputAdornment } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import AutoCompleteAssetSearch from './AutoCompleteAssetSearch';

import styles from './AdvancedSearch.module.css';

export const AdvancedSearch = ({
  companyId,
  subjectWellId,
  onChange,
  selectedWellIds,
  onHideAdvancedSearch,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState('');
  const searchRef = useRef();

  const handlePopupOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopupClose = () => {
    setValue('');
    setAnchorEl(null);
    onHideAdvancedSearch();
  };

  return (
    <>
      <TextField
        data-testid="ows_advanced_search"
        id="well-section-search-textfield"
        placeholder="Add Offset ..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.searchIcon} />
            </InputAdornment>
          ),
          className: styles.searchInput,
        }}
        classes={{ root: styles.searchRoot }}
        ref={searchRef}
        value={value}
        onChange={event => {
          setValue(event.target.value);
          if (event.target.value) {
            setAnchorEl(searchRef.current);
          }
        }}
        onClick={handlePopupOpen}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopupClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <AutoCompleteAssetSearch
          subjectWellId={subjectWellId}
          value={value}
          company={companyId}
          selectedWellIds={selectedWellIds}
          onChange={onChange}
          onClose={handlePopupClose}
        />
      </Popover>
    </>
  );
};

AdvancedSearch.propTypes = {
  companyId: PropTypes.number.isRequired,
  subjectWellId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedWellIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onHideAdvancedSearch: PropTypes.func.isRequired,
};
