import { useMemo } from 'react';

import { Well } from '@/types/Stream';

type Params = {
  isAssetDashboard: boolean;
  isPadMode: boolean;
  selectedWells: Well[];
  currentWellId: number;
};

const useActiveWells = ({ isAssetDashboard, isPadMode, selectedWells, currentWellId }: Params) => {
  // stream status is required for active wells only
  // well in asset dashboard doesn't have is_active property
  // subscribe to all wells in pad mode, single well in other modes
  return useMemo(
    () =>
      isPadMode
        ? selectedWells.filter(well => well.is_active || isAssetDashboard)
        : selectedWells.filter(well => well.asset_id === currentWellId),
    [selectedWells, isPadMode, currentWellId]
  );
};

export default useActiveWells;
