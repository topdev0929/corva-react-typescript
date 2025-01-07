export const normalizeAssetForApp = (asset, companyId) => {
  if (!asset) return null;

  const normalizedAsset = asset.parent_asset
    ? {
        ...asset,
        parent_asset_id: asset.parent_asset.id, // NOTE: Some apps requires this.
        company_id: companyId,
      }
    : {
        id: asset.active_well.id,
        name: asset.active_well.name,
        company_id: companyId,

        parent_asset: {
          id: asset.id,
          name: asset.name,
        },
        parent_asset_id: asset.id,
      };

  return asset.id ? normalizedAsset : null;
};
