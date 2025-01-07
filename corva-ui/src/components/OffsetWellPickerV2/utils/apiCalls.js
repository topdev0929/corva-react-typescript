import { get, sortBy, range } from 'lodash';

import { getAssets, getAppStorage, getCompanyGoals, getCompanies } from '~/clients/jsonApi';

import { METRICS_KEYS } from '../constants';

const MAX_WELL_NUMBER = 200;

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
        'asset.stats',
        'asset.target_formation',
        'asset.string_design',
        'asset.root_asset_name',
        'asset.basin',
        'asset.county',
        'asset.area',
        'asset.visibility',
        'asset.top_hole',
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
