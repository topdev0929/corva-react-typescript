import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useDIListStore } from '@/contexts/di-list';
import { OPProvider } from '@/contexts/optimization-parameters';
import { DIChartProvider } from '@/contexts/di-chart';
import { useFiltersStore } from '@/contexts/filters';
import { useGlobalStore } from '@/contexts/global';

import { Header } from './Header';
import { CurrentDI } from './CurrentDI';
import { DIChange } from './DIChange';
import { RecommendedParameters } from './RecommendedParameters';
import { DIListChart } from './DIListGraph';
import styles from './Main.module.css';

export const Main: FC = observer(() => {
  const globalStore = useGlobalStore();
  const diStore = useDIListStore();
  const filtersStore = useFiltersStore();

  useEffect(() => {
    diStore.loadData(globalStore.currentAssetId);
    filtersStore.setSelectedWellsId([]);
    return () => {
      diStore.onUnmount();
    };
  }, [globalStore.currentAssetId]);

  useEffect(() => {
    filtersStore.loadWells(globalStore.assetIds);
  }, [globalStore.assetIds]);

  useEffect(() => {
    filtersStore.loadBHAs(globalStore.currentAssetId);
  }, [globalStore.currentAssetId]);

  return (
    <DIChartProvider diStore={diStore} globalStore={globalStore} filtersStore={filtersStore}>
      <Header />
      <div
        className={classNames(styles.container, {
          [styles.maximized]: globalStore.isAppMaximized,
          [styles.tablet]: globalStore.isTabletSize,
          [styles.tabletSm]: globalStore.isTabletSmSize,
          [styles.mobile]: globalStore.isMobileSize,
          [styles.fullScreen]: globalStore.isFullScreen,
        })}
      >
        <div className={styles.wrapper}>
          <div
            className={classNames(styles.block, styles.currentIndex, {
              [styles.currentIndexSm]: globalStore.isTabletSmSize,
              [styles.currentIndexMobile]: globalStore.isMobileSize,
            })}
          >
            <CurrentDI />
          </div>
          <div className={classNames(styles.block, styles.deltaChange)}>
            <DIChange />
          </div>
          <div className={classNames(styles.block, styles.recommendedBounds)}>
            <OPProvider diStore={diStore}>
              <RecommendedParameters />
            </OPProvider>
          </div>
        </div>
        <div className={classNames(styles.block, styles.lineChart)}>
          <DIListChart />
        </div>
      </div>
    </DIChartProvider>
  );
});

Main.displayName = 'Main';
