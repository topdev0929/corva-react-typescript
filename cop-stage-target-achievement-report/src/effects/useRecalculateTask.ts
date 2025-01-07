import { useRef } from 'react';
import { showErrorNotification } from '@corva/ui/utils';
import { postTask } from '@corva/ui/clients/jsonApi';
import { isDevOrQAEnv } from '@corva/ui/utils/env';

import { PROVIDER } from '../api/constants';
import { getAssetIdsForFracFleet, saveScorecardSettings } from '../api/scorecardSetting';
import { DesignValues } from '../types';

type TaskProps = {
  assetIds: number[];
  assetName: string;
  maxRate: number;
  maxPressure: number;
  fracFleetId: number;
  setIsCalculating: (state: boolean) => void;
  basin: string;
  companyId: number;
  setDesignValues: (state: DesignValues) => void;
  setAnchorEl: (anchor: any) => void;
};

export function useRecalculateTask({
  assetIds,
  assetName,
  maxRate,
  maxPressure,
  fracFleetId,
  setIsCalculating,
  basin,
  companyId,
  setDesignValues,
  setAnchorEl,
}: TaskProps): {
  handleChangeSettings: () => void;
} {
  const calculateTaskId = useRef(null);

  const handleChangeSettings = async () => {
    setAnchorEl(null);
    setIsCalculating(true);

    if (!basin) {
      showErrorNotification(`${assetName} does not have the basin assigned.`);
    }

    const response = await saveScorecardSettings(
      assetIds[0],
      maxRate,
      maxPressure,
      fracFleetId,
      basin,
      companyId
    );
    if (response.includes('failed')) {
      showErrorNotification('Cannot save scorecard settings');
      setIsCalculating(false);
      return;
    }

    setDesignValues({
      designRate: maxRate,
      designPressure: maxPressure,
    });
    const assetIdsForFracFleet = await getAssetIdsForFracFleet(fracFleetId);

    try {
      const tasks = assetIdsForFracFleet.map(assetId =>
        postTask({
          task: {
            provider: isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop,
            app_key: `${
              isDevOrQAEnv ? PROVIDER.corva : PROVIDER.cop
            }.stage_target_achievement_task`,
            asset_id: assetId,
            properties: {
              frac_fleet_id: fracFleetId,
              asset_ids: assetIds,
            },
          },
        })
      );

      const response = await Promise.all(tasks);
      calculateTaskId.current = response.map(task => task.id);
    } catch (e) {
      console.error(e);
      showErrorNotification('Cannot create task for Calculation');
      setIsCalculating(false);
    }
  };

  return { handleChangeSettings };
}
