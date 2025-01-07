import { useMemo } from 'react';
import { get } from 'lodash';
import { DEV_CENTER_CLI_APP_ID } from '~constants';

const useAnnotationsData = ({ app, appData, currentDashboardAppsLastAnnotations }) => {
  const isPlatformAnnotationsDisabled =
    app?.package?.manifest?.application?.ui?.disable_platform_annotations;

  const assetIdForAnnotation = appData?.well?.asset_id || appData?.rig?.assset_id;
  const assetCompanyId = appData?.well?.company_id || appData?.rig?.company_id;

  const isAppSupportsAnnotations =
    app.package &&
    !isPlatformAnnotationsDisabled &&
    app.id !== DEV_CENTER_CLI_APP_ID &&
    assetIdForAnnotation &&
    app.segment?.includes('drilling');

  const appLastAnnotation = useMemo(() => {
    if (!currentDashboardAppsLastAnnotations || !isAppSupportsAnnotations) return null;

    const annotation = currentDashboardAppsLastAnnotations.find(item => item.id === app.id);
    if (!annotation) return null;

    // Additional check for broken items on api, required api serializer fixing
    return get(annotation, ['last_app_annotation', 'data']) && annotation.last_app_annotation;
  }, [currentDashboardAppsLastAnnotations, app]);

  return {
    assetIdForAnnotation,
    assetCompanyId,
    isAppSupportsAnnotations,
    appLastAnnotation,
  };
};

export default useAnnotationsData;
