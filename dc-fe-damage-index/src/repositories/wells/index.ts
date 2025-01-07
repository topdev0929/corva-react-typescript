import { corvaAPI, corvaDataAPI } from '@corva/ui/clients';

import { Well } from '@/entities/well';
import { AssetId } from '@/entities/asset';
import { IWellsRepository } from '@/stores/filters';
import { API_CONFIG, API_PATH } from '@/constants';

import { parseWellFromJson, parseAssetIdsFormJson } from './parser';

export class WellsRepository implements IWellsRepository {
  private static instance: WellsRepository;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): WellsRepository {
    if (!WellsRepository.instance) {
      WellsRepository.instance = new WellsRepository();
    }
    return WellsRepository.instance;
  }

  async get(assetIds: number[]): Promise<Well[]> {
    const params = {
      match: JSON.stringify({
        asset_id: { $in: assetIds },
        'data.DI': { $eq: 0 },
        'data.Well Name': { $exists: true },
      }),
      group: JSON.stringify({ _id: '$data.Well Name', asset_id: { $first: '$asset_id' } }),
      sort: JSON.stringify({ timestamp: -1 }),
      limit: API_CONFIG.DEFAULT_LIMIT,
    };
    const response = await corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.DAMAGE_INDEX_DEPTH}/aggregate/`,
      params
    );
    return response.map(parseWellFromJson);
  }

  async getAssetIdsByCompany(companyId: number): Promise<AssetId[]> {
    const response = await corvaAPI.get('/v2/wells', {
      company_id: companyId,
      fields: ['well.asset_id'],
      per_page: 10000,
    });
    return parseAssetIdsFormJson(response);
  }
}

export const wellsRepository = WellsRepository.getInstance();
