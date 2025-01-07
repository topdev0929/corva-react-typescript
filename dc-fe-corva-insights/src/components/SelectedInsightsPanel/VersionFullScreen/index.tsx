import { observer } from 'mobx-react-lite';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { IconButton } from '@corva/ui/components';
import classnames from 'classnames';

import { useFiltersStore } from '@/contexts/filters';
import { useGlobalStore } from '@/contexts/global';
import { useSelectedInsightsStore } from '@/contexts/selected-insights';
import { APP_SIZE } from '@/shared/types';

import { SelectedInsightsTitle } from '../Title';
import { SelectedInsightsTabBar } from '../TabBar';
import { SelectedInsightsMain } from '../Main';
import { AddInsightIcon } from '../AddInsightIcon';
import styles from './index.module.css';
import { EditInsight } from '@/components/InsightForm';

export const FullScreenVersion = observer(() => {
  const globalStore = useGlobalStore();
  const filtersStore = useFiltersStore();
  const store = useSelectedInsightsStore();

  if (!globalStore.isInsightsDetailsFullscreenOpen) return null;

  const isMobileScreen =
    globalStore.appSize === APP_SIZE.MOBILE || globalStore.appSize === APP_SIZE.MOBILE_SM;

  return (
    <div className={classnames(styles.container, { [styles.isMobile]: isMobileScreen })}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <IconButton
            onClick={() => globalStore.closeFullscreenInsightsDetails()}
            tooltipProps={{ title: 'Close' }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <SelectedInsightsTitle
            range={filtersStore.range}
            date={filtersStore.selectedDay}
            size="large"
          />
        </div>
        <div className={styles.tabBar}>
          <SelectedInsightsTabBar />
        </div>
      </div>
      <div className={styles.content}>
        <SelectedInsightsMain className={styles.main} gradientClassName={styles.gradientList} />
      </div>
      <div className={styles.footer}>
        <AddInsightIcon />
      </div>
      <EditInsight
        open={store.isEditInsightModalOpen}
        onClose={() => store.cancelEditInsight()}
        editedInsight={store.selectedInsight}
      />
    </div>
  );
});

FullScreenVersion.displayName = 'SelectedInsightsPanel';
