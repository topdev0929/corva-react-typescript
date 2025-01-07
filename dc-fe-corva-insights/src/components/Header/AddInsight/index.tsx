import { Button } from '@corva/ui/components';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';
import { APP_SIZE } from '@/shared/types';
import { VIEWS } from '@/constants';

export const HeaderAddInsight = observer(() => {
  const globalStore = useGlobalStore();
  const showAddInsightBtn =
    globalStore.appSize === APP_SIZE.DESKTOP || globalStore.appSize === APP_SIZE.TABLET;
  const testId = `${VIEWS.HEADER}_addInsightBtn`;

  const onClick = () => {
    globalStore.openAddInsightForm();
  };

  return (
    <>
      {showAddInsightBtn ? (
        <Button
          data-testid={testId}
          variation="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={onClick}
        >
          Add Insight
        </Button>
      ) : (
        <Fab size="small" color="primary" onClick={onClick} data-testid={testId}>
          <AddIcon />
        </Fab>
      )}
    </>
  );
});

HeaderAddInsight.displayName = 'HeaderAddInsight';
