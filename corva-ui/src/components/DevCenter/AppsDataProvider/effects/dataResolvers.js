import { get, keyBy, merge } from 'lodash';
import { ASSET_TYPES } from '~/constants/assetTypes';

import {
  fetchAssetEntitiesByAssetIds,
  fetchRigs,
  fetchWells,
  fetchFracFleets,
  fetchFracFleetWells,
  fetchPadWells,
  getAppsDataByWells,
  getAppsDataByRigs,
  getAppsDataByFFs,
  getAppsDataByPads,
  prepareDataForResolver,
  getAppAssetSpecificTypeId,
  isAppWithSettings,
} from './utils';
import { APPS_DATA_REQUESTS } from './constants';

const DEFAULT_REQUESTS = [
  APPS_DATA_REQUESTS.WELLS,
  APPS_DATA_REQUESTS.RIGS,
  APPS_DATA_REQUESTS.FRAC_FLEETS,
  APPS_DATA_REQUESTS.FRAC_FLEET_WELLS,
  APPS_DATA_REQUESTS.PAD_WELLS,
];

export const getDeprecatedAssetIds = (apps, dashboardAssetId) => {
  const uniqueIds = apps.reduce((acc, app) => {
    if (isAppWithSettings(app)) return acc;

    const deprecatedAssetId = getAppAssetSpecificTypeId(app, 'deprecatedAssetId');
    acc.add(deprecatedAssetId || dashboardAssetId);

    return acc;
  }, new Set());

  return [...uniqueIds];
};

export async function getAppSettingsByDeprecatedAssetId(deprecatedAssetIds, cache) {
  const { deprecatedAssetData: cachedDeprecatedAssetData } = cache.current;
  const cachedDeprecatedAssetIds = Object.keys(cachedDeprecatedAssetData);
  const notResolvedDeprecatedAssetIds = deprecatedAssetIds.filter(
    deprecatedAssetId => !cachedDeprecatedAssetIds.includes(String(deprecatedAssetId))
  );

  if (!notResolvedDeprecatedAssetIds.length) return cachedDeprecatedAssetData;

  const assetsData = await fetchAssetEntitiesByAssetIds(notResolvedDeprecatedAssetIds);

  if (!assetsData) return cachedDeprecatedAssetData;

  const MAP_DEPRECATED_ASSET_TYPE_TO_APP_SETTINGS = {
    rig: ASSET_TYPES.rig.id,
    well: ASSET_TYPES.well.id,
  };

  const dataByDeprecatedAssetId = Object.values(assetsData)
    .flat()
    .reduce((acc, { data }) => {
      acc[data.attributes.asset_id] = {
        [MAP_DEPRECATED_ASSET_TYPE_TO_APP_SETTINGS[data.type]]: data.id,
      };
      return acc;
    }, {});

  const updatedCachedDeprecatedAssetData = {
    ...cachedDeprecatedAssetData,
    ...dataByDeprecatedAssetId,
  };
  // eslint-disable-next-line no-param-reassign
  cache.current.cachedDeprecatedAssetData = updatedCachedDeprecatedAssetData;

  return updatedCachedDeprecatedAssetData;
}

// NOTE: converts feed page apps and asset page apps deprecated asset ids to regular rigId/wellId in app settings
export async function getAppsWithUnifiedSettings(apps, dashboardAssetId, cache) {
  const appSettingsByDeprecatedAssetId = await getAppSettingsByDeprecatedAssetId(
    getDeprecatedAssetIds(apps, dashboardAssetId),
    cache
  );

  return apps.map(app => {
    if (isAppWithSettings(app)) return app;

    const appDeprecatedAssetId = getAppAssetSpecificTypeId(app, 'deprecatedAssetId');

    return {
      ...app,
      settings: appSettingsByDeprecatedAssetId[appDeprecatedAssetId || dashboardAssetId],
    };
  });
}

export async function resolveAppsData({
  apps,
  dashboardAssetId,
  cache,
  updateCache,
  requests = DEFAULT_REQUESTS,
}) {
  const unifiedApps = await getAppsWithUnifiedSettings(apps, dashboardAssetId, cache);
  const {
    appsWellIds,
    appsRigIds,
    appsFracFleetIds,
    appsFracFleetToFetchWellsIds,
    appsPadIds,
    uniqueWellIds,
    uniqueRigIds,
    uniqueFFIds,
  } = prepareDataForResolver(unifiedApps, cache);

  const [wellsResponse, rigsResponse, ffsResponse, ffWellsData, padWellsData] = await Promise.all([
    requests.includes(APPS_DATA_REQUESTS.WELLS) && fetchWells(uniqueWellIds),
    requests.includes(APPS_DATA_REQUESTS.RIGS) && fetchRigs(uniqueRigIds),
    requests.includes(APPS_DATA_REQUESTS.FRAC_FLEETS) && fetchFracFleets(uniqueFFIds),
    requests.includes(APPS_DATA_REQUESTS.FRAC_FLEET_WELLS) &&
      fetchFracFleetWells(appsFracFleetToFetchWellsIds, apps),
    requests.includes(APPS_DATA_REQUESTS.PAD_WELLS) && fetchPadWells(appsPadIds, apps),
  ]);

  const fetchedWellsById =
    wellsResponse?.data &&
    keyBy(
      wellsResponse.data.map(well => {
        const rigId = get(well, 'relationships.rig.data.id');
        const rig = wellsResponse.included.find(item => item.type === 'rig' && item.id === rigId);
        return { ...well, rig };
      }),
      'id'
    );
  const fetchedRigsById =
    rigsResponse?.data &&
    keyBy(
      rigsResponse.data.map(rig => {
        const wellId =
          get(rig, 'relationships.active_well.data.id') ||
          get(rig, 'relationships.last_active_well.data.id');
        const well = rigsResponse.included.find(item => item.type === 'well' && item.id === wellId);
        return { ...rig, well };
      }),
      'id'
    );
  const fetchedFFsById = ffsResponse && keyBy(ffsResponse, 'id');

  updateCache({
    wellsById: fetchedWellsById || {},
    rigsById: fetchedRigsById || {},
    fracFleetsById: fetchedFFsById || {},
  });

  const appsDataByWells = getAppsDataByWells(appsWellIds, cache.current.wellsById);
  const appsDataByRigs = getAppsDataByRigs(appsRigIds, cache.current.rigsById);

  const appsDataByFFs = getAppsDataByFFs(
    appsFracFleetIds,
    cache.current.fracFleetsById,
    ffWellsData
  );
  const appsDataByPads = getAppsDataByPads(appsPadIds, padWellsData);

  return merge(appsDataByWells, appsDataByRigs, appsDataByFFs, appsDataByPads);
}
