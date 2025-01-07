import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { jsonApi } from '@corva/ui/clients';
import { METADATA } from '@/meta';
import { convertGoals } from '@/utils/conversionUtils';
import { GOALS_LIST } from '@/constants';
import { getGoalKey } from '@/utils/dataUtils';

export const loadGoals = async assetId => {
  const queryJson = {
    asset_id: assetId,
    limit: 1,
  };

  if (!assetId) {
    return {};
  }

  try {
    const result = await jsonApi.getAppStorage(
      METADATA.provider,
      METADATA.collections.goals,
      assetId,
      queryJson
    );

    return convertGoals(result[0]);
  } catch (e) {
    return {};
  }
};

const empty = {};

const useGoals = (currentAsset, appSettings) => {
  const id = currentAsset?.asset_id;
  const goalSettings = appSettings?.goalSettings || empty;
  const { data } = useQuery(['goals', id], () => loadGoals(id));

  const goals = useMemo(() => {
    if (!data) {
      return [];
    }

    const mappedGoals = GOALS_LIST.map(goal => {
      const { key } = goal;

      const minKey = getGoalKey(key, 'min');
      const maxKey = getGoalKey(key, 'max');
      const colorKey = getGoalKey(key, 'color');
      const enabledKey = getGoalKey(key, 'enabled');

      const min = data[minKey];
      const max = data[maxKey];
      const color = goalSettings[colorKey] || goal.color;
      if ((!min && !max) || !color) {
        return;
      }

      if (goalSettings[enabledKey] === false) {
        return;
      }

      return {
        ...goal,
        min,
        max,
        color,
      };
    }).filter(Boolean);

    return mappedGoals;
  }, [data, goalSettings]);

  return goals;
};

export default useGoals;
