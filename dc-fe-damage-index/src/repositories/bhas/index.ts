import { corvaDataAPI } from '@corva/ui/clients';

import { BHA } from '@/entities/bha';
import { AssetId } from '@/entities/asset';
import { IBHAsRepository } from '@/stores/filters';
import { API_CONFIG, API_PATH } from '@/constants';

import { parseBHAsFromJson } from './parser';

export class BHAsRepository implements IBHAsRepository {
  private static instance: BHAsRepository;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): BHAsRepository {
    if (!BHAsRepository.instance) {
      BHAsRepository.instance = new BHAsRepository();
    }
    return BHAsRepository.instance;
  }

  async get(assetId: AssetId): Promise<BHA[]> {
    const params = {
      match: JSON.stringify({
        asset_id: assetId,
        'data.DI': { $eq: 0 },
      }),
      group: JSON.stringify({
        _id: '$data.bha_id',
        timestamp: { $first: '$timestamp' },
      }),
      sort: JSON.stringify({ timestamp: -1 }),
      limit: API_CONFIG.DEFAULT_LIMIT,
    };
    const response = await corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.DAMAGE_INDEX_DEPTH}/aggregate/`,
      params
    );
    return parseBHAsFromJson(response);
  }
}

export const bhasRepository = BHAsRepository.getInstance();
