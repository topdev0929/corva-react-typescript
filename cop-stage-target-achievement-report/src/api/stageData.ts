import { getAppStorage, getDataAppStorage, getAsset, getPicklist } from '@corva/ui/clients/jsonApi';
import { isDevOrQAEnv } from '@corva/ui/utils/env';

import { StageScore, Well, WellsStagesData } from '../types';

import { COLLECTIONS, PROVIDER } from './constants';

const loadStageData = async (
  assetId: number
): Promise<{
  designStage: any;
  scores: StageScore[];
  actualStageData: any;
}> => {
  try {
    const query = JSON.stringify({
      asset_id: assetId,
    });
    const [[designStage], scores, actualStageData] = await Promise.all([
      getAppStorage(PROVIDER.corva, COLLECTIONS.design, assetId, {
        fields: ['asset_id', 'data.stage_number'].join(','),
        limit: 1,
        sort: '{data.stage_number:-1}',
      }),
      getDataAppStorage(isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop, COLLECTIONS.scorecards, {
        limit: 300,
        sort: '{"data.stage_number":-1}',
        query,
      }),
      getAppStorage(PROVIDER.corva, COLLECTIONS.stageActual, assetId, {
        limit: 300,
        sort: '{timestamp:-1}',
      }),
    ]);

    return { designStage, scores: scores as StageScore[], actualStageData };
  } catch (e) {
    return { designStage: {}, scores: [], actualStageData: [] };
  }
};

export const loadWellsStageData = async (wells: Well[]): Promise<WellsStagesData> => {
  const apiCalls = wells.map(well => loadStageData(well.asset_id));

  const rawDesignData = await Promise.all(apiCalls);
  const designData = rawDesignData.reduce((result, stage, index) => {
    const { asset_id: assetId } = wells[index];
    const lastStage = stage.scores[0];
    return {
      ...result,
      [assetId]: {
        lastDesignStage: stage.designStage?.data?.stage_number || 0,
        lastActualStage: lastStage?.data?.stage_number || 0,
        scores: stage.scores,
        actualStageData: stage.actualStageData,
      },
    };
  }, {});

  return designData;
};
