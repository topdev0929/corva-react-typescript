import {
  ALERT_STATES,
  ALERT_STATUSES,
  BADGE_ICON_STATUSES,
  DATA_QUALITY_CHECK_PASSED,
} from '~/components/StatusBadge/constants';
import {
  ParseWellnessAlertFromJson,
  GetDeductsFromScoreValue,
  GetDeductsFromScoreClass,
} from '~/components/StatusBadge/types';

export const isResolved: (status: string) => boolean = (status = '') =>
  status.toLowerCase() === ALERT_STATUSES.RESOLVED;

export const getDeductsFromScoreClass: GetDeductsFromScoreClass = (styles, score, isResolved) => {
  if (isResolved || !score) return '';

  if (score > 40) {
    return styles.error;
  } else if (score > 10) {
    return styles.warn;
  } else if (score > 5) {
    return styles.ok;
  }

  return styles.good;
};

export const getDeductsFromScoreValue: GetDeductsFromScoreValue = (
  deductsFromScore,
  isResolved
) => {
  return !isResolved && deductsFromScore >= 0 ? `${deductsFromScore}%` : '—';
};

function parseStatus(status) {
  const resolvedStatuses = ['not available', 'resolved'];

  if (status === 'under investigation') {
    return 'investigation';
  }

  if (resolvedStatuses.includes(status)) {
    return 'resolved';
  }

  return status;
}

function parseState(state) {
  const issueStates = ['Fatal', 'Critical', 'Issue', 'Manual'];
  const missingStates = ['Missing Data'];

  if (issueStates.includes(state)) {
    return 'Issue';
  } else if (missingStates.includes(state)) {
    return 'Missing';
  }

  return 'Unknown';
}

export const parseWellnessAlertFromJson: ParseWellnessAlertFromJson = obj => {
  if (
    obj.data.state === 'Issue' &&
    obj.data.name !== 'Manual Alert' &&
    obj.data.category !== 'User Created'
  ) {
    return null;
  }

  return {
    id: obj._id,
    assetId: obj.asset_id,
    name: obj.data.name,
    category: obj.data.category,
    lastCheckedAt: obj.data.last_checked_at,
    message: obj.data.message,
    status: parseStatus(obj.data.status),
    statusReason: obj.data.status_reason,
    statusUpdatedAt: obj.data.status_updated_at,
    state: parseState(obj.data.state),
    createdAt: obj.timestamp,
    note: obj.data.note,
    isThrottled: obj.data.is_throttled,
    segment: obj.data.segment,
    metrics: {
      holeDepth: obj.data.metrics?.hole_depth,
      state: obj.data.metrics?.state,
    },
    deductsFromScore: obj.data.deducts_from_score,
  };
};

export const getLinkToDQPage = ({
  assetId,
  wellHubSlug,
}: {
  assetId: number;
  wellHubSlug: string;
}): string => `/assets/${assetId}/${wellHubSlug}/Data Quality`;

export const groupAlertsByAssetName = (alerts, assetsList) =>
  alerts.reduce((alertAcc, alert) => {
    if (!alert) return alertAcc;

    if (
      [ALERT_STATUSES.FLAGGED, ALERT_STATUSES.INVESTIGATION, ALERT_STATUSES.ON_HOLD].includes(
        alert.status
      )
    )
      return alertAcc;

    const asset = assetsList.find(asset => asset.id === alert.assetId);
    const assetName = asset.name;

    if (!alertAcc[assetName]) alertAcc[assetName] = [];

    alertAcc[assetName].push(alert);
    return alertAcc;
  }, {});

export const getNewWellnessAlerts = (assetsList, parsedWellnessAlerts, wellHubSlug) => {
  const newWellnessAlerts = parsedWellnessAlerts.reduce((acc, alerts) => {
    if (!alerts?.length) {
      return acc;
    }

    const alertsGroupByName = groupAlertsByAssetName(alerts, assetsList);
    Object.keys(alertsGroupByName).forEach(alertKey => {
      const alertsList = alertsGroupByName[alertKey];
      const alert = alertsList.find(
        item => item.status === ALERT_STATUSES.OPEN || item.status === ALERT_STATUSES.EXPIRED
      );
      const isAlertResolved = alertsList.every(alert => isResolved(alert.status));

      if (!acc[alertKey]) acc[alertKey] = [];

      acc[alertKey].push({
        alert: isAlertResolved
          ? { ...alertsList[0], emptyMessage: DATA_QUALITY_CHECK_PASSED }
          : alert,
        isResolved: isAlertResolved,
        id: alertsList[0].id,
        issuesNum: alertsList.filter(
          alert => alert.state === ALERT_STATES.issue && !isResolved(alert.status)
        ).length,
        name: alertsList[0].name,
        missingNum: alertsList.filter(
          alert => alert.state === ALERT_STATES.missing && !isResolved(alert.status)
        ).length,
        linkToDQPage: getLinkToDQPage({ assetId: alertsList[0].assetId, wellHubSlug }),
      });
    });

    return acc;
  }, {});

  return newWellnessAlerts;
};

export const getIconType = (alertsFromAssetsListKeys, wellnessAlertsFromAssetsList) => {
  const isAllAlertsResolved =
    alertsFromAssetsListKeys.filter(key =>
      wellnessAlertsFromAssetsList[key].every(item => item.isResolved)
    ).length === alertsFromAssetsListKeys.length;
  if (isAllAlertsResolved) return BADGE_ICON_STATUSES.success;

  const hasMissingAlerts = alertsFromAssetsListKeys.filter(key =>
    wellnessAlertsFromAssetsList[key].some(item => item.missingNum)
  ).length;

  if (hasMissingAlerts) return BADGE_ICON_STATUSES.error;

  const hasIssueAlerts = alertsFromAssetsListKeys.filter(key =>
    wellnessAlertsFromAssetsList[key].some(item => item.issuesNum)
  ).length;

  if (hasIssueAlerts) return BADGE_ICON_STATUSES.issue;

  return '';
};
