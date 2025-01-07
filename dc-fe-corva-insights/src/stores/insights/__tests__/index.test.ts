import { mockedInsightsApi } from '@/mocks/api/insights-api';
import { mockedAuthorsApi } from '@/mocks/api/authors-api';
import {
  insightsEventListener,
  InsightsEventTypes,
} from '@/shared/services/insights-events-listener';
import { mockedInsight } from '@/mocks/insight';

import { InsightsStoreImpl } from '../index';
import { mockedRecordsApi } from '@/mocks/api/records-api';
import { mockedGlobalStore } from '@/mocks/stores/global-store';
import { InsightsApi } from '@/api/insights';

jest.mock('@/shared/services/insights-events-listener', () => {
  const originalModule = jest.requireActual('@/shared/services/insights-events-listener');
  return {
    __esModule: true,
    ...originalModule,
    insightsEventListener: {
      attach: jest.fn(),
      detach: jest.fn(),
    },
  };
});

describe('InsightsStore', () => {
  let store: InsightsStoreImpl;
  let filters;
  let assetId;

  beforeEach(() => {
    assetId = 1;
    filters = {
      types: [],
      range: { start: new Date('2022-01-01'), end: new Date('2022-01-03') },
    };
    store = new InsightsStoreImpl(
      { insights: mockedInsightsApi, authors: mockedAuthorsApi, records: mockedRecordsApi },
      { global: mockedGlobalStore },
      'preview'
    );
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(insightsEventListener.attach).toBeCalledWith(store);
  });

  it('should be empty', () => {
    expect(store.isEmpty).toBeTruthy();
  });

  it('should not be empty if there are insights', () => {
    store.setInsights([mockedInsight]);
    expect(store.isEmpty).toBeFalsy();
  });

  it('should set insights', () => {
    expect(store.list).toHaveLength(0);
    store.setInsights([mockedInsight, mockedInsight]);
    expect(store.list).toHaveLength(2);
  });

  describe('update method', () => {
    it('should add insight', () => {
      expect(store.list).toHaveLength(0);
      store.update({ type: InsightsEventTypes.INSIGHT_CREATED, payload: mockedInsight });
      expect(store.list).toHaveLength(1);
    });

    it('should update insight', () => {
      const newInsight = { ...mockedInsight, comment: 'New comment' };
      store.addInsight(mockedInsight);
      expect(store.list[0]).toEqual(mockedInsight);
      store.update({ type: InsightsEventTypes.INSIGHT_UPDATED, payload: newInsight });
      expect(store.list[0]).toEqual(newInsight);
    });

    it('should delete insight', () => {
      store.addInsight(mockedInsight);
      expect(store.list).toHaveLength(1);
      store.update({ type: InsightsEventTypes.INSIGHT_DELETED, payload: mockedInsight.id });
      expect(store.list).toHaveLength(0);
    });

    it('should reload insights for full mode', async () => {
      store = new InsightsStoreImpl(
        { insights: mockedInsightsApi, authors: mockedAuthorsApi, records: mockedRecordsApi },
        { global: mockedGlobalStore },
        'full'
      );

      await store.loadData(assetId, filters);
      await store.update({ type: InsightsEventTypes.INSIGHT_CREATED, payload: mockedInsight });
      expect(mockedInsightsApi.getForRange).toHaveBeenCalledWith(assetId, filters);
      expect(mockedInsightsApi.getForRange).toHaveBeenCalledTimes(2);
      expect(mockedAuthorsApi.getAuthorById).toHaveBeenCalledTimes(4);
    });
  });

  describe('loadData method', () => {
    const createFullModeStore = (insightApi: InsightsApi) => {
      return new InsightsStoreImpl(
        { insights: insightApi, authors: mockedAuthorsApi, records: mockedRecordsApi },
        { global: mockedGlobalStore },
        'full'
      );
    };

    it('should load insights without authors for preview mode', async () => {
      expect(store.list).toHaveLength(0);
      await store.loadData(assetId, filters);
      expect(store.list).toHaveLength(2);
      expect(mockedInsightsApi.getForRange).toHaveBeenCalledWith(assetId, filters);
      expect(mockedAuthorsApi.getAuthorById).not.toBeCalled();
    });

    it('should load insights with authors for full mode', async () => {
      store = createFullModeStore(mockedInsightsApi);

      expect(store.list).toHaveLength(0);
      await store.loadData(assetId, filters);
      expect(store.list).toHaveLength(2);
      expect(mockedInsightsApi.getForRange).toHaveBeenCalledWith(assetId, filters);
      expect(mockedAuthorsApi.getAuthorById).toHaveBeenCalledTimes(2);
    });

    it('should load insights with files for full mode', async () => {
      const newMockedInsightsApi = {
        ...mockedInsightsApi,
        getForRange: jest
          .fn()
          .mockImplementation(() =>
            Promise.resolve([mockedInsight, { ...mockedInsight, filesIds: [] }])
          ),
      };
      store = createFullModeStore(newMockedInsightsApi);

      expect(store.list).toHaveLength(0);
      await store.loadData(assetId, filters);
      expect(store.list).toHaveLength(2);
      expect(newMockedInsightsApi.getForRange).toHaveBeenCalledWith(assetId, filters);
      expect(mockedRecordsApi.getByIds).toHaveBeenCalledTimes(1);
    });
  });

  it('should detach listener', () => {
    store.onDestroy();
    expect(insightsEventListener.detach).toBeCalledWith(store);
  });

  it('should reset store', () => {
    store.reset();
    expect(store.list).toHaveLength(0);
  });
});
