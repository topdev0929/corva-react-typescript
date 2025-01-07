import { Insight, InsightComment, InsightsPerDay } from '@/entities/insight';
import { RecordsApi } from '@/api/records';
import { InsightsApi } from '@/api/insights';

import { GlobalStore } from '../global';
import { FiltersStore } from '../filters';
import { InsightsStore } from '../insights';

export type APIDependencies = {
  records: RecordsApi;
  insights: InsightsApi;
};
export type StoresDependencies = {
  insights: InsightsStore;
  filters: FiltersStore;
  global: GlobalStore;
};

export type SideBarTab = 'all' | 'docs' | 'photos';
export enum SELECTED_INSIGHTS_MODE {
  GROUP,
  LIST,
}

export interface SelectedInsightsStore {
  insights: Insight[];
  insightsGroups: InsightsPerDay;
  selectedInsight: Insight | null;
  tab: SideBarTab;
  mode: SELECTED_INSIGHTS_MODE;
  isLoading: boolean;
  isEmpty: boolean;
  isExpanded: boolean;
  isEditInsightModalOpen: boolean;
  setTab: (tab: SideBarTab) => void;
  expandSideBar: () => void;
  collapseSideBar: () => void;
  requestEditInsight: (insight: Insight) => void;
  cancelEditInsight: () => void;
  deleteInsight: (insightId: string) => Promise<void>;
  getFileLink: (ref: string) => Promise<string>;
  addInsightComment: (insight: Insight, comment: string) => Promise<void>;
  updateInsightComment: (insight: Insight, comment: InsightComment) => Promise<void>;
  deleteInsightComment: (insight: Insight, commentId: string) => Promise<void>;
  reset: () => void;
}
