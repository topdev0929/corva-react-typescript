import Jsona from 'jsona';
import { get, range, sortBy, concat } from 'lodash';
import {
  getAssets,
  getWells,
  getAppStorage,
  getCompanyGoals,
  getRigs,
  getCompanies,
} from '~/clients/jsonApi';
import { ROWS_PER_PAGE } from '../constants';

const dataFormatter = new Jsona();

export async function fetchCompanies() {
  let response;
  try {
    response = await getCompanies();
  } catch (e) {
    console.error(e);
  }

  return response ? sortBy(response, ['name']) : [];
}

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
        'asset.last_active_at',
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
            lastActive: new Date(get(item, 'attributes.last_active_at')).getTime() / 1000,
          };
          return wellData;
        })
        .filter(item => item.visibility.includes('visible'))
    : [];

  // Invoke "addWellsUsabilityInfo" hook here, which will update "is_usuable" field
  if (typeof addWellsUsabilityInfo === 'function') {
    const updatedWells = await addWellsUsabilityInfo(wells);
    return updatedWells;
  }

  return wells;
}

export async function fetchOffsetWellSelections(assetId) {
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

export async function fetchCompanyGoals(companyId) {
  let response;
  try {
    response = await getCompanyGoals(companyId);
  } catch (e) {
    console.error(e);
  }

  return response ? get(response, 'company_goals') || {} : {};
}

const MAX_WELL_NUMBER = 200;

export async function fetchMetricsData(companyId, wellIds, metricsKeys) {
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
        'data.key': { $in: metricsKeys },
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

async function fetchAssetWells(searchKey, page, company) {
  const fields = [
    'well.name',
    'well.asset_id',
    'well.settings',
    'well.status',
    'well.rigName',
    'well.visibility',
  ];
  const options = {
    company,
    search: searchKey,
    per_page: ROWS_PER_PAGE,
    page,
    fields,
    sort: 'name',
  };
  let response;
  try {
    response = await getWells(options);
  } catch (e) {
    console.error(e);
    response = [];
  }
  const formattedResponse = dataFormatter.deserialize(response);

  return formattedResponse.map(asset => ({
    redirectAssetId: asset.asset_id,
    apiNumber: asset.settings.api_number,
    name: asset.name,
    asset_id: asset.asset_id,
    status: asset.status,
    rigName: asset.rigName,
    visibility: asset.visibility,
    type: 'well',
  }));
}

async function fetchRigs(searchKey, page, company) {
  const fields = ['rig.name', 'rig.active_well', 'rig.asset_id'];
  const options = {
    company,
    search: searchKey,
    per_page: ROWS_PER_PAGE,
    page,
    fields,
    sort: 'name',
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

export async function fetchAllAssets(searchKey, assetType, page = 1, company) {
  if (assetType === 'well') {
    const result = await fetchAssetWells(searchKey, page, company);
    return result;
  }

  if (assetType === 'rig') {
    const result = await fetchRigs(searchKey, page, company);
    return result;
  }

  const allResult = await Promise.all([
    fetchAssetWells(searchKey, page, company),
    fetchRigs(searchKey, page, company),
  ]);
  return concat(...allResult);
}
