import * as StageDesignVActualUtils from './StageDesignVActualUtils';
import * as alerts from './alerts';
import * as audio from './audio';
import * as casing from './casing';
import * as chartSeries from './chartSeries';
import * as completion from './completion';
import * as componentsFormerImmutable from './components';
import * as convert from './convert';
import * as csvExport from './csvExport';
import * as devcenter from './devcenter';
import * as drillstring from './drillstring';
import * as drillstringUtils from './DrillstringUtils';
import * as fluidCheckUtils from './FluidCheckUtils';
import * as formatting from './formatting';
import * as ga from './ga';
import * as goals from './goals';
import * as lasParser from './lasParser';
import * as main from './main';
import * as mapUnits from './mapUnits';
import * as mapboxFormerImmutable from './mapbox';
import * as metricsUtils from './metrics';
import * as mobileDetect from './mobileDetect';
import * as nativeMessages from './nativeMessages';
import * as notifications from './notifications';
import * as feed from './feed';
import * as permissions from './permissions';
import * as reports from './reports';
import * as time from './time';
import * as torqueAndHookloadUtils from './torqueAndHookloadUtils';
import * as accuracy from './accuracy';
import {
  createNotification,
  removeNotification,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  showNeutralNotification,
} from './notificationToasts';
import { showToast } from './devcenterToasts';
import { getConvertKeys, convertKeysToSnakeCase, convertKeysToCamelCase } from './convertKeys';
import * as dashboardReports from './dashboardReports';
import * as apps from './apps';
import * as themeVariables from './themeVariables';
import * as env from './env';
import * as fileExtension from './fileExtension';
import { jsonaDataFormatter } from './jsonaDataFormatter';
import * as bha from './bha';
import { getLocalStorageItem, updateLocalStorageItem } from './localStorage';
import { sharedDCStore } from './sharedDCStore';
import { formatMentionText, isSuggestionsListOpened } from '../components/UserMention/utils';
import resolveWellHubSlug from './resolveWellHubSlug';

const backwardCompatibleHandler = {
  get(target, propKey) {
    const original = target[propKey];
    return typeof original === 'function'
      ? (...props) =>
          original.apply(
            target,
            props.map(prop => (prop.toJS ? prop.toJS() : prop))
          )
      : original;
  },
};

function getBackwardCompatibility(module) {
  return new Proxy({ ...module }, backwardCompatibleHandler);
}

const {
  convertArray,
  convertValue,
  getAllUnitTypes,
  getDefaultImperialUnit,
  getDefaultUnits,
  getUnitDescription,
  getUnitDisplay,
  getUnitPlural,
  getUnitPreference,
  getUnitsByType,
  getUnitSingular,
  getUnitSystem,
  updateUserUnits,
  getUserUnits,
  subscribeForUserUnitsUpdates,
  convertImmutables,
  convertImmutablesByBatch,
  getUniqueUnitsByType,
} = convert;

const mapbox = getBackwardCompatibility(mapboxFormerImmutable);
const components = getBackwardCompatibility(componentsFormerImmutable);

export {
  StageDesignVActualUtils,
  accuracy,
  alerts,
  apps,
  audio,
  bha,
  casing,
  chartSeries,
  completion,
  components,
  convert,
  convertArray,
  convertImmutables,
  convertImmutablesByBatch,
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
  convertValue,
  createNotification,
  csvExport,
  dashboardReports,
  devcenter,
  drillstring,
  drillstringUtils,
  env,
  feed,
  fileExtension,
  fluidCheckUtils,
  formatting,
  ga,
  formatMentionText,
  getAllUnitTypes,
  getConvertKeys,
  getDefaultImperialUnit,
  getDefaultUnits,
  getLocalStorageItem,
  getUniqueUnitsByType,
  getUnitDescription,
  getUnitDisplay,
  getUnitPlural,
  getUnitPreference,
  getUnitSingular,
  getUnitSystem,
  getUnitsByType,
  getUserUnits,
  goals,
  jsonaDataFormatter,
  lasParser,
  main,
  mapUnits,
  mapbox,
  metricsUtils,
  mobileDetect,
  nativeMessages,
  notifications,
  permissions,
  removeNotification,
  reports,
  resolveWellHubSlug,
  sharedDCStore,
  showErrorNotification,
  showInfoNotification,
  showNeutralNotification,
  showSuccessNotification,
  showToast,
  showWarningNotification,
  subscribeForUserUnitsUpdates,
  themeVariables,
  time,
  torqueAndHookloadUtils,
  updateLocalStorageItem,
  updateUserUnits,
  isSuggestionsListOpened,
};

export * from './delay';
