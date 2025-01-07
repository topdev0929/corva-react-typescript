import { set } from 'lodash';

import { COMPLETION_APP_TYPES, COMPLETION_APPTYPE_MODES_DICT } from '~/constants/completion';

export const getAssetKey = (fracFleet, well, padId) => {
  if (fracFleet) return `pad--${fracFleet.current_pad_id || padId}`;
  if (well) return `well--${well.id}`;

  // Note: It currently supports pad and well
  return 'common';
};

export const getDefaultPadModeSetting = (
  fracFleet,
  well,
  appType = COMPLETION_APP_TYPES.fracMultiWellApp
) => {
  let result = {};

  if (fracFleet) {
    result = {
      mode: COMPLETION_APPTYPE_MODES_DICT[appType][0],
    };
  } else if (well) {
    result = {
      mode: 'custom',
      selectedAssets: [well.id],
    };
  }

  return result;
};

export const resolveActiveFracAsset = (assets, ignoreStatus = false) => {
  return assets.reduce((result, asset) => {
    const fracStream = (asset.app_streams || []).find(
      stream => stream.source_type === 'frac' && (ignoreStatus || stream.status === 'active')
    );

    if (!fracStream || (result && result.last_frac_at > fracStream.last_active_at)) {
      return result;
    }

    return set(asset, 'last_frac_at', fracStream.last_active_at);
  }, null);
};

export const resolveActiveWirelineAsset = (assets, ignoreStatus = false) => {
  return assets.reduce((result, asset) => {
    const wirelineStream = (asset.app_streams || []).find(
      stream => stream.source_type === 'wireline' && (ignoreStatus || stream.status === 'active')
    );

    if (!wirelineStream || (result && result.last_wireline_at > wirelineStream.last_active_at)) {
      return result;
    }

    return set(asset, 'last_wireline_at', wirelineStream.last_active_at);
  }, null);
};

export const resolveActivePumpdownAsset = (assets, ignoreStatus = false) => {
  return assets.reduce((result, asset) => {
    const pumpdownStream = (asset.app_streams || []).find(
      stream => stream.source_type === 'pumpdown' && (ignoreStatus || stream.status === 'active')
    );

    if (!pumpdownStream || (result && result.last_pumpdown_at > pumpdownStream.last_active_at)) {
      return result;
    }

    return set(asset, 'last_pumpdown_at', pumpdownStream.last_active_at);
  }, null);
};
