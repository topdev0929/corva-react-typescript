import { memo } from 'react';
import PropTypes from 'prop-types';
import { StatusBadge as CorvaStatusBadge } from '@corva/ui/components';
import { useWellnessAlerts } from '@corva/ui/effects';
import { makeStyles } from '@material-ui/core';

function getFormattedAppId(appId) {
  const QA_APP_ID = 70190;
  return appId === 1 ? QA_APP_ID : appId;
}

const useStyles = makeStyles({
  badge: {
    '& > div': {
      padding: 0,
    },
    marginRight: 8,
  },
});

const StatusBadge = ({ appId, appHeight, appWidth, currentUser, currentAsset }) => {
  const classes = useStyles();
  const { statusBadgeIconType, wellnessAlerts } = useWellnessAlerts({
    asset: { id: currentAsset?.asset_id, name: currentAsset?.name },
    appId: getFormattedAppId(appId),
    dashboards: [],
    isDCApp: true,
  });

  return (
    <>
      {wellnessAlerts.alertsData && (
        <CorvaStatusBadge
          className={classes.badge}
          assetsData={wellnessAlerts.alertsData}
          appWidth={appWidth}
          DQIssueTooltipMaxHeight={appHeight - 200}
          iconType={statusBadgeIconType}
          currentUser={currentUser}
          segment="drilling"
          hasSubscriptionsData={wellnessAlerts.hasSubscriptionsData}
        />
      )}
    </>
  );
};

StatusBadge.propTypes = {
  appId: PropTypes.number.isRequired,
  appHeight: PropTypes.number.isRequired,
  appWidth: PropTypes.number.isRequired,
  currentAsset: PropTypes.shape({
    asset_id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

export default memo(StatusBadge);
