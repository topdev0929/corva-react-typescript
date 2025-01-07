import Jsona from 'jsona';
import get from 'lodash/get';
import concat from 'lodash/concat';

import { getAssets, getRigs, getFracFleets, getDrilloutUnits } from '~/clients/jsonApi';

const dataFormatter = new Jsona();

export async function fetchWells(assetType = 'well', company) {
  let response = null;
  try {
    response = await getAssets({
      types: ['well'],
      company_id: company ? +company : undefined,
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
        'asset.settings',
        'well.settings',
        // 'asset.status',
        // 'asset.parent_asset',
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
            apiNumber: get(item, 'attributes.settings.api_number', '-'),
          };
          return wellData;
        })
        .filter(item => item.visibility === 'visible')
    : [];
  return wells.map(asset => ({
    redirectAssetId: asset.id,
    apiNumber: asset.api_number,
    name: asset.name,
    asset_id: asset.id,
    type: assetType,
  }));
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

async function fetchFracFleets( page, company) {
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
    const result = await fetchWells(assetType, company);
    return result;
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
