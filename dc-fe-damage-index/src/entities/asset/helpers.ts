import { AssetId } from './index';

export const removeCurrentAsset = (assetIds: AssetId[], currentAssetId: number): AssetId[] => {
  return assetIds.filter(id => id !== currentAssetId);
};
