import { useMemo, useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { debounce, identity } from 'lodash';

import {
  FormControl,
  InputLabel,
  TextField,
  FormHelperText,
  withStyles,
  Typography,
  List,
  InputAdornment,
  Chip,
  Tooltip,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import TruncatedText from '../TruncatedText';
import { PER_PAGE, SCROLL_THRESHOLD } from './constants';
import { useAssetAutoCompleteSelectData } from './effects';

const PAGE_NAME = 'DC_SingleAssetEditorAutocomplete';

const muiStyles = theme => ({
  formControl: {},
  listbox: { maxHeight: 350 },
  root: { fontSize: 16 },
  inputRoot: {
    paddingTop: 16,
    padding: '8px 0',
    paddingBottom: 0,
    width: 350,
    fontSize: 16,
  },
  popupIndicator: { display: 'none' },
  option: {
    paddingLeft: '16px !important',
    height: 36,
    '&[aria-disabled=true]': {
      color: theme.palette.primary.text9,
      opacity: 1,
      backgroundColor: 'unset',
    },
  },
  noOptions: { padding: 0 },
  searchIcon: { fontSize: '20px !important' },
});

const infoListItemStyles = {
  paddingLeft: '16px',
  height: 36,
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
};

/* eslint-disable react/prop-types */
const InfoListItem = ({ text = 'Loading...' }) => (
  <li key="loading" style={infoListItemStyles}>
    <Typography variant="body2" color="textSecondary">
      {text}
    </Typography>
  </li>
);

const ListboxComponent = forwardRef(({ children, loading, hasMore, ...otherProps }, ref) => (
  <List {...otherProps} ref={ref} role="listbox">
    {children}
    {(hasMore || loading) && <InfoListItem />}
  </List>
));
/* eslint-enable react/prop-types */

const AssetEditorAutocomplete = ({
  'data-testid': dataTestId,
  appKey,
  assetType,
  classes,
  companyId,
  currentValue,
  disabled,
  disableClearable,
  errorText,
  isMultiple,
  isNullable,
  label,
  onChange,
  parentAssetId,
  parentAssetType,
  queryParams,
  autocompleteProps = {},
  assetFields,
}) => {
  // NOTE: Store currently selected option
  const [currentOption, setCurrentOption] = useState(isMultiple ? [] : null);

  const [searchText, setSearchText] = useState(''); // NOTE: For ui input
  const [searchValue, setSearchValue] = useState(''); // NOTE: Used for api filtering
  const [isSearchMode, setSearchMode] = useState(false);

  const [scrollPage, setScrollPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // NOTE: Asset type has been changed. Clear currently selected option
    setCurrentOption(isMultiple ? [] : null);
    setScrollPage(1);
    setSearchMode(false);
  }, [assetType]);

  const { assets, loading } = useAssetAutoCompleteSelectData({
    appKey,
    assetType,
    companyId,
    currentValue,
    isMultiple,
    parentAssetId,
    parentAssetType,
    scrollPage,
    searchText,
    setCurrentOption,
    queryParams,
    assetFields,
  });

  useEffect(() => {
    const hasMoreAssets = assets.length >= PER_PAGE * scrollPage;
    setHasMore(hasMoreAssets);
  }, [assets, scrollPage]);

  const onInputChange = useMemo(
    () =>
      debounce(value => {
        setScrollPage(1);
        setSearchText(value);
      }, 200),
    []
  );

  const handleInputChange = (event, value, reason) => {
    if (reason === 'input') {
      setSearchValue(value);
      setSearchMode(true);
      onInputChange(value); // NOTE: Trigger api call
    } else {
      // NOTE: Clean searchText for "reset" and "clear" reasons
      setSearchText('');
    }
  };

  const handleFetchNext = useMemo(
    () => debounce(() => setScrollPage(prevScrollPage => prevScrollPage + 1), 250),
    []
  );
  const onClose = () => {
    setSearchValue('');
    setSearchText('');
    setSearchMode(false);
    setScrollPage(1);
  };

  const onScrollListbox = event => {
    if (!hasMore || loading) return;
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >
      listboxNode.scrollHeight - SCROLL_THRESHOLD
    ) {
      handleFetchNext();
    }
  };

  const renderInput = params => (
    <TextField
      {...params}
      variant="standard"
      placeholder="Search for asset..."
      {...(!isMultiple && {
        InputProps: {
          ...params.InputProps,
          startAdornment: (
            <InputAdornment>
              <SearchIcon className={classes.searchIcon} />
            </InputAdornment>
          ),
        },
      })}
    />
  );

  const renderOption = ({ id, name }) => (
    <TruncatedText key={id} data-testid={`${PAGE_NAME}_option_${name}MenuItem`}>
      {isMultiple && currentValue.includes(id) ? `${name} (already selected)` : name}
    </TruncatedText>
  );

  const autocompleteClasses = {
    endAdornment: classes.endAdornment,
    inputRoot: classes.inputRoot,
    listbox: classes.listbox,
    noOptions: classes.noOptions,
    option: classes.option,
    popupIndicator: classes.popupIndicator,
    root: classes.root,
  };

  return (
    <FormControl disabled={disabled} error={!!errorText} className={classes.formControl}>
      {!isNullable && <InputLabel shrink>{label}</InputLabel>}
      <Tooltip title={currentOption?.name ?? ''}>
        <Autocomplete
          disabled={disabled}
          blurOnSelect
          classes={autocompleteClasses}
          clearOnBlur
          clearOnEscape
          data-testid={dataTestId}
          disableClearable={disableClearable}
          filterOptions={identity}
          getOptionLabel={option => option?.name}
          getOptionSelected={(option, value) => option && value && option.id === value.id}
          inputValue={isSearchMode ? searchValue : currentOption?.name || ''}
          ListboxComponent={ListboxComponent}
          ListboxProps={{ onScroll: onScrollListbox, loading, hasMore }}
          options={assets}
          onChange={(event, selected) => {
            setCurrentOption(selected);
            onChange(isMultiple ? selected.map(({ id }) => id) : selected?.id ?? null, selected);
          }}
          onClose={onClose}
          onInputChange={handleInputChange}
          noOptionsText={<InfoListItem text={loading ? 'Loading...' : 'No options'} />}
          renderInput={renderInput}
          renderOption={renderOption}
          value={currentOption}
          multiple={isMultiple}
          {...(isMultiple && {
            renderTags: (value, getTagProps) => {
              return value.map((option, index) => (
                <Chip key={option.id} label={option?.name} {...getTagProps({ index })} />
              ));
            },
            getOptionDisabled: option => currentValue.includes(option.id),
          })}
          {...autocompleteProps}
        />
      </Tooltip>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

AssetEditorAutocomplete.defaultProps = {
  label: 'Choose An Asset',
  currentValue: undefined,
  disableClearable: true,
  isNullable: false,
  parentAssetId: undefined,
  parentAssetType: undefined,
  companyId: undefined,
  errorText: '',
  'data-testid': `${PAGE_NAME}_autoComplete`,
  disabled: false,
  isMultiple: false,
  appKey: null,
  queryParams: {},
};

AssetEditorAutocomplete.propTypes = {
  label: PropTypes.string,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  isNullable: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  disableClearable: PropTypes.bool,
  parentAssetId: PropTypes.number,
  parentAssetType: PropTypes.string,
  companyId: PropTypes.number,
  assetType: PropTypes.string.isRequired,
  errorText: PropTypes.string,
  'data-testid': PropTypes.string,
  disabled: PropTypes.bool,
  isMultiple: PropTypes.bool,
  appKey: PropTypes.string,
  queryParams: PropTypes.shape({}),
};

export default withStyles(muiStyles)(AssetEditorAutocomplete);
