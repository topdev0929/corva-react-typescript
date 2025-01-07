import { Well } from '@/entities/well';
import { AssetId } from '@/entities/asset';

export const parseWellFromJson = (obj: any): Well => {
  return {
    assetId: obj.asset_id,
    name: obj._id,
  };
};

export const parseAssetIdsFormJson = (json: any): AssetId[] => {
  return json.data.map(item => item.attributes.asset_id);
};
