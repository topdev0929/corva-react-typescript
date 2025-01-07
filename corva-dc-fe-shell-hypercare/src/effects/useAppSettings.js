import { useMemo } from 'react';
import { get, isEqual } from 'lodash';
import { getAssetKey } from '@corva/ui/utils/completion';
import { DEFAULT_SETTINGS } from '~/constants';

export function useAppSettings(props) {
  const { well, fracFleet, onSettingsChange, savedAppSettings } = props;
  const assetKey = getAssetKey(fracFleet, well);

  const appSettings = useMemo(() => {
    return { ...DEFAULT_SETTINGS, ...savedAppSettings?.[assetKey] };
  }, [savedAppSettings, assetKey]);

  const onAppSettingChange = (key, value) => {
    if (isEqual(savedAppSettings?.[assetKey]?.[key], value)) return;
    const newSettings = { ...get(savedAppSettings, [assetKey]), [key]: value };
    onSettingsChange({
      savedAppSettings: {
        ...savedAppSettings,
        [assetKey]: newSettings,
      },
    });
  };

  const onAppSettingsChange = value => {
    const newSettings = { ...get(savedAppSettings, [assetKey]), ...value };
    onSettingsChange({
      savedAppSettings: {
        ...savedAppSettings,
        [assetKey]: newSettings,
      },
    });
  };

  return { appSettings, onAppSettingChange, onAppSettingsChange };
}
