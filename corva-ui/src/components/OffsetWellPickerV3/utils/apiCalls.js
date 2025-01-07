import Jsona from 'jsona';
import { get, concat, range } from 'lodash';

import {
  getAssets,
  getAppStorage,
  getRigs,
  getFracFleets,
  getDrilloutUnits,
  getCompanyGoals,
} from '~/clients/jsonApi';
import { METRICS_KEYS } from '../components/CustomSelectionView/constants';

const dataFormatter = new Jsona();

const MAX_WELL_NUMBER = 200;
export async function fetchWells(companyId, addWellsUsabilityInfo) {
  let response = null;
  try {
    response = await getAssets({
      types: ['well'],
      company_id: companyId ? +companyId : undefined,
      fields: [
        'asset.name',
        'asset.parent_asset_id',
        'asset.parent_asset_name',
        'asset.status',
        'asset.stats',
        'asset.target_formation',
        'asset.string_design',
        'asset.root_asset_name',
        'asset.basin',
        'asset.county',
        'asset.area',
        'asset.visibility',
        'asset.top_hole',
        'asset.settings',
        'well.settings',
      ],
      per_page: 10000,
      sort: 'name',
    });
  } catch (e) {
    console.error(e);
  }

  const wells = response
    ? response.data
        .map(item => {
          const wellData = {
            id: Number(item.id),
            name: get(item, 'attributes.name'),
            status: get(item, 'attributes.status'),
            rigId: get(item, 'attributes.parent_asset_id') || 'Null',
            rigName: get(item, 'attributes.parent_asset_name') || 'Null',
            formation: get(item, 'attributes.target_formation') || 'Null',
            stringDesign: get(item, 'attributes.string_design') || 'Null',
            programName: get(item, 'attributes.root_asset_name') || 'Null',
            basin: get(item, 'attributes.basin') || 'Null',
            county: get(item, 'attributes.county') || 'Null',
            area: get(item, 'attributes.area') || 'Null',
            visibility: get(item, 'attributes.visibility'),
            topHole: get(item, 'attributes.top_hole'),
            rigReleaseDate: get(item, 'attributes.stats.well_end'),
            totalDepth: get(item, 'attributes.stats.total_depth'),
            is_usable: true, // Flag which indicates if a well can be used in apps, default is true
            apiNumber: get(item, 'attributes.settings.api_number', '-'),
          };
          return wellData;
        })
        .filter(item => item.visibility === 'visible')
    : [];

  // Invoke "addWellsUsabilityInfo" hook here, which will update "is_usuable" field
  if (addWellsUsabilityInfo) {
    const updatedWells = await addWellsUsabilityInfo(wells);
    return updatedWells;
  }

  return wells;
}

export async function fetchBicWellSections(assetId) {
  return getAppStorage('corva', 'data.offset-wells.bic', assetId, {
    limit: 1,
    sort: '{timestamp: -1}',
  });
}

export async function fetchWellhubWells(assetId) {
  let response = null;
  try {
    response = await getAppStorage('corva', 'data.offset_wells', assetId, { limit: 1 });
  } catch (e) {
    console.error(e);
  }

  return response || [];
}

async function fetchRigs(page, company) {
  const fields = ['rig.name', 'rig.active_well', 'rig.asset_id'];
  const options = {
    per_page: 1000,
    page,
    fields,
    sort: 'name',
    company,
  };
  let response;
  try {
    response = await getRigs(options);
  } catch (e) {
    console.error(e);
    response = [];
  }

  const formattedResponse = dataFormatter.deserialize(response);
  return formattedResponse.map(asset => ({
    redirectAssetId: get(asset, ['active_well', 'asset_id']) || null,
    ...asset,
  }));
}

async function fetchFracFleets(page, company) {
  const fields = ['frac_fleet.name', 'frac_fleet.current_pad_id', 'frac_fleet.pad_frac_fleets'];
  const options = {
    per_page: 1000,
    page,
    fields,
    sort: 'name',
    company,
  };
  let response;
  try {
    response = await getFracFleets(options);
  } catch (e) {
    console.error(e);
    response = [];
  }

  const formattedResponse = dataFormatter.deserialize(response);
  return formattedResponse.map(asset => ({
    redirectAssetId: get(asset, ['current_pad_id']) || null,
    ...asset,
  }));
}

async function fetchDrilloutUnits(page, company) {
  const fields = ['drillout_unit.name', 'drillout_unit.well'];
  const options = {
    per_page: 1000,
    page,
    fields,
    sort: 'name',
    company,
  };
  let response;
  try {
    response = await getDrilloutUnits(options);
  } catch (e) {
    console.error(e);
    response = [];
  }

  const formattedResponse = dataFormatter.deserialize(response);
  return formattedResponse.map(asset => ({
    redirectAssetId: get(asset, ['well', 'asset_id']) || null,
    ...asset,
  }));
}

export async function fetchAllAssets(assetType, page = 1, company) {
  if (assetType === 'well' || assetType === 'api_number') {
    const result = await fetchWells(company, null);
    return result.map(asset => ({
      redirectAssetId: asset.id,
      apiNumber: asset.api_number,
      name: asset.name,
      asset_id: asset.id,
      type: assetType,
    }));
  }
  if (assetType === 'rig') {
    const result = await fetchRigs(page, company);
    return result;
  }
  if (assetType === 'frac_fleet') {
    const result = await fetchFracFleets(page, company);
    return result;
  }
  if (assetType === 'drillout_unit') {
    const result = await fetchDrilloutUnits(page, company);
    return result;
  }
  const allResult = await Promise.all([
    fetchWells('well', company),
    fetchRigs(page, company),
    fetchFracFleets(page, company),
    fetchDrilloutUnits(page, company),
  ]);

  return concat(...allResult);
}

export async function fetchCompanyGoals(companyId) {
  let response;
  try {
    response = await getCompanyGoals(companyId);
  } catch (e) {
    console.error(e);
  }

  return response ? get(response, 'company_goals') || {} : {};
}

export async function fetchMetricsData(companyId, wellIds) {
  if (wellIds.length === 0) {
    return [];
  }

  const chunkSize = Math.floor(wellIds.length / MAX_WELL_NUMBER) + 1;

  const records = await Promise.all(
    range(chunkSize).map(async (_, index) => {
      const $match = {
        company_id: companyId,
        'data.asset_id': {
          $in: wellIds.slice(MAX_WELL_NUMBER * index, MAX_WELL_NUMBER * (index + 1)),
        },
        'data.key': { $in: METRICS_KEYS },
        'data.type': 'asset',
      };

      const $project = {
        _id: 0,
        'data.key': 1,
        'data.value': 1,
        asset_id: '$data.asset_id',
      };

      const queryJson = {
        aggregate: JSON.stringify([{ $match }, { $project }]),
      };

      let response = null;
      try {
        response = await getAppStorage('corva', 'metrics', null, queryJson);
      } catch (e) {
        console.error(e);
      }

      return response || [];
    })
  );

  const result = [];
  records.forEach(data => result.push(...data));
  return result;
}
