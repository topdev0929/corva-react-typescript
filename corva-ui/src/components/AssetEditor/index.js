import { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize, get } from 'lodash';

import { Button } from '@material-ui/core';

import styles from './AssetEditors.css';
import SingleAssetEditor from './SingleAssetEditor';
import AssetEditorAutocomplete from './AssetEditorAutocomplete';

const PAGE_NAME = 'DC_AppSettingsAssetEditor';

const AppSettingsAssetEditor = ({
  appKey,
  appType,
  defaultValue,
  isNullable,
  label,
  onSettingsChange,
  settings,
}) => {
  const primaryAssetType = get(appType, ['primaryAsset', 'assetType', 'type']);
  const primaryAssetIdType = get(appType, ['primaryAsset', 'assetType', 'id']);
  const isPrimarySelectAutocomplete = get(appType, ['primaryAsset', 'autocompleteSelect']);

  const secondaryAssetType = get(appType, ['secondaryAsset', 'assetType', 'type']);
  const secondaryAssetIdType = get(appType, ['secondaryAsset', 'assetType', 'id']);
  const isSecondarySelectAutocomplete = get(appType, ['secondaryAsset', 'autocompleteSelect']);

  const currentValue = get(settings, primaryAssetIdType);

  const [primaryAssetId, setPrimaryAssetId] = useState(currentValue || defaultValue);

  const [secondaryAssetId, setSecondaryAssetId] = useState(get(settings, secondaryAssetIdType));
  const [isSecondaryAssetButtonVisible, setIsSecondaryAssetButtonVisible] = useState(
    !!(secondaryAssetType && !secondaryAssetId)
  );

  const [isSecondaryAssetDropdownVisible, setIsSecondaryAssetDropdownVisible] = useState(
    !!(secondaryAssetType && secondaryAssetId)
  );

  const onSecondaryAssetIdChange = id => {
    setSecondaryAssetId(id);
    onSettingsChange({ [secondaryAssetIdType]: id });
  };

  const onPrimaryAssetChange = id => {
    setPrimaryAssetId(id);
    setSecondaryAssetId(null);
    setIsSecondaryAssetDropdownVisible(false);
    setIsSecondaryAssetButtonVisible(!!secondaryAssetType);
    const assetSetting = { [primaryAssetIdType]: id };
    if (secondaryAssetIdType) assetSetting[secondaryAssetIdType] = null;
    onSettingsChange(assetSetting);
  };

  const onDefaultAssetButtonClick = () => {
    setSecondaryAssetId(null);
    setIsSecondaryAssetDropdownVisible(false);
    setIsSecondaryAssetButtonVisible(!!secondaryAssetType);
    onSettingsChange({ [secondaryAssetIdType]: null });
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>Active Asset</div>

      <div className={styles.editor}>
        {isPrimarySelectAutocomplete ? (
          <AssetEditorAutocomplete
            appKey={appKey}
            assetType={primaryAssetType}
            currentValue={primaryAssetId}
            data-testid={`${PAGE_NAME}_primaryAssetEditorAutocomplete`}
            defaultValue={defaultValue}
            disableClearable={!isNullable}
            isNullable={isNullable}
            label={label}
            onChange={onPrimaryAssetChange}
          />
        ) : (
          <SingleAssetEditor
            appKey={appKey}
            assetType={primaryAssetType}
            currentValue={primaryAssetId}
            data-testid={`${PAGE_NAME}_primaryAutoComplete`}
            defaultValue={defaultValue}
            isNullable={isNullable}
            label={label}
            onChange={onPrimaryAssetChange}
          />
        )}
        {isSecondaryAssetButtonVisible && (
          <Button
            data-testid={`${PAGE_NAME}_changeWellButton`}
            color="primary"
            onClick={() => {
              setIsSecondaryAssetDropdownVisible(true);
              setIsSecondaryAssetButtonVisible(false);
            }}
            disabled={!currentValue}
          >
            {`Change ${capitalize(secondaryAssetType)}`}
          </Button>
        )}
        {!isSecondaryAssetButtonVisible && isSecondaryAssetDropdownVisible && (
          <Button
            data-testid={`${PAGE_NAME}_useDefaultButton`}
            color="secondary"
            onClick={onDefaultAssetButtonClick}
          >
            Use active asset
          </Button>
        )}
      </div>
      {isSecondaryAssetDropdownVisible && (
        <div className={styles.editor}>
          {isSecondarySelectAutocomplete ? (
            <AssetEditorAutocomplete
              appKey={appKey}
              assetType={secondaryAssetType}
              currentValue={secondaryAssetId}
              data-testid={`${PAGE_NAME}_secondaryAssetEditorAutocomplete`}
              defaultValue={defaultValue}
              disableClearable={false}
              isNullable={isNullable}
              label={`Active ${capitalize(secondaryAssetType)}`}
              onChange={onSecondaryAssetIdChange}
              parentAssetId={primaryAssetId}
              parentAssetType={primaryAssetType}
            />
          ) : (
            <SingleAssetEditor
              data-testid={`${PAGE_NAME}_secondaryAutoComplete`}
              onChange={onSecondaryAssetIdChange}
              defaultValue={defaultValue}
              currentValue={secondaryAssetId}
              isNullable={isNullable}
              label={`Active ${capitalize(secondaryAssetType)}`}
              assetType={secondaryAssetType}
              parentAssetId={primaryAssetId}
              parentAssetType={primaryAssetType}
              appKey={appKey}
            />
          )}
        </div>
      )}
    </div>
  );
};

AppSettingsAssetEditor.defaultProps = {
  label: 'Choose An Asset',
  isNullable: false,
  defaultValue: undefined,
  appKey: null,
};

AppSettingsAssetEditor.propTypes = {
  settings: PropTypes.shape({}).isRequired,
  appType: PropTypes.shape({}).isRequired,
  defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onSettingsChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  isNullable: PropTypes.bool,
  appKey: PropTypes.string,
};

export default AppSettingsAssetEditor;
