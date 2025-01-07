import { IconButton, Modal } from '@corva/ui/components';
import { observer } from 'mobx-react-lite';
import CloseIcon from '@material-ui/icons/Close';

import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { useFiltersStore } from '@/contexts/filters';
import { VIEWS } from '@/constants';

import { SelectedInsightsMain } from '../Main';
import { SelectedInsightsTitle } from '../Title';
import { SelectedInsightsTabBar } from '../TabBar';
import { AddInsightIcon } from '../AddInsightIcon';
import styles from './index.module.css';

export const SelectedInsightsModal = observer(() => {
  const filtersStore = useFiltersStore();
  const store = useSelectedInsightsStore();

  return (
    <Modal
      data-testid={`${VIEWS.DAY_PANEL}_modal`}
      open={store.isExpanded}
      onClose={() => store.collapseSideBar()}
      contentContainerClassName={styles.container}
      contentClassName={styles.modalContent}
    >
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <SelectedInsightsTitle
            range={filtersStore.range}
            date={filtersStore.selectedDay}
            size="large"
          />
          <SelectedInsightsTabBar />
        </div>
        <IconButton
          onClick={() => store.collapseSideBar()}
          tooltipProps={{ title: 'Close' }}
          data-testid={`${VIEWS.DAY_PANEL}_modal_closeBtn`}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={styles.content}>
        <SelectedInsightsMain className={styles.main} gradientClassName={styles.gradientList} />
      </div>
      <div className={styles.footer}>
        <AddInsightIcon />
      </div>
    </Modal>
  );
});

SelectedInsightsModal.displayName = 'SelectedInsightsModal';
