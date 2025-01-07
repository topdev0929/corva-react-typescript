import { mockedInsightsApi } from '@/mocks/api/insights-api';
import {
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';
import { mockedInsight, mockedInsightComment } from '@/mocks/insight';

import { SELECTED_INSIGHTS_MODE, SelectedInsightsStoreImpl } from '../index';
import { mockedRecordsApi } from '@/mocks/api/records-api';
import { mockedInsightsStore } from '@/mocks/stores/insights-store';
import { mockedGlobalStore } from '@/mocks/stores/global-store';
import { mockedFiltersStore } from '@/mocks/stores/filters-store';
import { mockedRecord } from '@/mocks/record';

jest.mock('@/shared/services/insights-events-listener', () => {
  const originalModule = jest.requireActual('@/shared/services/insights-events-listener');
  return {
    __esModule: true,
    ...originalModule,
    insightsEventListener: {
      notify: jest.fn(),
    },
  };
});
jest.mock('@/entities/insight', () => {
  const originalModule = jest.requireActual('@/entities/insight');
  return {
    __esModule: true,
    ...originalModule,
    groupInsightsByDay: jest
      .fn()
      .mockImplementation(() => new Map([[new Date('2022-01-01'), [mockedInsight]]])),
  };
});

describe('SelectedInsights store', () => {
  let store: SelectedInsightsStoreImpl;

  beforeEach(() => {
    store = new SelectedInsightsStoreImpl(
      { insights: mockedInsightsApi, records: mockedRecordsApi },
      { insights: mockedInsightsStore, global: mockedGlobalStore, filters: mockedFiltersStore }
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
  });

  describe('Insights by tab', () => {
    it('should return insights by tab "all"', () => {
      expect(store.insights).toEqual(mockedInsightsStore.list);
    });

    it('should return insights by tab "docs"', () => {
      const insightWithDocs = {
        ...mockedInsight,
        files: [{ ...mockedRecord, name: 'file.txt', ref: 'file.txt' }],
      };
      mockedInsightsStore.list = [...mockedInsightsStore.list, insightWithDocs];
      store = new SelectedInsightsStoreImpl(
        { insights: mockedInsightsApi, records: mockedRecordsApi },
        { insights: mockedInsightsStore, global: mockedGlobalStore, filters: mockedFiltersStore }
      );

      store.setTab('docs');
      expect(store.insights).toEqual([insightWithDocs]);
    });

    it('should return insights by tab "photos"', () => {
      const insightWithPhotos = {
        ...mockedInsight,
        files: [{ ...mockedRecord, name: 'file.png', ref: 'file.png' }],
      };
      mockedInsightsStore.list = [...mockedInsightsStore.list, insightWithPhotos];
      store = new SelectedInsightsStoreImpl(
        { insights: mockedInsightsApi, records: mockedRecordsApi },
        { insights: mockedInsightsStore, global: mockedGlobalStore, filters: mockedFiltersStore }
      );

      store.setTab('photos');
      expect(store.insights).toEqual([insightWithPhotos]);
    });
  });

  it('should return isEmpty flag', () => {
    expect(store.isEmpty).toEqual(false);
  });

  it('should return isLoading flag', () => {
    expect(store.isLoading).toEqual(mockedInsightsStore.isLoading);
  });

  it('should return insight groups', () => {
    expect(store.insightsGroups.size).toEqual(1);
    expect(store.mode).toEqual(SELECTED_INSIGHTS_MODE.GROUP);
  });

  it('should return empty insight groups', () => {
    store = new SelectedInsightsStoreImpl(
      { insights: mockedInsightsApi, records: mockedRecordsApi },
      {
        insights: mockedInsightsStore,
        global: mockedGlobalStore,
        filters: { ...mockedFiltersStore, range: null },
      }
    );

    expect(store.insightsGroups.size).toEqual(0);
    expect(store.mode).toEqual(SELECTED_INSIGHTS_MODE.LIST);
  });

  it('should change tab', () => {
    expect(store.tab).toEqual('all');
    store.setTab('docs');
    expect(store.tab).toEqual('docs');
  });

  it('should expand sidebar', () => {
    expect(store.isExpanded).toEqual(false);
    store.expandSideBar();
    expect(store.isExpanded).toEqual(true);
  });

  it('should collapse sidebar', () => {
    store.expandSideBar();
    expect(store.isExpanded).toEqual(true);
    store.collapseSideBar();
    expect(store.isExpanded).toEqual(false);
  });

  it('should start editing', () => {
    expect(store.isEditInsightModalOpen).toEqual(false);
    store.requestEditInsight(mockedInsight);
    expect(store.isEditInsightModalOpen).toEqual(true);
    expect(store.selectedInsight).toEqual(mockedInsight);
  });

  it('should cancel editing', () => {
    store.requestEditInsight(mockedInsight);
    expect(store.isEditInsightModalOpen).toEqual(true);
    store.cancelEditInsight();
    expect(store.isEditInsightModalOpen).toEqual(false);
    expect(store.selectedInsight).toEqual(null);
  });

  it('should reset store', () => {
    store.setTab('docs');
    expect(store.tab).toEqual('docs');
    store.reset();
    expect(store.tab).toEqual('all');
  });

  it('should delete insight', () => {
    store.deleteInsight('1');
    expect(mockedInsightsApi.delete).toBeCalledWith('1');
  });

  it('should return file link', async () => {
    await store.getFileLink('ref');
    expect(mockedRecordsApi.getFileLink).toBeCalledWith('ref');
  });

  it('should add comment', async () => {
    await store.addInsightComment(mockedInsight, 'text');
    expect(mockedInsightsApi.addComment).toBeCalledWith(
      mockedInsight,
      {
        text: 'text',
        author: {
          id: mockedGlobalStore.user.id,
          firstName: mockedGlobalStore.user.firstName,
          lastName: mockedGlobalStore.user.lastName,
          profilePhoto: mockedGlobalStore.user.profilePhoto,
        },
      },
      mockedGlobalStore.currentCompanyId
    );
    expect(insightsEventListener.notify).toBeCalledWith({
      type: InsightsEventTypes.INSIGHT_UPDATED,
      payload: mockedInsight,
    });
  });

  it('should delete comment', async () => {
    await store.deleteInsightComment(mockedInsight, 'commentId');
    expect(mockedInsightsApi.deleteComment).toBeCalledWith(
      mockedInsight,
      'commentId',
      mockedGlobalStore.currentCompanyId
    );
    expect(insightsEventListener.notify).toBeCalledWith({
      type: InsightsEventTypes.INSIGHT_UPDATED,
      payload: mockedInsight,
    });
  });

  it('should update comment', async () => {
    await store.updateInsightComment(mockedInsight, mockedInsightComment);
    expect(mockedInsightsApi.updateComment).toBeCalledWith(
      mockedInsight,
      mockedInsightComment,
      mockedGlobalStore.currentCompanyId
    );
    expect(insightsEventListener.notify).toBeCalledWith({
      type: InsightsEventTypes.INSIGHT_UPDATED,
      payload: mockedInsight,
    });
  });
});
