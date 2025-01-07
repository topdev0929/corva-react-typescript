import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

import { PrimaryAssetSelect, SecondaryAssetSelect, PrimaryAssetSelectV2 } from './components';
import { ACTIVE_ASSETS_ID, ACTIVE_ASSET_ID } from './constants';
import { ASSET_TYPES } from '~/constants';
import MultipleAssetsToggle from './components/MultipleAssetsToggle';
import { FRAC_FLEET_GROUP, PAD_GROUP } from '~/constants/segment';

const useStyles = makeStyles({
  title: { fontWeight: 400, fontSize: 20, margin: '24px 0 16px' },
});

const PAGE_NAME = 'DC_AppSettingsAssetEditor';
const PARENT_ASSET_ID = 'parent_asset_id';

const AppSettingsAssetEditor = ({
  appKey,
  appType,
  className,
  company,
  defaultValue,
  primaryAssetFields,
  secondaryAssetFields,
  isNullable,
  label,
  onSettingsChange,
  isHiddenTitle,
  isExtendedSelect,
  isRequiredAssetId,
  settings,
  isVisibleMultipleAssetsToggle,
  assetsLimit,
  isDisabledSecondaryAssetSelect,
  isDrillingPlatformApp,
}) => {
  const primaryAssetType = get(appType, ['primaryAsset', 'assetType', 'type']);
  const primaryAssetIdType = get(appType, ['primaryAsset', 'assetType', 'id']);
  const primaryAssetLabel = get(appType, ['primaryAsset', 'assetType', 'label']);
  const primaryAssetSelectGroups = get(appType, ['primaryAsset', 'groups']);

  const secondaryAssetType = get(appType, ['secondaryAsset', 'assetType', 'type']);
  const secondaryAssetIdType = get(appType, ['secondaryAsset', 'assetType', 'id']);
  const secondaryAssetLabel = get(appType, ['secondaryAsset', 'assetType', 'label']);

  const currentValue = get(settings, primaryAssetIdType);
  const initialPrimaryAssetId = currentValue ? Number(currentValue) : null;
  const initialSecondaryAssetId = get(settings, secondaryAssetIdType)
    ? Number(get(settings, secondaryAssetIdType))
    : null;

  const [primaryAsset, setPrimaryAsset] = useState({ id: initialPrimaryAssetId || defaultValue });

  const [secondaryAssetId, setSecondaryAssetId] = useState(initialSecondaryAssetId);
  const [isPadSelectedAsPrimaryAsset, setIsPadSelectedAsPrimaryAsset] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState();
  const [isMultipleAssets, setIsMultipleAssets] = useState(false);

  const styles = useStyles();

  const PrimaryAssetSelectComponent =
    primaryAssetType === ASSET_TYPES.rig.type ? PrimaryAssetSelectV2 : PrimaryAssetSelect;

  const parentAssetId =
    isDrillingPlatformApp && primaryAsset?.assetId ? primaryAsset?.assetId : primaryAsset?.id;

  const onSecondaryAssetChange = ({ id, assetId }) => {
    setSecondaryAssetId(id);
    const secondaryAssetId = id === ACTIVE_ASSET_ID ? null : id;
    const assetSettings = { [secondaryAssetIdType]: secondaryAssetId };

    if (isRequiredAssetId && secondaryAssetType === ASSET_TYPES.well.type) {
      onSettingsChange({
        ...assetSettings,
        replacedAssetId: isDrillingPlatformApp ? secondaryAssetId : assetId,
      });
      return;
    }

    onSettingsChange(assetSettings);
  };

  const onMultipleAssetChange = selected => {
    if (selected.length > assetsLimit) return;

    const isPadSelected = selected[0]?.group === PAD_GROUP.name;
    const isFracFleetSelected = selected[0]?.group === FRAC_FLEET_GROUP.name;
    const isFirstPadSelected = selected.length === 1 && isPadSelected;
    const isFirstFracFleetSelected = selected.length === 1 && isFracFleetSelected;

    if (isFirstPadSelected) {
      setIsPadSelectedAsPrimaryAsset(true);
      setSelectedGroup(PAD_GROUP);
    } else if (isFirstFracFleetSelected) {
      setSelectedGroup(FRAC_FLEET_GROUP);
    }

    if (isPadSelected) {
      setPrimaryAsset(selected);
      const assetsSetting = selected?.reduce((acc, { parentFracFleetId, id }) => {
        const settings = {
          fracFleetId: parentFracFleetId,
          padId: id,
        };

        if (isExtendedSelect) {
          settings.assetId = parentFracFleetId;
          settings.replacedPadId = id;
        }
        return parentFracFleetId ? [...acc, settings] : acc;
      }, []);

      onSettingsChange({
        assets: assetsSetting,
      });
      return;
    }

    setPrimaryAsset(selected);
    const assetsSetting = selected.reduce((acc, asset) => {
      const settings = { [`${asset.type}Id`]: asset.id };
      if (isRequiredAssetId) {
        settings.assetId = asset.assetId;
      }
      if (isExtendedSelect) {
        settings.assetId = asset.assetId || asset.id;
      }
      return [...acc, settings];
    }, []);
    onSettingsChange({
      assets: assetsSetting,
    });
  };

  const onPrimaryAssetChange = selected => {
    if (isMultipleAssets) {
      onMultipleAssetChange(selected);
      return;
    }
    const { id, type, parentFracFleetId } = selected;
    if (!id) return;
    if (type === ASSET_TYPES.pad.type) {
      setPrimaryAsset(selected);
      setIsPadSelectedAsPrimaryAsset(true);
      setSecondaryAssetId(id);
      const assetSetting = {
        [ASSET_TYPES.frac_fleet.id]: Number(parentFracFleetId),
        [ASSET_TYPES.pad.id]: id,
      };
      onSettingsChange(assetSetting);
      return;
    }

    setPrimaryAsset(selected);
    setSecondaryAssetId(null);
    const assetSetting = { [primaryAssetIdType]: id };
    if (isRequiredAssetId) assetSetting.assetId = selected.assetId;
    if (secondaryAssetIdType) assetSetting[secondaryAssetIdType] = null;
    onSettingsChange(assetSetting);
    setIsPadSelectedAsPrimaryAsset(false);
  };

  const handlePrimaryAssetReset = (defaultValue = {}) => {
    setPrimaryAsset(defaultValue);
    setSecondaryAssetId(null);

    setIsPadSelectedAsPrimaryAsset(false);
    const assetSetting = {
      [primaryAssetIdType]: null,
      [secondaryAssetIdType]: null,
      assets: null,
    };
    onSettingsChange(assetSetting);
  };

  const handleMultipleAssetsChange = ({ target }) => {
    setIsMultipleAssets(target.checked);
    handlePrimaryAssetReset(target.checked && []);
  };

  const handleGroupChange = newGroup => {
    setSelectedGroup(newGroup);
    handlePrimaryAssetReset(isMultipleAssets && []);
  };

  const handleGroupReset = () => {
    setSelectedGroup(null);
    handlePrimaryAssetReset(isMultipleAssets && []);
  };

  const secondaryAssetSelectIsVisible = isMultipleAssets
    ? Boolean(primaryAsset.length) && !isPadSelectedAsPrimaryAsset
    : primaryAsset?.id && !isPadSelectedAsPrimaryAsset;

  useEffect(() => {
    if (isEmpty(settings)) {
      handlePrimaryAssetReset(isMultipleAssets && []);
    }
  }, [settings]);

  return (
    <div className={classNames(styles.main, className)}>
      {!isHiddenTitle && <div className={styles.title}>Asset</div>}
      {isVisibleMultipleAssetsToggle && (
        <MultipleAssetsToggle onChange={handleMultipleAssetsChange} />
      )}
      <PrimaryAssetSelectComponent
        appKey={appKey}
        assetType={primaryAssetType}
        data-testid={`${PAGE_NAME}_primaryAssetEditorAutocomplete`}
        defaultValue={defaultValue}
        disableClearable={!isNullable}
        company={company}
        currentValue={primaryAsset?.id}
        currentOption={primaryAsset}
        setCurrentOption={setPrimaryAsset}
        isNullable={isNullable}
        label={label}
        isRequiredAssetId={isRequiredAssetId}
        multiple={isMultipleAssets}
        onChange={onPrimaryAssetChange}
        selectedGroup={selectedGroup}
        onGroupChange={handleGroupChange}
        onGroupReset={handleGroupReset}
        groups={primaryAssetSelectGroups}
        onInputReset={handlePrimaryAssetReset}
        onActiveAssetIdChange={activeAssetId => {
          setPrimaryAsset(primaryAsset => ({ ...primaryAsset, activeWellId: activeAssetId }));
        }}
        assetFields={
          primaryAssetType === ASSET_TYPES.rig.type
            ? [...primaryAssetFields, 'rig.active_well']
            : primaryAssetFields
        }
      />
      {secondaryAssetSelectIsVisible && (
        <SecondaryAssetSelect
          isDrillingPlatformApp={isDrillingPlatformApp}
          data-testid={`${PAGE_NAME}_secondaryAutoComplete`}
          onChange={onSecondaryAssetChange}
          defaultValue={isMultipleAssets ? ACTIVE_ASSETS_ID : ACTIVE_ASSET_ID}
          disabled={isMultipleAssets || isDisabledSecondaryAssetSelect}
          company={company}
          currentValue={secondaryAssetId}
          activeWellId={primaryAsset?.activeWellId}
          isNullable={isNullable}
          isRequiredAssetId={isRequiredAssetId}
          assetType={secondaryAssetType}
          parentAssetId={parentAssetId}
          parentAssetType={isDrillingPlatformApp ? PARENT_ASSET_ID : primaryAssetType}
          primaryAssetLabel={primaryAssetLabel}
          secondaryAssetLabel={secondaryAssetLabel}
          appKey={appKey}
          assetFields={
            secondaryAssetType === ASSET_TYPES.pad.type
              ? [...secondaryAssetFields, 'pad.active']
              : secondaryAssetFields
          }
        />
      )}
    </div>
  );
};

AppSettingsAssetEditor.defaultProps = {
  assetsLimit: null,
  label: 'Choose An Asset',
  isNullable: false,
  defaultValue: undefined,
  isHiddenTitle: false,
  appKey: null,
  isVisibleMultipleAssetsToggle: false,
  isDisabledSecondaryAssetSelect: false,
  primaryAssetFields: [],
  secondaryAssetFields: [],
};

AppSettingsAssetEditor.propTypes = {
  assetsLimit: PropTypes.number,
  settings: PropTypes.shape({}).isRequired,
  appType: PropTypes.shape({}).isRequired,
  defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  onSettingsChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  isNullable: PropTypes.bool,
  isHiddenTitle: PropTypes.bool,
  appKey: PropTypes.string,
  isVisibleMultipleAssetsToggle: PropTypes.bool,
  isDisabledSecondaryAssetSelect: PropTypes.bool,
  primaryAssetFields: PropTypes.shape({}),
  secondaryAssetFields: PropTypes.shape({}),
};

export default AppSettingsAssetEditor;
