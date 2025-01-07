import { getDataAppStorageAggregate, getTask, postTask } from '~/clients/jsonApi';
import { CORVA_COMPANY_ID } from '~/constants';

import { METADATA } from './constants';
import { showErrorNotification, showSuccessNotification, delay } from '~/utils';

const NOTIFICATION_ERROR_MESSAGE = 'Failed to report Data Quality Issue. Please try again later';
const NOTIFICATION_SUCCESS_MESSAGE = 'Data Quality Issue reported successfully!';

export async function getWCURuleMapping(appId: number): Promise<any> {
  const params = {
    match: JSON.stringify({ company_id: CORVA_COMPANY_ID, 'data.app_id': appId }),
    limit: 100,
    sort: JSON.stringify({ timestamp: 1 }),
    project: JSON.stringify({
      app_id: '$data.app_id',
      rule_id: '$data.wcu_rules.rule_id',
      _id: 0,
    }),
  };
  return getDataAppStorageAggregate(
    METADATA.recordProvider,
    METADATA.recordCollections.wcuRuleMapping,
    params
  );
}

export async function getWellnessRuleSettings(ruleIds: string[]): Promise<any> {
  const params = {
    sort: JSON.stringify({ ts_desc: 1 }),
    match: JSON.stringify({
      company_id: CORVA_COMPANY_ID,
      _id: { $in: ruleIds },
    }),
    limit: 1000,
  };
  return getDataAppStorageAggregate(
    METADATA.recordProvider,
    METADATA.recordCollections.wellnessRuleSettings,
    params
  );
}

export async function getWellnessAlerts(assetIds: number[], name: string): Promise<any> {
  const params = {
    sort: JSON.stringify({ timestamp: -1 }),
    match: JSON.stringify({ asset_id: { $in: assetIds }, 'data.name': name }),
    limit: 100,
  };

  return getDataAppStorageAggregate(
    METADATA.recordProvider,
    METADATA.recordCollections.wellnessAlerts,
    params
  );
}

async function confirmTask(taskId) {
  try {
    let status = 'initial';
    let retryNum = 0;
    do {
      if (status !== 'initial') {
        // Delay between tasks call with at least 1 second value.
        // Each next call is delayed by 20% (0.2 constant).
        // First call is (1s + 0.2s * 0) * 1000(convert sec -> ms), next call is 1.2s and so on.
        await delay((1 + 0.2 * retryNum) * 1000);
      }
      const response = await getTask(taskId);
      status = response?.state;
      retryNum += 1;
    } while (status === 'running' && retryNum < 10);
    if (status === 'succeeded') {
      showSuccessNotification(NOTIFICATION_SUCCESS_MESSAGE);
    } else {
      console.error('Task execution exited');
      showErrorNotification(NOTIFICATION_ERROR_MESSAGE);
    }
  } catch (e) {
    console.error('Failed to create a task; Error:', e);
    showErrorNotification(NOTIFICATION_ERROR_MESSAGE);
  }
}

export async function postReportError(
  assetId: string | number,
  description: string,
  currentUser,
  segment
) {
  const task = {
    provider: 'corva',
    app_key: 'corva.wellness_helper',
    asset_id: assetId,
    properties: {
      type: 'add_manual',
      internal: currentUser.company_id === CORVA_COMPANY_ID,
      message: description,
      user_id: currentUser.id,
      user_company_id: currentUser.company_id,
      user_name: `${currentUser.first_name} ${currentUser.last_name}`,
      user_company_name: currentUser.company?.name,
      segment,
    },
  };
  const taskResponse = await postTask({ task });
  await confirmTask(taskResponse?.id);
}
