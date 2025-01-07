import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Popover,
  TextField,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import { Search as SearchIcon, Close as CloseIcon } from '@material-ui/icons';

import AutoCompleteAssetSearch from './AutoCompleteAssetSearch';

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
  paper: {
    background: theme.palette.background.b9,
    overflow: 'hidden',
  },
  dialogTitle: {
    padding: '16px',
    height: '60px',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '20px',
  },
  title: {
    fontSize: '20px',
  },
  dialogContent: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexFlow: 'row wrap',
    alignContent: 'flex-start',
    padding: 0,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  closeIcon: {
    color: theme.palette.primary.text6,
  },
}));

function AssetSearch({ company, onClickAsset, isTablet, isMobile }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopupOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopupClose = () => {
    setAnchorEl(null);
  };

  const handleClickAsset = asset => {
    const { redirectAssetId } = asset;
    if (redirectAssetId) {
      onClickAsset(redirectAssetId);
      handlePopupClose();
    }
  };

  return (
    <>
      <TextField
        type="text"
        id="well-section-search-textfield"
        placeholder={!isTablet && isMobile ? 'Well/Rig Search' : 'Add to List by Well/Rig Search'}
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

      {(isTablet || !isMobile) && (
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
            isTablet={isTablet}
            isMobile={isMobile}
          />
        </Popover>
      )}
      {!isTablet && isMobile && (
        <Dialog fullScreen open={Boolean(anchorEl)} classes={{ paper: classes.paper }}>
          <DialogTitle className={classes.dialogTitle}>
            <div className={classes.titleWrapper}>
              <Typography className={classes.title}>Search</Typography>
              <CloseIcon className={classes.closeIcon} onClick={handlePopupClose} />
            </div>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <AutoCompleteAssetSearch
              company={company}
              onClickAsset={handleClickAsset}
              onClose={handlePopupClose}
              isTablet={isTablet}
              isMobile={isMobile}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

AssetSearch.propTypes = {
  company: PropTypes.number.isRequired,
  onClickAsset: PropTypes.func.isRequired,
  isTablet: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

// Important: Do not change root component default export (AssetSearch.js). Use it as container
//  for your AssetSearch. It's required to make build and zip scripts work as expected;
export default memo(AssetSearch);
