import { DEV_CENTER_CLI_APP_ID } from '~/constants';
import { SEGMENTS } from '~/constants/segment';

export const getAppIdentifier = ({ appKey, version, isLocalDebugMode }) => {
  if (!appKey) return '';
  const appIdentifier = appKey.replace(/\./g, '_');
  return isLocalDebugMode ? appIdentifier : `${appIdentifier}-${version}`;
};
export const isAppMaximized = (query, appId = DEV_CENTER_CLI_APP_ID) =>
  appId === +query?.maximizeDC;

export function createDevCenterRouter(reactRouter) {
  return {
    push: params => {
      if (typeof params === 'string') {
        reactRouter.push(params);
      } else {
        reactRouter.push({
          pathname: params.pathname,
          query: params.query,
        });
      }
    },
    location: {
      pathname: reactRouter?.location?.pathname,
      query: reactRouter?.location?.query,
    },
  };
}

export const getTimestampFromQuery = query =>
  query ? +(query.split('#')[2] || '').replace('}', '') : undefined;

export const getAppName = app => app?.package?.manifest.application.name ?? app.name;

export const isDevCenterApp = app => (app?.platform || app?.app?.platform) === 'dev_center';

export const getAppSegment = app =>
  app?.package?.manifest?.application?.segments?.[0] ?? SEGMENTS.DRILLING;
