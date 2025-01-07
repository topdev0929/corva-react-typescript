import { action, computed, makeObservable, observable } from 'mobx';

import {
  CommentPayload,
  getAuthorDataFromUser,
  groupInsightsByDay,
  Insight,
  InsightComment,
} from '@/entities/insight';
import { isContainDocs, isContainImage } from '@/entities/record';
import {
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';
import { getDaysInRange } from '@/shared/utils';

import { StoreWithDependencies } from '../store';
import {
  APIDependencies,
  SELECTED_INSIGHTS_MODE,
  SelectedInsightsStore,
  SideBarTab,
  StoresDependencies,
} from './types';

export * from './types';

export class SelectedInsightsStoreImpl
  extends StoreWithDependencies<APIDependencies, StoresDependencies>
  implements SelectedInsightsStore
{
  #eventsListener = insightsEventListener;
  @observable tab: SideBarTab = 'all';
  @observable isExpanded = false;
  @observable isEditInsightModalOpen = false;
  @observable selectedInsight: Insight | null = null;

  constructor(api: APIDependencies, stores: StoresDependencies) {
    super(api, stores);
    makeObservable(this);
  }

  @computed
  get insights() {
    if (this.tab === 'docs')
      return this.stores.insights.list.filter(insight => isContainDocs(insight.files));
    else if (this.tab === 'photos')
      return this.stores.insights.list.filter(insight => isContainImage(insight.files));
    return this.stores.insights.list;
  }

  @computed
  get insightsGroups() {
    if (!this.stores.filters.range) return new Map();
    const { start, end } = this.stores.filters.range;
    return groupInsightsByDay(this.insights, getDaysInRange(start, end), {
      skipEmpty: true,
    });
  }

  @computed
  get mode(): SELECTED_INSIGHTS_MODE {
    return this.stores.filters.range ? SELECTED_INSIGHTS_MODE.GROUP : SELECTED_INSIGHTS_MODE.LIST;
  }

  @computed
  get isEmpty() {
    return this.insights.length === 0;
  }

  @computed
  get isLoading() {
    return this.stores.insights.isLoading;
  }

  @action
  setTab(tab: SideBarTab) {
    this.tab = tab;
  }

  @action
  expandSideBar() {
    this.isExpanded = true;
  }

  @action
  collapseSideBar() {
    this.isExpanded = false;
  }

  @action
  requestEditInsight(insight: Insight) {
    this.selectedInsight = insight;
    this.isEditInsightModalOpen = true;
  }

  @action
  cancelEditInsight() {
    this.selectedInsight = null;
    this.isEditInsightModalOpen = false;
  }

  reset() {
    this.setTab('all');
  }

  async deleteInsight(insightId: string) {
    await this.api.insights.delete(insightId);
    this.#eventsListener.notify({ type: InsightsEventTypes.INSIGHT_DELETED, payload: insightId });
  }

  async getFileLink(ref: string): Promise<string> {
    return this.api.records.getFileLink(ref).catch(() => '');
  }

  async addInsightComment(insight: Insight, text: string) {
    const payload: CommentPayload = {
      text,
      author: getAuthorDataFromUser(this.stores.global.user),
    };
    const updatedInsight = await this.api.insights.addComment(
      insight,
      payload,
      this.stores.global.currentCompanyId
    );
    this.#updateInsight(updatedInsight);
  }

  async updateInsightComment(insight: Insight, comment: InsightComment) {
    const updatedInsight = await this.api.insights.updateComment(
      insight,
      comment,
      this.stores.global.currentCompanyId
    );
    this.#updateInsight(updatedInsight);
  }

  async deleteInsightComment(insight: Insight, commentId: string) {
    const updatedInsight = await this.api.insights.deleteComment(
      insight,
      commentId,
      this.stores.global.currentCompanyId
    );
    this.#updateInsight(updatedInsight);
  }

  #updateInsight = (insight: Insight) => {
    this.#eventsListener.notify({ type: InsightsEventTypes.INSIGHT_UPDATED, payload: insight });
  };
}
