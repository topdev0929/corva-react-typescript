import {
  DEFAULT_FILTER_SETTINGS,
  DEFAULT_VIEWER_FILTER_SETTINGS,
  VIEWER_STAGE_MODE_KEYS,
} from '@/constants';

export const getDefaultFilterSettings = (isAssetViewer: boolean) =>
  isAssetViewer ? DEFAULT_VIEWER_FILTER_SETTINGS : DEFAULT_FILTER_SETTINGS;

export const getFormattedFilterSettings = (originalFilterSettings, isAssetViewer: boolean) => {
  if (isAssetViewer) {
    return VIEWER_STAGE_MODE_KEYS.includes(originalFilterSettings.stageMode)
      ? {
          ...originalFilterSettings,
          viewMode: DEFAULT_VIEWER_FILTER_SETTINGS.viewMode,
        }
      : DEFAULT_VIEWER_FILTER_SETTINGS;
  }

  return originalFilterSettings;
};
