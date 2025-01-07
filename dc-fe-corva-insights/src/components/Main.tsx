import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { FC } from 'react';

import { FiltersProvider } from '@/contexts/filters';
import { CalendarProvider } from '@/contexts/calendar';
import { SelectedInsightsProvider } from '@/contexts/selected-insights';
import { useGlobalStore } from '@/contexts/global';
import { APP_SIZE } from '@/shared/types';

import { Header } from './Header';
import { Calendar } from './Calendar';
import { SelectedInsightsPanel } from './SelectedInsightsPanel';
import { AddInsight } from './InsightForm';
import styles from './Main.module.css';

type Props = {
  appSettings: { [key: string]: any };
};

export const Main: FC<Props> = observer(({ appSettings }) => {
  const globalStore = useGlobalStore();

  return (
    <div className={styles.container}>
      <FiltersProvider defaultDay={appSettings.projectStartDate}>
        <div
          className={classnames(styles.main, {
            [styles.isMobile]: globalStore.appSize !== APP_SIZE.DESKTOP,
          })}
        >
          <Header />
          <CalendarProvider>
            <Calendar />
          </CalendarProvider>
        </div>
        <SelectedInsightsProvider>
          <SelectedInsightsPanel />
        </SelectedInsightsProvider>
        <AddInsight />
      </FiltersProvider>
    </div>
  );
});

Main.displayName = 'Main';
