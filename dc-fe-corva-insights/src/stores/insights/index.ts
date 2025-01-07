import { action, computed, makeObservable, observable } from 'mobx';

import { Insight, InsightAuthor, InsightComment } from '@/entities/insight';
import { AssetId } from '@/entities/asset';
import {
  InsightsEvent,
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';
import { asyncMap } from '@/shared/utils';

import { StoreWithDependencies } from '../store';
import { InsightsStore, APIDependencies, StoresDependencies, Filters } from './types';

export * from './types';

export class InsightsStoreImpl
  extends StoreWithDependencies<APIDependencies, StoresDependencies>
  implements InsightsStore
{
  @observable list: Insight[] = [];
  @observable isLoading = false;
  readonly #mode: 'preview' | 'full' = 'preview';
  #cachedAssetId: AssetId | null = null;
  #cachedFilters: Filters | null = null;
  #eventsListener = insightsEventListener;
  #loadAttempts = 0;

  constructor(
    api: APIDependencies,
    stores: StoresDependencies,
    mode: 'preview' | 'full' = 'preview'
  ) {
    super(api, stores);
    makeObservable(this);
    this.#mode = mode;
    this.#eventsListener.attach(this);
  }

  @computed
  get isEmpty() {
    return this.list.length === 0;
  }

  @action
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  setInsights(insights: Insight[]) {
    this.list = insights;
  }

  @action
  addInsight(insight: Insight) {
    this.list.push(insight);
  }

  @action
  updateInsight(insight: Insight) {
    this.list = this.list.map(item => (item.id === insight.id ? insight : item));
  }

  @action
  deleteInsight(id: string) {
    this.list = this.list.filter(item => item.id !== id);
  }

  async update(event: InsightsEvent) {
    if (this.#mode === 'full' && this.#cachedAssetId && this.#cachedFilters) {
      const insights = await this.#fetchData(this.#cachedAssetId, this.#cachedFilters);
      return this.setInsights(insights);
    }
    switch (event.type) {
      case InsightsEventTypes.INSIGHT_CREATED:
        this.addInsight(event.payload);
        break;
      case InsightsEventTypes.INSIGHT_UPDATED:
        this.updateInsight(event.payload);
        break;
      case InsightsEventTypes.INSIGHT_DELETED:
        this.deleteInsight(event.payload);
        break;
      default:
        break;
    }
  }

  async loadData(assetId: AssetId, filters: Filters) {
    const loadingAttemptIndex = this.#startLoading();
    this.#cachedAssetId = assetId;
    this.#cachedFilters = filters;
    const insights = await this.#fetchData(assetId, filters);
    if (this.#isLastLoadingAttempt(loadingAttemptIndex)) {
      this.setInsights(insights);
      this.#finishLoading();
    }
  }

  reset() {
    this.setInsights([]);
  }

  onDestroy() {
    this.#eventsListener.detach(this);
  }

  async #fetchData(assetId: AssetId, filters: Filters): Promise<Insight[]> {
    try {
      let list: Insight[] = await this.api.insights.getForRange(assetId, filters);
      if (this.#mode === 'full') {
        list = await this.#loadFiles(list);
        this.#updateAuthors(list);
      }
      return list;
    } catch (e) {
      return [];
    }
  }

  async #loadFiles(insights: Insight[]): Promise<Insight[]> {
    return asyncMap<Insight>(insights, insight => this.#loadFilesFor(insight));
  }

  async #loadFilesFor(insight: Insight): Promise<Insight> {
    if (!insight.filesIds.length) return insight;
    try {
      const files = await this.api.records.getByIds(
        this.stores.global.currentAssetId,
        insight.filesIds
      );
      return { ...insight, files };
    } catch (e) {
      return insight;
    }
  }

  async #updateAuthors(insights: Insight[]) {
    let list = await asyncMap<Insight>(insights, insight => this.#loadAuthorFor(insight));
    list = await asyncMap<Insight>(list, insight => this.#loadCommentAuthorsFor(insight));
    this.setInsights(list);
  }

  async #loadCommentAuthorsFor(insight: Insight): Promise<Insight> {
    const otherComments = await asyncMap<InsightComment>(insight.otherComments, comment =>
      this.#loadAuthorFor(comment)
    );
    return { ...insight, otherComments };
  }

  async #loadAuthorFor<Item extends { author: InsightAuthor }>(item: Item): Promise<Item> {
    try {
      const author = await this.api.authors.getAuthorById(item.author.id);
      return { ...item, author };
    } catch (e) {
      return item;
    }
  }

  #isLastLoadingAttempt(loadingAttemptIndex: number): boolean {
    return loadingAttemptIndex === this.#loadAttempts;
  }

  #startLoading(): number {
    this.#loadAttempts += 1;
    this.setIsLoading(true);
    return this.#loadAttempts;
  }

  #finishLoading() {
    this.#loadAttempts = 0;
    this.setIsLoading(false);
  }
}
