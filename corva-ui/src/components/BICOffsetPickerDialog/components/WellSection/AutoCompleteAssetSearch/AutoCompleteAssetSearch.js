import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import get from 'lodash/get';

import { makeStyles, Chip, Input, Tooltip, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import AssetTypesSection from './AssetTypesSection';
import AssetResultSection from './AssetResultSection';

import { useAssetsData } from './effects';
import { SEARCH_CATEGORIES, CATEGORY_KEY_VALUES } from './constants';

const PAGE_NAME = 'AutoCompleteAssetSearch';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#414141',
    color: '#ffffff',
    fontSize: '11px',
    lineHeight: '16px',
    borderRadius: '4px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.12)',
    padding: '4px',
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '472px',
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
  },
  inputWrapper: {
    display: 'flex',
    width: 'auto',
    margin: '0 8px 8px',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  selectedChip: {
    height: '24px',
    margin: '4px',
  },
  selectedChipDeleteIcon: {
    width: '16px',
    height: '16px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
    },
  disabledIcon: {
    width: '16px',
    height: '16px',
    color: theme.palette.primary.text6,
    opacity: 0.4,
  },
  closeIconButton: {
    padding: 0,
    '&:hover $closeIcon': {
      color: theme.palette.primary.text1,
    },
  },
  searchInput: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #03BCD4',
  },
  closeIcon: {
    color: theme.palette.primary.text6,
    fontSize: '18px',
  },
}));

const AutoCompleteAssetSearch = ({ onClickAsset, company }) => {
  const [assetType, setAssetType] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const searchInputRef = useRef();

  const [loading, groupedAssets] = useAssetsData(searchKey, assetType, page, company);

  const handleDeleteAssetType = () => {
    setAssetType(null);
    setPage(1);
  };

  const handleChangeAssetType = key => {
    searchInputRef.current.focus();
    setAssetType(key);
    setPage(1);
  };

  const handleChangeSearchKey = ({ target: { value } }) => {
    setSearchKey(value);
    setPage(1);
  };

  const handleKeyPress = e => {
    const { value } = e.target;
    const { keyCode } = e;

    const availableCategory = CATEGORY_KEY_VALUES.find(
      ([_, item]) => item.autoCategorizedKey === value.trim().toLowerCase()
    );

    // NOTE: when type one of categories defined and press enter key or space key
    // then asset type will be auto selected and clear input field
    if (availableCategory && (keyCode === 13 || keyCode === 32)) {
      setSearchKey('');
      setAssetType(availableCategory[0]);
      setPage(1);
      return;
    }

    // NOTE: when there is no value in input field and press back space key,
    // then clear asset type as well.
    if (value === '' && keyCode === 8) {
      setAssetType(null);
      setPage(1);
    }
  };

  const handleSearchClear = () => {
    searchInputRef.current.focus();
    setSearchKey('');
    setAssetType(null);
    setPage(1);
  };

  const handleScrollReached = position => {
    if (position === 'top' && page > 1) {
      setPage(prev => prev - 1);
    }
    if (position === 'bottom') {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.inputWrapper}>
        <div className={classes.searchInput}>
          {assetType && (
            <Chip
              data-not-migrated-muichip
              classes={{ root: classes.selectedChip, deleteIcon: classes.selectedChipDeleteIcon }}
              label={get(SEARCH_CATEGORIES, [assetType, 'labelPlural'], 'Assets')}
              deleteIcon={<CloseIcon />}
              onDelete={handleDeleteAssetType}
            />
          )}
          <Input
            data-testid={`${PAGE_NAME}_searchInput`}
            inputRef={searchInputRef}
            autoFocus
            disableUnderline
            fullWidth
            value={searchKey || ''}
            placeholder={`Search ${get(
              SEARCH_CATEGORIES,
              [assetType, 'labelPlural'],
              'assets'
            )}...`}
            onChange={handleChangeSearchKey}
            onKeyUp={handleKeyPress}
          />
          <StyledTooltip title="Clear">
            <CloseIcon
              className={
                assetType || searchKey ? classes.selectedChipDeleteIcon : classes.disabledIcon
              }
              onClick={handleSearchClear}
            />
          </StyledTooltip>
        </div>
      </div>

      {!assetType && !searchKey && <AssetTypesSection onClickAssetType={handleChangeAssetType} />}
      {(assetType || searchKey) && (
        <AssetResultSection
          loading={loading}
          page={page}
          groupedAssets={groupedAssets}
          onClickAsset={onClickAsset}
          onScrollReached={handleScrollReached}
        />
      )}
    </div>
  );
};

AutoCompleteAssetSearch.propTypes = {
  company: PropTypes.number.isRequired,
  onClickAsset: PropTypes.func.isRequired,
};

export default withRouter(AutoCompleteAssetSearch);
