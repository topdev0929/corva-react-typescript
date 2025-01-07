import { corvaDataAPI, jsonApi } from '@corva/ui/clients';
import { getPicklist } from '@corva/ui/clients/jsonApi';
import { COLLECTIONS } from '~/constants';

export const fetchPhasePicklist = async () => {
  try {
    const res = await getPicklist('completion_phase_tags');
    return res.items.map(item => ({ id: item.id, name: item.name }));
  } catch (e) {
    return [];
  }
};

export async function postManualPhase(provider, record) {
  try {
    return await jsonApi.postDataAppStorage(
      provider,
      `${COLLECTIONS.phasesManual.collection}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function putManualPhase(provider, id, record) {
  try {
    return await corvaDataAPI.patch(
      `/api/v1/data/${provider}/${COLLECTIONS.phasesManual.collection}/${id}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getManualPhases(provider, assetId) {
  try {
    return await jsonApi.getDataAppStorage(provider, COLLECTIONS.phasesManual.collection, {
      sort: JSON.stringify({
        timestamp: -1,
      }),
      query: JSON.stringify({
        asset_id: assetId,
      }),
      limit: 1000,
    });
  } catch (err) {
    return [];
  }
}

export async function delManualPhase(provider, recordId) {
  try {
    return await corvaDataAPI.del(
      `/api/v1/data/${provider}/${COLLECTIONS.phasesManual.collection}/${recordId}/`
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function postCriticalPoint(provider, record) {
  try {
    return await jsonApi.postDataAppStorage(
      provider,
      `${COLLECTIONS.phasesCritical.collection}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function putCriticalPoint(provider, id, record) {
  try {
    return await corvaDataAPI.patch(
      `/api/v1/data/${provider}/${COLLECTIONS.phasesCritical.collection}/${id}/`,
      record
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function delCriticalPoint(provider, recordId) {
  try {
    return await corvaDataAPI.del(
      `/api/v1/data/${provider}/${COLLECTIONS.phasesCritical.collection}/${recordId}/`
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getCriticalPoints(provider, assetId) {
  try {
    return await jsonApi.getDataAppStorage(provider, COLLECTIONS.phasesCritical.collection, {
      sort: JSON.stringify({
        timestamp: -1,
      }),
      query: JSON.stringify({
        asset_id: assetId,
      }),
      limit: 1000,
    });
  } catch (err) {
    return [];
  }
}
