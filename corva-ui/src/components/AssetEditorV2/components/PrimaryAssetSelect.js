import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { Chip, makeStyles } from '@material-ui/core';
import Search from '../../Search/Search';
import { Groups, InputAdornmentLeft } from '../../Search/components';
import { usePrimaryAssetSelectData } from '../effects';
import { ACTIVE_STATUS } from '../constants';
import SelectItem from './SelectItem';
import { ASSET_TYPES } from '~/constants';

const useStyles = makeStyles({
  paper: {
    boxShadow: '0px 3px 10px 0px #00000066',
  },
  listbox: {
    maxHeight: 210,
    '& .MuiAutocomplete-option': {
      padding: '0px 0px 0px 16px',
    },
  },
  option: {
    padding: '6px 0',
    '&:hover': {
      backgroundColor: 'initial',
    },
  },
  groupChip: {
    height: 32,
    padding: 0,
  },
  activeChip: {
    fontWeight: 500,
    backgroundColor: '#75DB29',
    color: '#212121',
    fontSize: 10,
    cursor: 'pointer',
    height: 12,
    textTransform: 'uppercase',
    marginRight: 12,
    letterSpacing: 1,
  },
});

const PrimaryAssetSelect = ({
  placeholder,
  label,
  'data-testid': PAGE_NAME,
  appKey,
  assetType,
  company,
  isRequiredAssetId,
  currentOption,
  setCurrentOption,
  defaultValue,
  currentValue,
  disableClearable,
  isNullable,
  onChange,
  multiple,
  groups,
  selectedGroup,
  onGroupChange,
  onGroupReset,
  assetFields,
  onInputReset,
  onActiveAssetIdChange,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const searchPlaceholder =
    assetType === ASSET_TYPES.rig.type ? 'Search Rig...' : 'Search Pad / Frac Fleet...';
  const styles = useStyles();

  const { assets, loading: isLoading } = usePrimaryAssetSelectData({
    appKey,
    assetType,
    company,
    groups,
    isRequiredAssetId,
    assetFields,
    selectedGroup,
    currentValue,
    setCurrentOption,
    onActiveAssetIdChange,
  });

  const onInputChange = useCallback(
    debounce(value => {
      setSearchValue(value);
    }, 200),
    []
  );

  const renderOption = ({ status, name, id }, { selected }) => {
    return (
      <SelectItem
        className={styles.option}
        assetName={name}
        key={id}
        multiple={multiple}
        selected={selected}
        value={id}
        status={status && ACTIVE_STATUS}
        data-testid={`${PAGE_NAME}_option_${name}MenuItem`}
      />
    );
  };

  return (
    <Search
      classes={{
        paper: styles.paper,
        listbox: styles.listbox,
        groupChip: styles.groupChip,
      }}
      loading={isLoading}
      placeholder={placeholder || searchPlaceholder}
      defaultValue={defaultValue}
      disableClearable={disableClearable}
      isNullable={isNullable}
      selectedGroup={selectedGroup}
      onGroupChange={onGroupChange}
      onGroupReset={onGroupReset}
      onChange={(event, selected) => {
        onChange(selected);
      }}
      data-testid={PAGE_NAME}
      multiple={multiple}
      onInputChange={onInputChange}
      onInputReset={() => {
        onInputReset();
        setCurrentOption(null);
      }}
      TextFieldProps={{
        label,
        value: searchValue,
        endAdornment: currentOption?.status === ACTIVE_STATUS && (
          <Chip data-not-migrated-muichip className={styles.activeChip} label="Active" />
        ),
      }}
      isHiddenAllOption
      value={currentOption}
      options={assets}
      renderCustomOption={renderOption}
      getOptionLabel={option => option.name || ''}
      GroupsComponent={Groups}
      groups={groups}
      InputProps={{
        startAdornment: <InputAdornmentLeft />,
      }}
    />
  );
};

PrimaryAssetSelect.propTypes = {
  assetFields: PropTypes.array,
  'data-testid': PropTypes.string,
  onInputReset: PropTypes.func,
  onActiveAssetIdChange: PropTypes.func,
  placeholder: PropTypes.string,
};

PrimaryAssetSelect.defaultProps = {
  assetFields: [],
  'data-testid': 'PrimaryAssetEditorAutocomplete',
  onInputReset: () => {},
  onActiveAssetIdChange: () => {},
  placeholder: null,
};

export default PrimaryAssetSelect;
