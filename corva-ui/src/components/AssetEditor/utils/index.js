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
