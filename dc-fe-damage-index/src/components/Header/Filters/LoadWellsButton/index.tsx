import { Tooltip } from '@corva/ui/components';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';
import { useFiltersStore } from '@/contexts/filters';

export const LoadWellsButton = observer(() => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();

  const onClick = useCallback(
    () => filtersStore.loadWells(globalStore.assetIds),
    [globalStore.assetIds]
  );

  return (
    <Tooltip title="Reload offset wells">
      <Fab size="small" onClick={onClick}>
        <RefreshIcon />
      </Fab>
    </Tooltip>
  );
});

LoadWellsButton.displayName = 'LoadWellsButton';
