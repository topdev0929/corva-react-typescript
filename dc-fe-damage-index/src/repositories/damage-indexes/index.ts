import { corvaDataAPI, socketClient } from '@corva/ui/clients';

import { DamageIndex } from '@/entities/damage-index';
import { AssetId } from '@/entities/asset';
import { IDIRepository } from '@/stores/di-list';
import { API_CONFIG, API_PATH } from '@/constants';

import { parseDIFromJSON, parseDIListFromJSON } from './parser';

export class DIRepository implements IDIRepository {
  private static instance: DIRepository;
  private diFieldsToFetch: string[] = ['_id', 'data', 'timestamp'];

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): DIRepository {
    if (!DIRepository.instance) {
      DIRepository.instance = new DIRepository();
    }
    return DIRepository.instance;
  }

  async getAll(assetId: AssetId): Promise<DamageIndex[]> {
    const response = await this.getResponse({
      limit: API_CONFIG.DEFAULT_LIMIT,
      query: JSON.stringify({
        asset_id: assetId,
      }),
    });
    return parseDIListFromJSON(response);
  }

  async getAllHistorical(assetId: AssetId): Promise<DamageIndex[]> {
    const response = await this.getResponse({
      limit: API_CONFIG.DEFAULT_LIMIT,
      query: JSON.stringify({ asset_id: assetId }),
      dataset: API_CONFIG.DAMAGE_INDEX_DEPTH,
    });
    return parseDIListFromJSON(response);
  }

  async getLast(assetId: AssetId): Promise<DamageIndex | null> {
    const response = await this.getResponse({
      query: JSON.stringify({ asset_id: assetId }),
      limit: 1,
    });
    if (response.length) {
      return parseDIFromJSON(response[0]);
    } else {
      return Promise.resolve(null);
    }
  }

  subscribe({ assetId, onDataUpdate }): () => void {
    const subscription = {
      assetId,
      dataset: API_CONFIG.DAMAGE_INDEX_DEPTH,
      provider: API_CONFIG.PROVIDER,
    };

    const onDataReceive = event => {
      onDataUpdate(event.data.map(parseDIFromJSON));
    };

    return socketClient.subscribe(subscription, { onDataReceive });
  }

  private async getResponse(config: {
    limit: number;
    query: string;
    dataset?: string;
  }): Promise<unknown[]> {
    const params = {
      query: config.query,
      sort: JSON.stringify({ 'data.timestamp': -1 }),
      limit: config.limit,
      fields: this.diFieldsToFetch.join(','),
    };
    return corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${config.dataset ?? API_CONFIG.DAMAGE_INDEX_DEPTH}/`,
      params
    );
  }
}

export const diRepository = DIRepository.getInstance();
