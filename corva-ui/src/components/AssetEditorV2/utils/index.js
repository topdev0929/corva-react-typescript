import { isEmpty } from 'lodash';
import { ASSET_TYPES } from '~/constants';
import { ACTIVE_STATUS } from '../constants';

export const mapAssetIdPath = assetType => {
  switch (assetType) {
    case 'rig':
    case 'well':
      return ['attributes', 'asset_id'];
    case 'frac_fleet':
    case 'pad':
    default:
      return ['id'];
  }
};

export const getPadFracFleetId = (fracFleets = []) => {
  const currentFracFleet = fracFleets.find(fracFleet => fracFleet === fracFleet.current)?.id;
  const lastCurrentFracFleet = fracFleets.reduce((a, b) => {
    return new Date(a.lastCurrentAt) > new Date(b.lastCurrentAt) ? a : b;
  }, {});

  if (!isEmpty(currentFracFleet)) {
    return currentFracFleet.fracFleet?.id;
  }
  return lastCurrentFracFleet.fracFleet?.id;
};

export const getRequestOptions = (assetType, assetFields = []) => ({
  sort: 'name',
  order: 'asc',
  fields: [`${assetType}.name`, `${assetType}.status`, ...assetFields],
});

export const formatAsset = ({ asset, group, activeWellId, isRequiredAssetId, isPrimaryAsset }) => {
  const formattedAsset = {
    id: +asset.assetId || +asset.id,
    type: asset.type,
    name: asset.name,
  };

  if (isRequiredAssetId) {
    formattedAsset.id = +asset.id;
    formattedAsset.assetId = +asset.assetId;
  }

  if (group) {
    formattedAsset.group = group;
  }
  if (asset.type === ASSET_TYPES.rig.type) {
    formattedAsset.activeWellId = Number(asset.activeWell?.id) || null;
  }
  if (asset.type === ASSET_TYPES.well.type) {
    formattedAsset.status = Number(asset.id) === activeWellId ? ACTIVE_STATUS : null;
  }
  if (asset.type === ASSET_TYPES.pad.type) {
    formattedAsset.parentFracFleetId = asset.parentFracFleetId;

    formattedAsset.status = asset.active ? ACTIVE_STATUS : null;

    if (isPrimaryAsset && !asset.parentFracFleetId) {
      formattedAsset.status = null;
    }
  }
  return formattedAsset;
};

export const sortAsset = curr => (curr.status === ACTIVE_STATUS ? -1 : 1);
