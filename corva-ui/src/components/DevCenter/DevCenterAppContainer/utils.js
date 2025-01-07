import { cloneDeep, get, last } from 'lodash';

export const fullscreenParams = (locationQuery, appId) =>
  Object.assign(cloneDeep(locationQuery), {
    maximizeDC: appId,
  });

export const nonFullscreenParams = locationQuery =>
  Object.assign(cloneDeep(locationQuery), {
    maximizeDC: undefined,
  });

export const getAppVersion = app => {
  const packageCodeVersion = get(app, 'package.package_code_version')?.toString();

  // fallback exists for old packages without package_code_version field
  // package.build is composed from '${appName}-${packageJsonVersion}'
  const packageVersionFallback = last(get(app, 'package.build')?.split('-'))?.toString();

  return packageCodeVersion || packageVersionFallback || '0.0.1';
};

export const getAppAvailability = (availability, isSubscriptionFeatureActive) => {
  if (!availability || !isSubscriptionFeatureActive) {
    return {
      hasProductSubscription: true,
      isAppSubscribedForAsset: true,
    };
  }

  return {
    hasProductSubscription: availability.subscription,
    isAppSubscribedForAsset: availability.asset_subscription,
  };
};
