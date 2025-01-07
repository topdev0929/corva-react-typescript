import { getValue, setValue, pushValue, deleteValue } from './core';

const IMPERSONATION_STORAGE_KEY = 'impersonation';
const IMPERSONATION_STORAGE_VALUE = 'true';

const CHARTS_VIEW_SETTINGS_STORAGE_KEY = 'chartsViewSettings';
const APPS_HIDDEN_ALERTS = 'appsHiddenAlerts';
const ASSETS_PAGE_FILTERS = 'assetsPageFilters';
const FEED_INPUT_RIG_ID = 'feedInputRigId';

const SEGMENT_STORAGE_KEY = 'segment';

export const FEATURE_FLAG_APPS_ISOLATION = 'featureFlagAppsIsolation';

// Note: Segment storage
export function setSegment(segment) {
  return setValue(SEGMENT_STORAGE_KEY, segment);
}

export function getSegment() {
  return getValue(SEGMENT_STORAGE_KEY);
}

export function startImpersonation() {
  return setValue(IMPERSONATION_STORAGE_KEY, IMPERSONATION_STORAGE_VALUE);
}

export function getImpersonateStorageKey() {
  return getValue(IMPERSONATION_STORAGE_KEY);
}

export function stopImpersonation() {
  return deleteValue(IMPERSONATION_STORAGE_KEY);
}

export function isImpersonating() {
  return getImpersonateStorageKey() === IMPERSONATION_STORAGE_VALUE;
}

// NOTE: App's settings storage
export function setAppViewStorageSettings(path, value, callback) {
  return setValue(
    [CHARTS_VIEW_SETTINGS_STORAGE_KEY, ...(Array.isArray(path) ? path : [path])],
    value,
    null, // NOTE: There are no expiration time here
    callback
  );
}

export function getAppViewStorageSettings(path, defaultValue) {
  return getValue(
    [CHARTS_VIEW_SETTINGS_STORAGE_KEY, ...(Array.isArray(path) ? path : [path])],
    defaultValue
  );
}

export function setHiddenAlerts(appId, value, callback) {
  return pushValue(
    [APPS_HIDDEN_ALERTS, appId],
    value,
    [5, 'd'], // NOTE: Pass the key of what time you want to add, and the amount you want to add
    callback
  );
}

export function getHiddenAlerts(appId) {
  return getValue([APPS_HIDDEN_ALERTS, appId]);
}

export function setAssetPageFilters(value, callback) {
  return setValue(
    ASSETS_PAGE_FILTERS,
    value,
    null, // NOTE: There are no expiration time here
    callback
  );
}

export function removeAssetPageFilters() {
  return deleteValue(ASSETS_PAGE_FILTERS);
}

export function getAssetPageFilters() {
  return getValue(ASSETS_PAGE_FILTERS, {});
}

export function setFeedInputRigId(value, callback) {
  return setValue(
    FEED_INPUT_RIG_ID,
    value,
    null, // NOTE: There are no expiration time here
    callback
  );
}

export function removeFeedInputRigId() {
  return deleteValue(FEED_INPUT_RIG_ID);
}

export function getFeedInputRigId() {
  return getValue(FEED_INPUT_RIG_ID);
}

export function getFeatureFlagAppsIsolation() {
  return getValue(FEATURE_FLAG_APPS_ISOLATION) ?? true;
}
