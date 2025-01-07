import { FunctionComponent, memo } from 'react';
import { StatusBadge } from '@corva/ui/components';
import { useWellnessAlerts } from '@corva/ui/effects';

import getFormattedAppId from '@/utils/appId';
import { User } from '@/types/User';

type AppStatusBadgeProps = {
  appId: number;
  appHeight: number;
  appWidth: number;
  currentAsset: {
    asset_id: number;
    name: string;
  };
  currentUser: User;
};

const AppStatusBadge: FunctionComponent<AppStatusBadgeProps> = ({
  appId,
  appHeight,
  appWidth,
  currentUser,
  currentAsset,
}) => {
  const wellnessAlertAsset = {
    id: currentAsset?.asset_id,
    name: currentAsset?.name,
  };

  // @ts-ignore
  const { statusBadgeIconType, wellnessAlerts } = useWellnessAlerts({
    asset: wellnessAlertAsset,
    appId: getFormattedAppId(appId),
    dashboards: [],
    isDCApp: true,
  });

  return (
    <>
      {wellnessAlerts.alertsData && (
        <StatusBadge
          className="c-status-badge"
          segment="completion"
          assetsData={wellnessAlerts.alertsData}
          appWidth={appWidth}
          DQIssueTooltipMaxHeight={appHeight - 200}
          iconType={statusBadgeIconType}
          currentUser={currentUser}
          hasSubscriptionsData={!!wellnessAlerts.hasSubscriptionsData}
        />
      )}
    </>
  );
};

export default memo(AppStatusBadge);
