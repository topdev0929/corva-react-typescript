import { useQuery } from 'react-query';
import { jsonApi } from '@corva/ui/clients';
import { METADATA } from '@/meta';

export const loadCurrentStage = async assetId => {
  const queryJson = {
    asset_id: assetId,
    sort: '{ data.stage_number: -1 }',
    limit: 1,
  };

  if (!assetId) {
    return [];
  }

  try {
    const result = await jsonApi.getAppStorage(
      METADATA.provider,
      METADATA.collections.stagesData,
      assetId,
      queryJson
    );

    return result;
  } catch (e) {
    return [];
  }
};

const useCurrentStage = (id, stages, stageNumber, enabled) => {
  const currentStage = (stages || []).find(stage => stage.data.stage_number === stageNumber);
  const { data } = useQuery(['currentStage', id], () => loadCurrentStage(id), {
    enabled: id && !currentStage && enabled,
  });

  if (currentStage) {
    return currentStage;
  }

  if (data?.length) {
    return data[0];
  }

  return null;
};

export default useCurrentStage;
