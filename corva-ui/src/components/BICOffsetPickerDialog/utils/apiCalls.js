import { get } from 'lodash';

import { getAssets, getAppStorage } from '~/clients/jsonApi';

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

export async function fetchBicWellSections(assetId) {
  return getAppStorage('corva', 'data.offset-wells.bic', assetId, {
    limit: 1,
    sort: '{timestamp: -1}',
  });
}
