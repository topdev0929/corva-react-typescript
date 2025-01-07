import Jsona from 'jsona';
import { uniq, get, keyBy, isEmpty } from 'lodash';
import {
  getWells,
  getRigs,
  getResolvedAssets,
  getFracFleetWells,
  getPadWells,
  getFracFleets,
} from '~/clients/jsonApi';

import { DEV_CENTER_CLI_APP_ID } from '~constants';
import { ASSET_TYPES } from '~/constants/assetTypes';

const dataFormatter = new Jsona();

export const getAppAssetSpecificTypeId = (app, typeId) => +get(app, ['settings', typeId]);

export const getUniqAssetIds = (assetIds, cachedAssetIds) =>
  uniq(
    assetIds
      .map(([_appId, assetId]) => assetId)
      .filter(assetId => Number.isFinite(assetId) && !cachedAssetIds.includes(String(assetId)))
  );

export async function fetchWells(ids) {
  if (!ids.length) return null;

  try {
    //  eslint-disable-next-line no-return-await
    return await getWells({
      ids,
      fields: [
        'well.name',
        'well.settings',
        'well.company',
        'well.asset_id',
        'well.last_active_at',
        'well.id',
        'well.rig',
        'rig.name',
        'rig.asset_id',
        'company.id',
        'well.status',
      ],
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchRigs(ids) {
  if (!ids.length) return null;

  try {
    return await getRigs({
      ids,
      fields: [
        'rig.name',
        'rig.settings',
        'rig.asset_id',
        'rig.active_well',
        'rig.last_active_well',
        'well.name',
        'well.settings',
        'well.company',
        'well.asset_id',
        'well.last_active_at',
        'well.id',
        'well.company.id',
      ],
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchAssetEntitiesByAssetIds(assetIds) {
  if (!assetIds.length) return null;

  try {
    return await getResolvedAssets({
      assets: assetIds,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getWellObjectFromWellData = (well, rig) => ({
  well: well && {
    ...well.attributes,
    id: well.id,
    // NOTE: API doesn't return active child company id
    companyId: get(well, 'relationships.company.data.id'),
  },
  rig: {
    name: get(rig, 'attributes.name'),
    id: get(rig, 'id'),
    asset_id: get(rig, 'attributes.asset_id'),
  },
});

export const getAppsDataByWells = (appsWellIds, wellsById) =>
  wellsById && !isEmpty(wellsById)
    ? appsWellIds.reduce((acc, [appId, wellId]) => {
        const well = wellsById[wellId];
        if (!well) return acc;

        acc[appId] = getWellObjectFromWellData(well, well.rig);

        return acc;
      }, {})
    : {};

export const getAppsDataByRigs = (appsRigIds, rigsById) =>
  rigsById && !isEmpty(rigsById)
    ? appsRigIds.reduce((acc, [appId, rigId]) => {
        const rig = rigsById[rigId];
        acc[appId] = getWellObjectFromWellData(rig.well, rig);

        return acc;
      }, {})
    : {};

export const getAppsDataByFFs = (appsFracFleetIds, ffsById, ffWellsData) =>
  ffsById || ffWellsData
    ? appsFracFleetIds.reduce((acc, [appId, ffId]) => {
        const fracFleet = ffsById?.[ffId];
        const wells = ffWellsData?.[appId];

        acc[appId] = {
          fracFleet,
          wells,
        };

        return acc;
      }, {})
    : {};

export const getAppsDataByPads = (appsPadIds, padWellsData) =>
  appsPadIds || padWellsData
    ? appsPadIds.reduce((acc, [appId, _padId]) => {
        // TODO: check how padWellsData is organized
        const wells = padWellsData?.[appId];

        acc[appId] = {
          wells,
        };

        return acc;
      }, {})
    : {};

export async function fetchFracFleets(ids) {
  if (!ids.length) return null;

  try {
    const response = await getFracFleets({
      ids,
      fields: [
        'frac_fleet.name',
        'frac_fleet.pads',
        'frac_fleet.current_pad_id',
        'frac_fleet.pad_frac_fleets',
      ],
    });
    return response ? dataFormatter.deserialize(response) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchFracFleetWells(appsFFIds, apps) {
  const appsById = keyBy(apps, 'id');
  const requests = appsFFIds.map(async ([appId, fracFleetId]) => {
    const options = { fields: 'all', frac_fleet_id: fracFleetId };

    const app = appsById[appId];

    if (appId === DEV_CENTER_CLI_APP_ID) options.app_key = get(app, ['app', 'app_key']);
    else options.app_id = get(app, ['app', 'id']);
    try {
      const response = await getFracFleetWells(options);
      return response ? dataFormatter.deserialize(response) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const responses = await Promise.all(requests);

  return responses.reduce((acc, currFFWells, i) => {
    acc[appsFFIds[i][0]] = currFFWells;
    return acc;
  }, {});
}

export async function fetchPadWells(appsPadIds, apps) {
  const appsById = keyBy(apps, 'id');
  const requests = appsPadIds.map(async ([appId, padId]) => {
    const options = { fields: 'all' };

    const app = appsById[appId];

    if (appId === DEV_CENTER_CLI_APP_ID) options.app_key = get(app, ['app', 'app_key']);
    else options.app_id = get(app, ['app', 'id']);
    try {
      const response = await getPadWells(padId, options);
      return response ? dataFormatter.deserialize(response) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const responses = await Promise.all(requests);

  return responses.reduce((acc, currFFWells, i) => {
    acc[appsPadIds[i][0]] = currFFWells;
    return acc;
  }, {});
}

export const getAppHash = app =>
  [
    app.id,
    getAppAssetSpecificTypeId(app, ASSET_TYPES.well.id),
    getAppAssetSpecificTypeId(app, ASSET_TYPES.rig.id),
    getAppAssetSpecificTypeId(app, ASSET_TYPES.frac_fleet.id),
    getAppAssetSpecificTypeId(app, ASSET_TYPES.pad.id),
    getAppAssetSpecificTypeId(app, 'deprecatedAssetId'),
  ].join('-');

export const isAppWithSettings = app =>
  Boolean(
    getAppAssetSpecificTypeId(app, ASSET_TYPES.well.id) ||
      getAppAssetSpecificTypeId(app, ASSET_TYPES.rig.id) ||
      getAppAssetSpecificTypeId(app, ASSET_TYPES.frac_fleet.id) ||
      getAppAssetSpecificTypeId(app, ASSET_TYPES.pad.id)
  );

export const getInitialAppData = app => ({
  id: app.id,
  rig: null,
  well: null,
  fracFleet: null,
  wells: null,
  isLoading: true,
  appHash: getAppHash(app),
});

export const getInitialAppsDataState = apps =>
  apps.reduce(
    (acc, app) => ({
      ...acc,
      [app.id]: getInitialAppData(app),
    }),
    {}
  );

export const prepareDataForResolver = (apps, cache) => {
  const appsWellIds = [];
  const appsRigIds = [];
  const appsFracFleetIds = [];
  const appsFracFleetToFetchWellsIds = [];
  const appsPadIds = [];
  const appIds = [];

  apps.forEach(app => {
    const appWellId = getAppAssetSpecificTypeId(app, ASSET_TYPES.well.id);
    const appRigId = getAppAssetSpecificTypeId(app, ASSET_TYPES.rig.id);
    const appFracFleetId = getAppAssetSpecificTypeId(app, ASSET_TYPES.frac_fleet.id);
    const appPadId = getAppAssetSpecificTypeId(app, ASSET_TYPES.pad.id);

    const appId = app.id;
    appIds.push([appId]);

    if (appWellId) {
      appsWellIds.push([appId, appWellId]);
    } else if (appRigId) {
      appsRigIds.push([appId, appRigId]);
    } else if (appFracFleetId) {
      appsFracFleetIds.push([appId, appFracFleetId]);
      if (appPadId) {
        appsPadIds.push([appId, appPadId]);
      } else {
        appsFracFleetToFetchWellsIds.push([appId, appFracFleetId]);
      }
    }
  });

  const { rigsById, wellsById, fracFleetsById } = cache.current;

  const uniqueWellIds = getUniqAssetIds(appsWellIds, Object.keys(wellsById));
  const uniqueRigIds = getUniqAssetIds(appsRigIds, Object.keys(rigsById));
  const uniqueFFIds = getUniqAssetIds(appsFracFleetIds, Object.keys(fracFleetsById));

  return {
    appsWellIds,
    appsRigIds,
    appsFracFleetIds,
    appsPadIds,
    appIds,
    appsFracFleetToFetchWellsIds,

    uniqueWellIds,
    uniqueRigIds,
    uniqueFFIds,
  };
};
