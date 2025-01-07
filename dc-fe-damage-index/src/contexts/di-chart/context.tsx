import { createContext, FC, useState } from 'react';

import { DIChartStore, IDIChartStore } from '@/stores/di-chart';
import { IDIListStore } from '@/stores/di-list';
import { diRepository } from '@/repositories/damage-indexes';
import { LINE_CHART_CONFIG } from '@/constants';
import { IGlobalStore } from '@/stores/global';
import { IFiltersStore } from '@/stores/filters';

export const DIChartContext = createContext<IDIChartStore>({
  lines: [],
  isLoading: true,
  isEmpty: true,
  autoScale: false,
  scales: [],
  selectedYAxis: LINE_CHART_CONFIG.DEFAULT_Y_AXIS_OPTION,
  selectedXAxis: LINE_CHART_CONFIG.DEFAULT_X_AXIS_OPTION,
  yAxisOptions: LINE_CHART_CONFIG.Y_AXIS_OPTIONS,
  xAxisOptions: LINE_CHART_CONFIG.X_AXIS_OPTIONS,
  selectXAxis: () => null,
  selectYAxis: () => null,
  loadData: () => Promise.resolve(),
  setAutoScale: () => null,
  setScales: () => null,
});

type Props = {
  diStore: IDIListStore;
  globalStore: IGlobalStore;
  filtersStore: IFiltersStore;
};

export const DIChartProvider: FC<Props> = ({ children, diStore, globalStore, filtersStore }) => {
  const [store] = useState(
    () => new DIChartStore(diRepository, diStore, globalStore, filtersStore)
  );

  return <DIChartContext.Provider value={store}>{children}</DIChartContext.Provider>;
};
