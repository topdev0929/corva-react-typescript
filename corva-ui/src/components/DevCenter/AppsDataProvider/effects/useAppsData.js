import { useState, useEffect, useRef } from 'react';
import { mapValues, get, keyBy, omit, merge } from 'lodash';

import { isDevCenterApp } from '~/utils/devcenter';
import { getInitialAppsDataState, getAppHash } from './utils';

import { resolveAppsData } from './dataResolvers';
import { APPS_DATA_REQUESTS } from '~/components/DevCenter/AppsDataProvider/effects/constants';

const MINUTE = 60_000;
const FRAC_FLEETS_REFRESH_INTERVAL = 5 * MINUTE;

function useAppsData({ apps: allApps, dashboardAssetId }) {
  const [appsData, setAppsData] = useState({});
  const refreshFracFleetsInterval = useRef();
  const resolveAppsDataParamsRef = useRef({});

  const cache = useRef({
    wellsById: {},
    rigsById: {},
    fracFleetsById: {},
    deprecatedAssetData: {},
  });

  const apps = allApps
    .filter(app => {
      const isMultiRig = get(app, ['app', 'ui_settings', 'multi_rig']);
      return isDevCenterApp(app) && !isMultiRig;
    })
    .map(app => ({ ...app, appHash: getAppHash(app) }));

  const handleResolvedAppsData = resolvedAppsData =>
    setAppsData(prevAppsData =>
      mapValues(prevAppsData, prevAppData => {
        const appData = resolvedAppsData[prevAppData.id] || {};

        return {
          ...prevAppData,
          ...appData,
          isLoading: false,
        };
      })
    );

  const updateCache = updates => {
    cache.current = merge(cache.current, updates);
  };

  useEffect(async () => {
    const appsDataValues = Object.values(appsData);

    // NOTE: empty dashboard
    if (!apps.length && !appsDataValues.length) {
      return;
    }

    // NOTE: app was removed from db
    if (apps.length < appsDataValues.length) {
      const appsById = keyBy(apps, 'id');
      const removedAppId = appsDataValues.find(appData => !appsById[appData.id]).id;
      setAppsData(prevAppsData => omit(prevAppsData, removedAppId));
      return;
    }

    const changedApps = apps.filter(app => !appsData[app.id] || appsData[app.id].hash !== app.hash);
    setAppsData(prevAppsData => ({ ...prevAppsData, ...getInitialAppsDataState(changedApps) }));
    handleResolvedAppsData(await resolveAppsData({ apps, dashboardAssetId, cache, updateCache }));
  }, [String(apps.map(({ appHash }) => appHash)), dashboardAssetId]);

  // NOTE: Keep this data in ref to avoid closure in setInterval
  resolveAppsDataParamsRef.current = { apps, dashboardAssetId, cache, updateCache };

  useEffect(() => {
    // NOTE: Refresh fracfleet wells and pad wells every 5 minutes
    refreshFracFleetsInterval.current = setInterval(() => {
      resolveAppsData({
        ...resolveAppsDataParamsRef.current,
        requests: [APPS_DATA_REQUESTS.FRAC_FLEET_WELLS, APPS_DATA_REQUESTS.PAD_WELLS],
      }).then(handleResolvedAppsData);
    }, FRAC_FLEETS_REFRESH_INTERVAL);

    return () => clearInterval(refreshFracFleetsInterval.current);
  }, []);

  return appsData;
}

export default useAppsData;
