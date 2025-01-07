import { useEffect } from 'react';

import { devcenter as devCenterUtils } from '~/utils';
import { DEV_CENTER_CLI_APP_ID } from '~/constants';

export default function useAppMaximized({
  onIsMaximizedChange,
  devCenterRouter,
  appId = DEV_CENTER_CLI_APP_ID,
}) {
  const isMaximized = devCenterUtils.isAppMaximized(devCenterRouter.location.query, appId);
  const setIsMaximized = isAppMaximized => {
    const { pathname, query } = devCenterRouter.location;
    const newQuery = {
      ...query,
      maximizeDC: isAppMaximized ? appId : undefined,
    };

    devCenterRouter.push({
      pathname,
      query: newQuery,
    });
  };

  useEffect(() => {
    onIsMaximizedChange?.(isMaximized);
  }, [isMaximized]);

  return {
    isMaximized,
    setIsMaximized,
  };
}
