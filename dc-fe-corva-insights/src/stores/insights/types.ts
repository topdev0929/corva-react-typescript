import { AssetId } from '@/entities/asset';
import { Insight, INSIGHT_TYPE } from '@/entities/insight';
import { InsightsApi } from '@/api/insights';
import { AuthorsApi } from '@/api/authors';
import { RecordsApi } from '@/api/records';
import { GlobalStore } from '@/stores/global';
import { InsightsObserver } from '@/shared/services/insights-events-listener';
import { DateRange } from '@/shared/types';

export type APIDependencies = {
  insights: InsightsApi;
  authors: AuthorsApi;
  records: RecordsApi;
};
export type StoresDependencies = {
  global: GlobalStore;
};

export type Filters = {
  types: INSIGHT_TYPE[];
  range: DateRange | null;
  day?: Date;
};

export interface InsightsStore extends InsightsObserver {
  list: Insight[];
  isLoading: boolean;
  isEmpty: boolean;
  loadData: (assetId: AssetId, filters: Filters) => Promise<void>;
  reset: () => void;
  onDestroy: () => void;
}
