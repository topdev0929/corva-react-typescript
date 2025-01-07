import { observer } from 'mobx-react-lite';
import { useEffect, useCallback } from 'react';

import { useDIChartStore } from '@/contexts/di-chart';
import { useFiltersStore } from '@/contexts/filters';

import { BlockContainer } from '../Container';
import { LineChart } from './Chart';
import { AxisSelector } from './AxisSelector';
import styles from './index.module.css';
import { FullscreenButton } from '@/components/DIListGraph/FullScreenButton';

export const DIListChart = observer(() => {
  const store = useDIChartStore();
  const filtersStore = useFiltersStore();

  useEffect(() => {
    store.loadData(filtersStore.selectedWells);
  }, [filtersStore.selectedWells]);

  const onXAxisChange = useCallback(axis => store.selectXAxis(axis), []);
  const onYAxisChange = useCallback(axis => store.selectYAxis(axis), []);

  return (
    <BlockContainer isLoading={store.isLoading} isEmpty={store.isEmpty}>
      <div className={styles.container}>
        <div className={styles.chart}>
          <FullscreenButton />
          <LineChart />
        </div>
        <div className={styles.xAxisSelector}>
          <AxisSelector
            axis={store.selectedXAxis}
            options={store.xAxisOptions}
            onChange={onXAxisChange}
            type="horizontal"
          />
        </div>
        <div className={styles.yAxisSelector}>
          <AxisSelector
            axis={store.selectedYAxis}
            options={store.yAxisOptions}
            onChange={onYAxisChange}
            type="vertical"
          />
        </div>
      </div>
    </BlockContainer>
  );
});

DIListChart.displayName = 'DIListChart';
