import PropTypes from 'prop-types';

import {
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  withStyles,
} from '@material-ui/core';

import TruncatedText from '../TruncatedText';

import { useAssetSelectData } from './effects';

export const PAGE_NAME = 'DC_SingleAssetEditor';

const muiStyles = {
  progress: { margin: '0 15px' },
  select: { width: 350 },
  selectMenu: { maxHeight: 350 },
  menuItem: { width: 350 },
};

const SingleAssetEditor = props => {
  const {
    appKey,
    label,
    currentValue,
    defaultValue,
    isNullable,
    onChange,
    classes,
    parentAssetId,
    assetType,
    parentAssetType,
  } = props;

  const { assets, loading } = useAssetSelectData({
    appKey,
    assetId: currentValue,
    assetType,
    parentAssetId,
    parentAssetType,
  });
  const value = currentValue || defaultValue;

  return (
    <div>
      <FormControl disabled={loading}>
        {!isNullable && <InputLabel shrink={!!value}>{label}</InputLabel>}
        <Select
          data-testid={props['data-testid']}
          value={value}
          onChange={event => onChange(event.target.value)}
          className={classes.select}
          MenuProps={{ className: classes.selectMenu }}
        >
          {isNullable && (
            <MenuItem
              data-testid={`${PAGE_NAME}_noActiveAssetMenuItem`}
              key="empty item"
              value={defaultValue}
              className={classes.menuItem}
            >
              No active asset
            </MenuItem>
          )}
          {assets.map(asset => {
            const assetName = asset?.name || '';
            return (
              <MenuItem
                data-testid={`${PAGE_NAME}_option_${assetName}MenuItem`}
                key={asset.id}
                value={Number(asset.id)}
                className={classes.menuItem}
              >
                <TruncatedText>{assetName}</TruncatedText>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      {loading && (
        <CircularProgress
          data-testid={`${PAGE_NAME}_CircularProgress`}
          size={20}
          className={classes.progress}
        />
      )}
    </div>
  );
};

SingleAssetEditor.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  appType: PropTypes.shape({
    constants: PropTypes.shape({}),
  }),
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  isNullable: PropTypes.bool,
  parentAssetId: PropTypes.number,
  parentAssetType: PropTypes.string,
  assetType: PropTypes.string.isRequired,
  'data-testid': PropTypes.string,
  appKey: PropTypes.string,
};

SingleAssetEditor.defaultProps = {
  label: 'Choose An Asset',
  currentValue: '', // NOTE: If 'undefined' <SelectField /> displays 'label'
  defaultValue: '',
  appType: undefined,
  isNullable: false,
  parentAssetId: undefined,
  parentAssetType: undefined,
  'data-testid': `${PAGE_NAME}_autoComplete`,
  appKey: null,
};

export default withStyles(muiStyles)(SingleAssetEditor);
