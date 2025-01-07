import { useState, useMemo, useEffect } from 'react';
import { isEmpty, get } from 'lodash';

import { getAssetKey, getDefaultPadModeSetting } from '@corva/ui/utils/completion';

import { resolveCurrentAssetByPadMode } from '@/utils/completionUtils';
import { getDefaultFilterSettings, getFormattedFilterSettings } from '@/utils/filterMode';

import { DEFAULT_RT_VALUES_SETTINGS, FALLBACK_SERIES_COLOR } from '../constants';

const getFilterSettingsKey = (selectedWells, appPadModeSetting) => {
  if (appPadModeSetting.mode === 'pad') return '';
  return resolveCurrentAssetByPadMode(selectedWells, appPadModeSetting)?.id || '';
};

export function useAppSettings(props, selectedWells, isAssetViewer) {
  const {
    activitySettingByAsset,
    well,
    fracFleet,
    settingsByAsset,
    offsetSetting,
    filterSetting,
    customTimeSetting,
    scaleSetting,
    dataSetting,
    rtValuesSetting,
    onSettingChange,
    appHeaderProps,
  } = props;

  const padId = appHeaderProps?.appSettings?.padId;
  const assetKey = getAssetKey(fracFleet, well, padId);

  const getAssetPadModeSetting = () =>
    !isEmpty(get(settingsByAsset, [assetKey]))
      ? get(settingsByAsset, [assetKey])
      : getDefaultPadModeSetting(fracFleet, well);

  const assetOffsetSetting = isAssetViewer ? [] : get(offsetSetting, [assetKey]) || [];
  const assetRtValuesSetting = get(rtValuesSetting, [assetKey]) || DEFAULT_RT_VALUES_SETTINGS;

  const [appPadModeSetting, setAppPadModeSetting] = useState(getAssetPadModeSetting());
  const [appOffsetSetting, setAppOffsetSetting] = useState(assetOffsetSetting);
  const [appRtValuessetSetting, setAppRtValuesSetting] = useState(assetRtValuesSetting);
  const [appCustomTimeSetting, setAppCustomTimeSetting] = useState(customTimeSetting);
  const [appScaleSetting, setAppScaleSetting] = useState(scaleSetting);
  const [appDataSetting, setAppDataSetting] = useState(dataSetting);
  const [appFilterSetting, setAppFilterSetting] = useState({});
  const [activitySetting, setActivitySetting] = useState({});

  const assetId = getFilterSettingsKey(selectedWells, appPadModeSetting);
  const settingAssetKey = `${assetKey}-${assetId || 'padMode'}`;

  useEffect(() => {
    if (isAssetViewer === null) return;
    setActivitySetting(activitySettingByAsset[settingAssetKey] || []);
    const settings = filterSetting[settingAssetKey] || getDefaultFilterSettings(isAssetViewer);
    setAppFilterSetting(getFormattedFilterSettings(settings, isAssetViewer));
  }, [settingAssetKey, isAssetViewer]);

  const appGraphColorsSetting = useMemo(() => {
    const allSeriesTypes = appScaleSetting.reduce((result, setting) => {
      return [...result, ...setting.series];
    }, []);
    const graphColors = allSeriesTypes.reduce((result, series) => {
      return {
        ...result,
        [series.key]: series.color || FALLBACK_SERIES_COLOR,
      };
    }, {});

    return graphColors;
  }, [appScaleSetting]);

  useEffect(() => {
    // reset pad mode for frac fleet change
    setAppPadModeSetting(getAssetPadModeSetting());
  }, [fracFleet?.current_pad_id, well?.id]);

  useEffect(() => {
    if (assetKey && settingsByAsset?.[assetKey] && isAssetViewer !== null) {
      setAppPadModeSetting(settingsByAsset[assetKey]);
      const newAssetId = getFilterSettingsKey(selectedWells, settingsByAsset[assetKey]);
      const settings =
        filterSetting[`${assetKey}-${newAssetId || 'padMode'}`] ||
        getDefaultFilterSettings(isAssetViewer);
      setAppFilterSetting(getFormattedFilterSettings(settings, isAssetViewer));
    }
  }, [JSON.stringify(settingsByAsset), isAssetViewer]);

  const onAppOffsetSettingChange = value => {
    setAppOffsetSetting(value);
    onSettingChange('offsetSetting', {
      ...offsetSetting,
      [assetKey]: value,
    });
  };

  const onAppRtValuesSettingChange = (_, value) => {
    setAppRtValuesSetting(value?.[assetKey] || value);
    onSettingChange('rtValuesSetting', {
      ...appRtValuessetSetting,
      [assetKey]: value?.[assetKey] || value,
    });
  };

  const onAppFilterSettingChange = value => {
    setAppFilterSetting(value);
    onSettingChange('filterSetting', {
      ...filterSetting,
      [`${assetKey}-${assetId}`]: value,
    });
  };

  const onActivitySettingChange = value => {
    setActivitySetting(value);
    onSettingChange('activitySettingByAsset', {
      ...activitySettingByAsset,
      [settingAssetKey]: value,
    });
  };

  const onAppSettingChange = (key, value, shouldTriggerAPI = true) => {
    const stateMap = {
      scaleSetting: setAppScaleSetting,
      dataSetting: setAppDataSetting,
      customTimeSetting: setAppCustomTimeSetting,
    };

    stateMap[key](value);
    if (shouldTriggerAPI) {
      onSettingChange(key, value);
    }
  };

  return {
    activitySetting,
    appPadModeSetting,
    appOffsetSetting,
    appRtValuessetSetting,
    appFilterSetting,
    appScaleSetting,
    appDataSetting,
    appGraphColorsSetting,
    appCustomTimeSetting,
    settingAssetKey,
    onActivitySettingChange,
    onAppOffsetSettingChange,
    onAppRtValuesSettingChange,
    onAppFilterSettingChange,
    onAppSettingChange,
  };
}
