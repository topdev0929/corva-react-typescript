import { useCallback, useEffect, useRef, useState, cloneElement, useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { debounce, isEmpty } from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Checkbox,
  MenuItem,
  FormControlLabel,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@material-ui/icons';
import IconButton from '~/components/IconButton';
import { ListboxComponent, Paper } from './components';
import { truncateString, TruncateOptions } from './utils/truncate';
import { PaperContext } from './context';

import useStyles from './styles';

const icon = <CheckBoxOutlineBlankIcon style={{ fontSize: 20 }} />;
const checkedIcon = <CheckBoxIcon style={{ fontSize: 20 }} />;

interface SearchProps extends PropTypes.InferProps<typeof searchPropTypes> {}

const Search = ({
  classes,
  AutocompleteProps = {},
  value,
  disableClearable,
  onChange,
  onInputChange,
  loading,
  options,
  optionSize,
  placeholder,
  onGroupChange,
  disabled,
  multiple,
  groups,
  GroupsComponent,
  recentSearchesMaxCount,
  dataStorageKey,
  RecentSearchesComponent,
  dataStorage,
  onInputReset,
  getOptionLabel,
  TextFieldProps,
  ListboxProps,
  onInputChangeCallback,
  truncateSettings,
  renderCustomOption,
  isHiddenAllOption,
  selectedGroup,
  onGroupReset,
  onClose,
  ...props
}: SearchProps): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState('');
  const [isOpened, setIsOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>();

  const styles = useStyles();

  const autocompleteClasses = {
    popper: classNames(styles.popper, classes.popper),
    listbox: classNames(styles.listbox, classes.listbox),
    popupIndicator: classNames(styles.popupIndicator, classes.popupIndicator),
    popupIndicatorOpen: classNames(styles.popupIndicatorOpen, classes.popupIndicatorOpen),
  };

  const isGroupped = options?.some(option => option.group) || !isEmpty(groups);
  const groupBy = ({ group }) => group;

  const handleInputChange = (event, newInputValue, reason) => {
    setInputValue(event?.target.value || event?.target.innerText || newInputValue);
    onInputChangeCallback(newInputValue, reason);
  };

  const handleDebouncedInputChange = inputValue => setDebouncedInputValue(inputValue);

  const onDebouncedInputChange = useCallback(debounce(handleDebouncedInputChange, 500), []);

  const handleSelectedGroupChange = selectedGroupId => {
    const selectedGroup = groups.find(({ id }) => id === selectedGroupId);
    setInputValue('');
    onGroupChange(selectedGroup);
  };

  useEffect(() => {
    if (isOpened) {
      inputRef.current.focus();
    }
  });

  const sortedOptionsByGroup = options?.sort((curr, next) =>
    next.group?.toString().localeCompare(curr.group?.toString())
  );

  const formattedOptions = isEmpty(selectedGroup)
    ? sortedOptionsByGroup
    : options?.filter(option => option.group === selectedGroup.name);

  const allSelected = multiple && formattedOptions?.length === value?.length;

  const onAllSelectClick = () => {
    setInputValue('');
    if (AutocompleteProps.getOptionDisabled && allSelected)
      return onChange(null, [options[options.length - 1]]);

    return onChange(null, allSelected ? [] : formattedOptions);
  };

  useEffect(() => {
    onDebouncedInputChange(inputValue);

    if (!onInputChange) return;

    onInputChange(inputValue);
  }, [inputValue]);

  const handleAutocompleteChange = (event, selected) => {
    setInputValue('');
    onChange(event, selected);
  };

  const handleSearchOpen = () => {
    setIsOpened(true);
  };

  const handleSearchClose = (_, reason) => {
    if (reason !== 'blur') {
      onClose();
      setIsOpened(false);
    }
  };

  const handleSelectedOptionClick = () => {
    if (isOpened) {
      setIsOpened(false);

      onClose();
    } else {
      setIsOpened(true);
    }
  };

  const renderGroup = ({ key, group, children }) => {
    if (!group || (!isEmpty(selectedGroup) && multiple)) {
      return children;
    }

    return (
      <div className={styles.group}>
        <Chip
          key={key}
          data-not-migrated-MuiChip
          className={classNames(styles.groupChip, classes.groupChip)}
          variant="outlined"
          label={group}
        />
        {children}
      </div>
    );
  };

  const getSelectedLabel = (value: any) => {
    if (allSelected) return 'All';

    return value?.length === 1 ? value[0].label || value[0].name : `${value?.length} Selected`;
  };

  const renderInput = params => {
    const defaultEndAdornment =
      params.InputProps.endAdornment?.props?.children?.length > 1
        ? cloneElement(params.InputProps.endAdornment, {
            // remove clear button, popupIcon is left
            children: params.InputProps.endAdornment.props.children.slice(1),
          })
        : params.InputProps.endAdornment;
    return (
      <TextField
        {...params}
        {...TextFieldProps}
        inputRef={inputRef}
        placeholder={placeholder}
        classes={{ root: styles.searchInput }}
        InputProps={{
          classes: { root: styles.textField },
          ...params.InputProps,
          ...props.InputProps,
          startAdornment: (
            <>
              {props.InputProps?.startAdornment}
              {selectedGroup && (
                <Chip
                  key={selectedGroup.id}
                  className={styles.selectedGroup}
                  data-not-migrated-MuiChip
                  variant="outlined"
                  label={
                    <div className={styles.selectedGroupLabel}>
                      {selectedGroup.name}
                      <CloseIcon
                        id="removeGroupIcon"
                        className={styles.removeIcon}
                        onClick={onGroupReset}
                      />
                    </div>
                  }
                />
              )}
              {multiple && !isEmpty(value) && (
                <div
                  onClick={handleSelectedOptionClick}
                  id="selectedOptions"
                  className={styles.selectedLabel}
                >
                  {getSelectedLabel(value)}
                </div>
              )}
            </>
          ),
          endAdornment: (
            <>
              <InputAdornment
                className={classNames({
                  [styles.removeIconWithDropdown]: AutocompleteProps.forcePopupIcon,
                })}
                position="end"
              >
                {TextFieldProps.endAdornment}
                {loading && <CircularProgress color="primary" size={20} />}
                {inputValue && !disableClearable && (
                  <IconButton
                    size="small"
                    className={styles.iconButton}
                    onClick={() => {
                      setInputValue('');
                      if (onInputReset) {
                        onInputReset();
                        return;
                      }
                      onChange(null, []);
                    }}
                    tooltipProps={{ title: 'Clear' }}
                  >
                    <CloseIcon className={styles.closeIcon} />
                  </IconButton>
                )}
              </InputAdornment>
              {AutocompleteProps.forcePopupIcon && defaultEndAdornment}
            </>
          ),
        }}
      />
    );
  };

  const AllSelectComponent = () => {
    return (
      <FormControlLabel
        id="selectAllLabel"
        className={styles.selectAllCheckbox}
        onClick={onAllSelectClick}
        control={
          <Checkbox
            icon={icon}
            style={{ fontSize: 20 }}
            indeterminate={!allSelected}
            checkedIcon={checkedIcon}
            checked
            inputProps={{ 'aria-label': 'All' }}
          />
        }
        label="All"
      />
    );
  };

  const renderOption = ({ label, id }, { selected }) => {
    if (!multiple)
      return (
        <MenuItem className={styles.menuItem} key={id} value={id}>
          {label}
        </MenuItem>
      );
    return (
      <div className={classNames(styles.option, optionSize)} key={id}>
        <Checkbox
          disableRipple
          icon={icon}
          className={styles.checkbox}
          checkedIcon={checkedIcon}
          checked={selected}
        />
        {truncateString(label, truncateSettings as TruncateOptions)}
      </div>
    );
  };

  const paperContext = useMemo(
    () => ({
      onOutsideClick: handleSearchClose,
      isEmptyOptions: isEmpty(formattedOptions),
      loading: loading,
      AllSelectComponent: !isHiddenAllOption && multiple && !isEmpty(formattedOptions) && (
        <AllSelectComponent />
      ),
      RecentSearchesComponent: RecentSearchesComponent && (
        <RecentSearchesComponent
          dataStorage={dataStorage}
          dataStorageKey={dataStorageKey}
          maxCount={recentSearchesMaxCount}
          isHidden={!isEmpty(inputValue)}
          onInputChange={value => setInputValue(value)}
          inputValue={debouncedInputValue}
        />
      ),
      GroupsComponent: !selectedGroup && isGroupped && GroupsComponent && (
        <GroupsComponent onGroupClick={handleSelectedGroupChange} groups={groups} />
      ),
    }),
    [
      selectedGroup,
      loading,
      isGroupped,
      inputValue,
      allSelected,
      debouncedInputValue,
      onClose,
      isHiddenAllOption,
    ]
  );

  return (
    <PaperContext.Provider value={paperContext}>
      <Autocomplete
        {...props}
        disableClearable={disableClearable}
        onClose={handleSearchClose}
        onOpen={handleSearchOpen}
        open={isOpened}
        onChange={handleAutocompleteChange}
        forcePopupIcon={AutocompleteProps.forcePopupIcon}
        fullWidth
        disabled={disabled}
        value={value}
        classes={autocompleteClasses}
        renderInput={renderInput}
        loading={loading}
        options={formattedOptions}
        renderGroup={renderGroup}
        disableCloseOnSelect={multiple}
        multiple={multiple}
        renderOption={renderCustomOption || renderOption}
        groupBy={isGroupped && groupBy}
        PaperComponent={Paper}
        ListboxComponent={ListboxComponent}
        inputValue={inputValue}
        getOptionLabel={getOptionLabel}
        getOptionDisabled={AutocompleteProps.getOptionDisabled}
        onInputChange={handleInputChange}
        loadingText={<div className={styles.label}>Loading ...</div>}
        noOptionsText={<div className={styles.label}>No Options</div>}
        ListboxProps={ListboxProps}
      />
    </PaperContext.Provider>
  );
};

const searchPropTypes = {
  AutocompleteProps: PropTypes.shape({
    forcePopupIcon: PropTypes.bool,
    getOptionDisabled: PropTypes.func,
  }),
  allChecked: PropTypes.bool,
  TextFieldProps: PropTypes.shape({
    label: PropTypes.string,
    endAdornment: PropTypes.node,
  }),
  truncateSettings: PropTypes.shape({
    maxChars: PropTypes.number,
    charsNumFromStart: PropTypes.number,
    charsNumFromEnd: PropTypes.number,
  }),
  selectedGroup: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  onGroupReset: PropTypes.func,
  onClose: PropTypes.func,
  disableClearable: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  getOptionLabel: PropTypes.func,
  onGroupChange: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  optionSize: PropTypes.string,
  InputProps: PropTypes.shape({
    startAdornment: PropTypes.number,
  }),
  ListboxProps: PropTypes.shape({}),
  classes: PropTypes.shape({
    popper: PropTypes.string,
    listbox: PropTypes.string,
    popupIndicator: PropTypes.string,
    popupIndicatorOpen: PropTypes.string,
    groupChip: PropTypes.string,
  }),
  onInputChangeCallback: PropTypes.func,
  placeholder: PropTypes.string,
  RecentSearchesComponent: PropTypes.elementType,
  recentSearchesMaxCount: PropTypes.number,
  dataStorageKey: PropTypes.string,
  dataStorage: PropTypes.shape({}),

  groups: PropTypes.array,
  GroupsComponent: PropTypes.elementType,
  renderCustomOption: PropTypes.func,
  onInputReset: PropTypes.func,
  isHiddenAllOption: PropTypes.bool,
};

Search.propTypes = searchPropTypes;

Search.defaultProps = {
  InputProps: null,
  onInputChange: null,
  onGroupChange: () => {},
  getOptionLabel: option => option.label || '',
  renderCustomOption: null,
  onInputReset: null,
  ListboxProps: null,
  options: [],
  groups: [],
  classes: {},
  disabled: false,
  isHiddenAllOption: false,
  disableClearable: false,
  multiple: false,
  loading: false,
  onInputChangeCallback: () => {},
  placeholder: 'Search...',
  recentSearchesMaxCount: 3,
  dataStorageKey: 'Search:recentSearches',
  dataStorage: sessionStorage,
  RecentSearchesComponent: null,
  TextFieldProps: {
    endAdornment: null,
  },
  GroupsComponent: null,
  truncateSettings: {
    maxChars: 22,
    charsNumFromStart: 9,
    charsNumFromEnd: 9,
  },
  onGroupReset: () => {},
  onClose: () => {},
  selectedGroup: null,
};

export default Search;
