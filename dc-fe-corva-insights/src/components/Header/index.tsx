import { observer } from 'mobx-react-lite';
import { IconButton } from '@corva/ui/components';

import { useGlobalStore } from '@/contexts/global';
import timelineIcon from '@/assets/timeline.svg';

import { Filters } from './Filters';
import { HeaderAddInsight } from './AddInsight';
import styles from './index.module.css';

export const Header = observer(() => {
  const globalStore = useGlobalStore();

  return (
    <div className={styles.container}>
      <Filters />
      <div className={styles.right}>
        <HeaderAddInsight />
        {globalStore.insightsDetailsMode === 'fullscreen' && (
          <IconButton
            isActive
            size="small"
            onClick={() => globalStore.openFullscreenInsightsDetails()}
            tooltipProps={{ title: 'Show insights for selected dates' }}
          >
            <img src={timelineIcon} alt="timeline" />
          </IconButton>
        )}
      </div>
    </div>
  );
});

Header.displayName = 'Header';
