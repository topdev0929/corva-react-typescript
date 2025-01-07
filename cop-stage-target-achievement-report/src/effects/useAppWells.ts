import { useEffect, useState } from 'react';
import { isEmpty, first, get } from 'lodash';
import {
  resolveActiveFracAsset,
  resolveActiveWirelineAsset,
  getDefaultPadModeSetting,
  getAssetKey,
} from '@corva/ui/utils/completion';
import { COMPLETION_APP_TYPES } from '@corva/ui/constants/completion';

import { FracFleet, Well } from '../types';

export const resolveCurrentAssetsByPadMode = (
  assets: Well[],
  padModeSetting: Record<string, any>
): Well[] | null => {
  const { mode, selectedAssets } = padModeSetting;
  let well;

  if (mode === 'pad') {
    return assets;
  } else if (mode === 'active_frac') {
    well = resolveActiveFracAsset(assets);
  } else if (mode === 'active_wireline') {
    well = resolveActiveWirelineAsset(assets);
  } else if (mode === 'custom') {
    const targetAssetId = first(selectedAssets);

    well = assets.find(asset => Number(asset.id) === Number(targetAssetId));
  }

  return well ? [well] : [];
};

export default function useAppWells(
  well: Well,
  fracFleet: FracFleet,
  wells: Well[],
  padId: number,
  settingsByAsset: Record<string, any>
): Well[] {
  const [currentWells, setCurrentWells] = useState<Well[]>([]);
  const assetKey = getAssetKey(fracFleet, well, padId);
  const currentPadModeSetting = get(settingsByAsset, assetKey);

  const padModeSetting = !isEmpty(currentPadModeSetting)
    ? currentPadModeSetting
    : getDefaultPadModeSetting(fracFleet, well, COMPLETION_APP_TYPES.padApp);

  useEffect(() => {
    if (!wells.length) {
      return;
    }

    setCurrentWells(resolveCurrentAssetsByPadMode(wells, padModeSetting));
  }, [fracFleet, well, padId, settingsByAsset, wells]);

  return currentWells;
}
