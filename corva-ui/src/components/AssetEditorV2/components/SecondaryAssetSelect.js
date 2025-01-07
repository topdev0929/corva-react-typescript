import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { CircularProgress, Select, FormControl, InputLabel, makeStyles } from '@material-ui/core';

import { useSecondaryAssetSelectData } from '../effects';
import SelectItem from './SelectItem';
import { ACTIVE_ASSETS_ID, ACTIVE_ASSET_ID, ACTIVE_STATUS } from '../constants';

export const PAGE_NAME = 'DC_SingleAssetEditor';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },
  select: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 0,
  },
  formControl: {
    marginTop: 16,
    width: '100%',
    '& .MuiInput-underline.Mui-disabled, & .MuiFilledInput-underline.Mui-disabled': {
      '&::before': {
        borderBottom: `1px solid #808080`,
      },
    },
  },
  selectValue: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'initial',
    },
  },
  activeAssets: {
    color: '#9E9E9E',
    padding: '8px 0 6px',
  },
  progress: {
    position: 'absolute',
    right: 20,
    bottom: 4,
  },
  noActiveAsset: {
    color: '#9E9E9E',
    padding: '8px 0 6px',
  },
});

const DEFAULT_ASSET_TYPE = 'asset';

const SecondaryAssetSelect = props => {
  const {
    appKey,
    primaryAssetLabel,
    isRequiredAssetId,
    secondaryAssetLabel,
    company,
    currentValue,
    defaultValue,
    onChange,
    disabled,
    parentAssetId,
    assetType,
    parentAssetType,
    assetFields,
    activeWellId,
    isDrillingPlatformApp,
  } = props;

  const { assets, loading } = useSecondaryAssetSelectData({
    appKey,
    assetId: currentValue,
    assetType: isDrillingPlatformApp ? DEFAULT_ASSET_TYPE : assetType,
    company,
    parentAssetId,
    parentAssetType,
    isRequiredAssetId,
    assetFields,
    activeWellId,
  });
  const styles = useStyles();

  const value = currentValue || defaultValue;
  const hasActiveAsset = assets.some(asset => asset.status === ACTIVE_STATUS);
  const capitalizedAssetType = capitalize(assetType);

  const options = [{ name: `Active ${capitalizedAssetType}`, id: ACTIVE_ASSET_ID }, ...assets];

  const handleSelectChange = ({ target }) => {
    const nextValue =
      target.value === ACTIVE_ASSET_ID
        ? { id: ACTIVE_ASSET_ID }
        : assets?.find(asset => asset.id === target.value);
    onChange(nextValue);
  };

  const renderSelectValue = assetId => {
    if (assetId === ACTIVE_ASSETS_ID) {
      return <span className={styles.activeAssets}>{`Active ${capitalizedAssetType}s`}</span>;
    }
    if (assetId === ACTIVE_ASSET_ID && !hasActiveAsset) {
      return (
        <span className={styles.noActiveAsset}>
          {`${primaryAssetLabel} has No Active ${secondaryAssetLabel}`}
        </span>
      );
    }
    if (assetId === ACTIVE_ASSET_ID && hasActiveAsset) {
      const activeAsset = assets.find(asset => asset.status === ACTIVE_STATUS);
      return (
        <SelectItem
          className={styles.selectValue}
          assetName={activeAsset.name}
          status={activeAsset.status}
        />
      );
    }
    const selectedAsset = assets.find(asset => asset.id === assetId);
    return (
      <SelectItem
        className={styles.selectValue}
        assetName={selectedAsset?.name}
        status={selectedAsset?.status}
      />
    );
  };

  return (
    <div className={styles.container}>
      <FormControl className={styles.formControl} disabled={loading}>
        <InputLabel shrink={!!value}>{secondaryAssetLabel}</InputLabel>
        <Select
          data-testid={props['data-testid']}
          classes={{ select: styles.select }}
          value={value}
          disabled={disabled}
          onChange={handleSelectChange}
          fullWidth
          renderValue={renderSelectValue}
        >
          {options.map(({ id, name, status }) => {
            const assetName = name || '';
            return (
              <SelectItem
                assetName={assetName}
                data-testid={`${PAGE_NAME}_option_${assetName}MenuItem`}
                key={id}
                value={id}
                status={status}
              />
            );
          })}
        </Select>
      </FormControl>
      {loading && (
        <CircularProgress
          data-testid={`${PAGE_NAME}_CircularProgress`}
          size={20}
          className={styles.progress}
        />
      )}
    </div>
  );
};

SecondaryAssetSelect.propTypes = {
  appType: PropTypes.shape({
    constants: PropTypes.shape({}),
  }),
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
  parentAssetId: PropTypes.number,
  parentAssetType: PropTypes.string,
  assetType: PropTypes.string.isRequired,
  'data-testid': PropTypes.string,
  appKey: PropTypes.string,
  assetFields: PropTypes.array,
};

SecondaryAssetSelect.defaultProps = {
  currentValue: '', // NOTE: If 'undefined' <SelectField /> displays 'label'
  defaultValue: '',
  appType: undefined,
  parentAssetId: undefined,
  parentAssetType: undefined,
  'data-testid': `${PAGE_NAME}_autoComplete`,
  appKey: null,
  assetFields: [],
};

export default SecondaryAssetSelect;
