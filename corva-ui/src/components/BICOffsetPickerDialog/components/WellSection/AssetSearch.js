import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Popover, TextField, InputAdornment } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import AutoCompleteAssetSearch from './AutoCompleteAssetSearch';

const PAGE_NAME = 'AssetSearch';

const useStyles = makeStyles(theme => ({
  searchInput: {
    fontSize: '16px',
    width: '270px',
    '&:hover': {
      '&::before': { borderBottom: `2px solid ${theme.palette.primary.text1} !important` },
    },
    '&:hover $searchIcon': {
      fill: `${theme.palette.primary.text1} !important`,
    },
  },
  searchIcon: {
    fill: `${theme.palette.primary.text6} !important`,
    fontSize: '24px !important',
  },
}));

function AssetSearch({ company, onClickAsset }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopupOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
  };

  const handleClickAsset = asset => {
    const { name, redirectAssetId } = asset;
    if (redirectAssetId) {
      onClickAsset(redirectAssetId, name);
      handlePopupClose();
    }
  };

  return (
    <>
      <TextField
        data-testid={`${PAGE_NAME}_search`}
        id="well-section-search-textfield"
        placeholder="Add to List by Well/Rig Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
          ),
          className: classes.searchInput,
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
          company={company}
          onClickAsset={handleClickAsset}
          onClose={handlePopupClose}
        />
      </Popover>
    </>
  );
}

AssetSearch.propTypes = {
  company: PropTypes.number.isRequired,
  onClickAsset: PropTypes.func.isRequired,
};

// Important: Do not change root component default export (AssetSearch.js). Use it as container
//  for your AssetSearch. It's required to make build and zip scripts work as expected;
export default memo(AssetSearch);
