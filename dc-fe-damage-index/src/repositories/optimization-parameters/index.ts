import { corvaDataAPI, socketClient } from '@corva/ui/clients';

import { OptimizationParameters } from '@/entities/optimization-parameter';
import { AssetId } from '@/entities/asset';
import { IOPRepository } from '@/stores/optimization-parameters';
import { API_PATH, API_CONFIG } from '@/constants';

import { parseOptimizationParametersFromJSON } from './parser';

export class OPRepository implements IOPRepository {
  private static instance: OPRepository;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): OPRepository {
    if (!OPRepository.instance) {
      OPRepository.instance = new OPRepository();
    }
    return OPRepository.instance;
  }

  async getLast(assetId: AssetId): Promise<OptimizationParameters | null> {
    const params = {
      limit: API_CONFIG.DEFAULT_LIMIT,
      query: JSON.stringify({ asset_id: assetId }),
      sort: JSON.stringify({ timestamp: -1 }),
    };
    const response = await corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.PO_DATASET}/`,
      params
    );
    if (response.length) {
      return parseOptimizationParametersFromJSON(response[0]);
    } else {
      return Promise.resolve(null);
    }
  }

  subscribe({ assetId, onDataUpdate }) {
    const subscription = {
      assetId,
      dataset: API_CONFIG.PO_DATASET,
      provider: API_CONFIG.PROVIDER,
    };

    const onDataReceive = event => {
      onDataUpdate(event.data.map(parseOptimizationParametersFromJSON));
    };

    return socketClient.subscribe(subscription, { onDataReceive });
  }
}

export const opRepository = OPRepository.getInstance();
