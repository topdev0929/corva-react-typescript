import { useState } from 'react';
import { get } from 'lodash';
import { getAssetKey } from '@corva/ui/utils/completion';

import { PadOrderSetting, CommonAppProps, AppSettings } from '../types';

type AppProps = AppSettings & CommonAppProps;

interface AppSettingsResult {
  appPadOrderSetting: PadOrderSetting;
  onAppPadOrderSettingChange: (orderSettings: PadOrderSetting) => void;
}

function useAppSettings({
  fracFleet,
  well,
  padId,
  padOrderSetting,
  onSettingChange,
}: AppProps): AppSettingsResult {
  const assetKey = getAssetKey(fracFleet, well, padId);
  const [appPadOrderSetting, setAppPadOrderSetting] = useState(
    get(padOrderSetting, [assetKey], {})
  );

  const onAppPadOrderSettingChange = value => {
    setAppPadOrderSetting(value);
    onSettingChange('padOrderSetting', {
      ...padOrderSetting,
      [assetKey]: value,
    });
  };

  return { appPadOrderSetting, onAppPadOrderSettingChange };
}

export default useAppSettings;
