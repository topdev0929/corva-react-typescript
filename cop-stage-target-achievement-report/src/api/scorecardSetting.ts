import { get } from 'lodash';
import { isDevOrQAEnv } from '@corva/ui/utils/env';
import { getDataAppStorage, getAsset, getWells } from '@corva/ui/clients/jsonApi';
import { corvaDataAPI } from '@corva/ui/clients';

import { COLLECTIONS, PROVIDER } from './constants';

type ScorecardData = Record<string, string | number>;
async function fetchScorecardSettings(companyId: number): Promise<void> {
  const query = JSON.stringify({
    company_id: companyId,
  });
  try {
    const response = await getDataAppStorage(
      isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop,
      COLLECTIONS.scorecardSettings,
      {
        limit: 1000,
        sort: '{"timestamp":-1}',
        query,
      }
    );
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
}
const fetchAssetData = async (assetId: number): Promise<any> => {
  try {
    const response = await getAsset(assetId, { fields: ['asset.basin', 'asset.company_id'] });
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getAssetIdsForFracFleet = async (fracFleetId: number): Promise<any> => {
  try {
    const response = await getWells({ frac_fleet: [fracFleetId], fields: ['well.asset_id'] });

    return get(response, 'data', []).map(item => get(item, 'attributes.asset_id'));
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const loadScorecardSettings = async (assetId: number): Promise<any> => {
  const assetData = await fetchAssetData(assetId);

  if (!assetData) return null;
  const basin = assetData.data?.attributes?.basin;
  const { company_id } = assetData.data?.attributes;
  const rawScorecardSettings = await fetchScorecardSettings(company_id);
  return { rawScorecardSettings, basin, company_id };
};

const postScorecardSettings = async (companyId: number, data: ScorecardData) => {
  const timestamp = Math.trunc(Date.now() / 1000);
  const path = `/api/v1/data/${
    isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop
  }/stage.scorecard.calculator.settings/`;
  try {
    await corvaDataAPI.post(path, [
      {
        version: 1,
        timestamp,
        company_id: companyId,
        data,
      },
    ]);
    return 'success';
  } catch (e) {
    console.error(e);
    return 'failed';
  }
};

const putScorecardSettings = async (id: string, companyId: number, data: ScorecardData) => {
  const timestamp = Math.trunc(Date.now() / 1000);
  const path = `/api/v1/data/${
    isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop
  }/stage.scorecard.calculator.settings/`;
  try {
    await corvaDataAPI.put(path, {
      _id: id,
      version: 1,
      timestamp,
      company_id: companyId,
      data,
    });
    return 'success';
  } catch (e) {
    console.error(e);
    return 'failed';
  }
};

export const saveScorecardSettings = async (
  assetId: number,
  maxRate: number,
  maxPressure: number,
  fracFleetId: number,
  basin: string,
  companyId: number
): Promise<string> => {
  const { rawScorecardSettings } = await loadScorecardSettings(assetId);
  if (!rawScorecardSettings) {
    if (basin) {
      const response = await postScorecardSettings(companyId, {
        basin,
        max_rate: maxRate,
      });
      if (response === 'failed') return 'failed';
    }
    const response = await postScorecardSettings(companyId, {
      frac_fleet_id: fracFleetId,
      max_pressure: maxPressure,
    });
    return response;
  }

  const maxRateRecord = rawScorecardSettings.find(item => item.data.frac_fleet_id === fracFleetId);
  if (maxRateRecord) {
    const maxRateRecordId = get(maxRateRecord, '_id');
    const response = await putScorecardSettings(maxRateRecordId, companyId, {
      frac_fleet_id: fracFleetId,
      max_rate: maxRate,
    });
    if (response === 'failed') return 'failed';
  } else {
    const response = await postScorecardSettings(companyId, {
      frac_fleet_id: fracFleetId,
      max_rate: maxRate,
    });
    if (response === 'failed') return 'failed';
  }

  if (basin) {
    const maxPressureRecord = rawScorecardSettings.find(item => item.data.basin === basin);
    if (maxPressureRecord) {
      const maxPressureRecordId = get(maxPressureRecord, '_id');
      const response = await putScorecardSettings(maxPressureRecordId, companyId, {
        basin,
        max_pressure: maxPressure,
      });
      if (response === 'failed') return 'failed';
    } else {
      const response = await postScorecardSettings(companyId, {
        basin,
        max_pressure: maxPressure,
      });
      if (response === 'failed') return 'failed';
    }
  }

  return 'success';
};
