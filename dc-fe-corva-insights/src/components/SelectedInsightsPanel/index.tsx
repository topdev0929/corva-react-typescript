import { AppSideBar } from '@corva/ui/components';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TrendingUp as TrendingUpIcon } from '@icon-park/react';

import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { useFiltersStore } from '@/contexts/filters';
import { useGlobalStore } from '@/contexts/global';
import { EditInsight } from '@/components/InsightForm';
import { VIEWS } from '@/constants';

import { SelectedInsightsModal } from './VersionModal';
import { SelectedDayHeader } from './Header';
import { SelectedInsightsTabBar } from './TabBar';
import { SelectedInsightsMain } from './Main';
import { AddInsightIcon } from './AddInsightIcon';
import { FullScreenVersion } from './VersionFullScreen';
import styles from './index.module.css';

export const SelectedInsightsPanel = observer(() => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();
  const store = useSelectedInsightsStore();

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  if (globalStore.insightsDetailsMode === 'fullscreen') {
    return <FullScreenVersion />;
  }

  return (
    <AppSideBar
      data-testid={`${VIEWS.DAY_PANEL}_sidebar`}
      isOpen={isSideBarOpen}
      setIsOpen={setIsSideBarOpen}
      anchor="right"
      header={
        <SelectedDayHeader
          date={filtersStore.selectedDay}
          range={filtersStore.range}
          onExpand={() => store.expandSideBar()}
        />
      }
      headerIcon={<TrendingUpIcon size="24" />}
      headerTitleIcon={<TrendingUpIcon size="24" />}
    >
      <div className={styles.tabBar}>
        <SelectedInsightsTabBar />
      </div>
      <div className={styles.content}>
        {!store.isExpanded ? (
          <SelectedInsightsMain className={styles.main} />
        ) : (
          <SelectedInsightsModal />
        )}
      </div>
      <div className={styles.commentIcon}>
        <AddInsightIcon />
      </div>
      <EditInsight
        open={store.isEditInsightModalOpen}
        onClose={() => store.cancelEditInsight()}
        editedInsight={store.selectedInsight}
      />
    </AppSideBar>
  );
});

SelectedInsightsPanel.displayName = 'SelectedInsightsPanel';
