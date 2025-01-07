import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import resolveWellHubSlug from '~/utils/resolveWellHubSlug';
import { isDevOrQAEnv } from '~/utils/env';
import {
  getWCURuleMapping,
  getWellnessRuleSettings,
  getWellnessAlerts,
} from '~/components/StatusBadge/api';
import {
  parseWellnessAlertFromJson,
  getLinkToDQPage,
  getNewWellnessAlerts,
} from '~/components/StatusBadge/utils';
import {
  ALERT_STATES,
  ALERT_STATUSES,
  METADATA,
  AssetData,
  ENABLING_ON_QA_APP_IDS_LIST,
  ENABLING_ON_PROD_APP_IDS_LIST,
  DATA_QUALITY_CHECK_PASSED,
} from '~/components/StatusBadge/constants';
import { getIconType, isResolved } from '~/components/StatusBadge/utils';
import { socketClient } from '~/clients';

const getSubscription = (assetId, dataset, event = '') => ({
  provider: METADATA.recordProvider,
  dataset,
  assetId,
  event,
});

export function useAlertsSubscription(assetIds, appId, maximized) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isEmpty(assetIds.filter(id => id))) return;

    const onDataReceive = ({ data }) => {
      const parsedData = data.map(parseWellnessAlertFromJson);
      setData(parsedData);
    };

    const addUnsubscribeList = assetIds.map(assetId =>
      socketClient.subscribe(getSubscription(assetId, METADATA.recordCollections.wellnessAlerts), {
        onDataReceive,
      })
    );

    const updateUnsubscribeList = assetIds.map(assetId =>
      socketClient.subscribe(
        getSubscription(assetId, METADATA.recordCollections.wellnessAlerts, 'update'),
        { onDataReceive }
      )
    );

    return () => {
      addUnsubscribeList.forEach(addUnsubscribe => addUnsubscribe());
      updateUnsubscribeList.forEach(updateUnsubscribe => updateUnsubscribe());
    };
  }, [JSON.stringify(assetIds), appId, maximized]);

  return data;
}

type WellnessAlerts =
  | { alertsData: AssetData; lastTimestamp: number; hasSubscriptionsData: boolean }
  | Record<string, {}>;

export const useWellnessAlerts = ({
  asset,
  multiRigAssets = [],
  appId,
  dashboards,
  isDCApp,
  maximized,
}) => {
  const [wellnessAlerts, setWellnessAlerts] = useState<WellnessAlerts>({});
  const [statusBadgeIconType, setStatusBadgeIconType] = useState<
    'error' | 'success' | 'issue' | ''
  >('');

  const subscriptionsAlerts = useAlertsSubscription(
    asset ? [asset.id] : multiRigAssets.map(multiRigAsset => multiRigAsset.id),
    appId,
    maximized
  );

  const fetchWCURuleMapping = async assetsList => {
    const WCURuleMapping = await getWCURuleMapping(appId);
    const wellnessRuleSettings = await getWellnessRuleSettings(WCURuleMapping[0]?.rule_id);

    if (!wellnessRuleSettings.length) return;

    const wellHubSlug = await resolveWellHubSlug(dashboards);
    const assetIds = assetsList.map(asset => asset.id);
    const parsedWellnessAlerts = await Promise.all(
      wellnessRuleSettings.map(({ data: { name } }) => getWellnessAlerts(assetIds, name))
    ).then(alerts => {
      return alerts.map(alertsCollection =>
        alertsCollection.map(item => parseWellnessAlertFromJson(item))
      );
    });

    const newWellnessAlerts = getNewWellnessAlerts(assetsList, parsedWellnessAlerts, wellHubSlug);
    const wellnessAlertsFromAssetsList = assetsList.reduce(
      (acc, currentWellnessAlert) => {
        const { id: assetId } = currentWellnessAlert;

        return {
          ...acc,
          [currentWellnessAlert.name]: wellnessRuleSettings.map(ruleSetting => {
            const alert = acc[currentWellnessAlert.name]?.find(
              ({ name }) => name === ruleSetting.data.name
            );
            if (alert) return alert;

            return {
              alert: {
                assetId,
                category: ruleSetting.data.category,
                status: ALERT_STATUSES.RESOLVED,
                emptyMessage: DATA_QUALITY_CHECK_PASSED,
              },
              id: uuidv4(),
              isResolved: true,
              name: ruleSetting.data.name,
              linkToDQPage: getLinkToDQPage({ assetId, wellHubSlug }),
            };
          }),
        };
      },
      { ...newWellnessAlerts }
    );

    const alertsFromAssetsListKeys = Object.keys(wellnessAlertsFromAssetsList);

    setStatusBadgeIconType(getIconType(alertsFromAssetsListKeys, wellnessAlertsFromAssetsList));
    setWellnessAlerts({
      alertsData: wellnessAlertsFromAssetsList,
      lastTimestamp:
        wellnessAlertsFromAssetsList[alertsFromAssetsListKeys[0]][0]?.alert?.statusUpdatedAt,
    });
  };

  useEffect(() => {
    if (!wellnessAlerts.alertsData || isEmpty(subscriptionsAlerts)) return;

    const mergedAlerts = Object.keys(wellnessAlerts.alertsData).reduce((acc, key) => {
      return {
        ...acc,
        [key]: wellnessAlerts.alertsData[key].map(rule => {
          const alertByRuleName = subscriptionsAlerts.find(
            subscriptionsAlert =>
              subscriptionsAlert?.name === rule.name &&
              subscriptionsAlert?.assetId === rule.alert.assetId
          );
          if (!alertByRuleName) return rule;

          if (
            [ALERT_STATUSES.FLAGGED, ALERT_STATUSES.INVESTIGATION, ALERT_STATUSES.ON_HOLD].includes(
              alertByRuleName.status
            )
          )
            return rule;

          const alert = {
            ...alertByRuleName,
            emptyMessage: isResolved(alertByRuleName.status) && DATA_QUALITY_CHECK_PASSED,
          };
          const isAlertResolved = isResolved(alertByRuleName.status);

          if (rule.alert.id === alertByRuleName.id)
            return { ...rule, isResolved: isAlertResolved, alert };

          return {
            ...rule,
            isResolved: isAlertResolved,
            issuesNum: alertByRuleName.state === ALERT_STATES.issue ? rule.issuesNum + 1 : 0,
            missingNum: alertByRuleName.state === ALERT_STATES.missing ? rule.missingNum + 1 : 0,
            alert,
          };
        }),
      };
    }, {});

    const alertsFromAssetsListKeys = Object.keys(mergedAlerts);

    setStatusBadgeIconType(getIconType(alertsFromAssetsListKeys, mergedAlerts));
    setWellnessAlerts(prevState => ({
      ...prevState,
      alertsData: mergedAlerts,
      hasSubscriptionsData: true,
    }));
  }, [subscriptionsAlerts]);

  useEffect(() => {
    const appIds = isDevOrQAEnv ? ENABLING_ON_QA_APP_IDS_LIST : ENABLING_ON_PROD_APP_IDS_LIST;
    const currentAsset = { id: asset?.id, name: asset?.name };
    const assetsList = currentAsset.id ? [currentAsset] : multiRigAssets;

    try {
      if (assetsList.length && (appIds.includes(appId) || isDCApp)) {
        fetchWCURuleMapping(assetsList);
      } else {
        setWellnessAlerts({});
        setStatusBadgeIconType('');
      }
    } catch (e) {
      console.error(e);
    }
  }, [asset?.id, multiRigAssets.length]);

  return { wellnessAlerts, statusBadgeIconType };
};
