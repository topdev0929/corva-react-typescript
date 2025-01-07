import { corvaDataAPI } from '@corva/ui/clients';

import { ACTIVITY_TYPE, Insight, INSIGHT_TYPE } from '@/entities/insight';
import { API_CONFIG } from '@/constants';

import { insightsApi, InsightsApiImpl } from '../index';
import { mockedInsightAuthor } from '@/mocks/insight';

jest.mock('@corva/ui/clients');
jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('InsightsApi', () => {
  let obj: any;
  let insight: Insight;
  let requestData: any;
  let types: string[];
  let filters: any;
  let companyId: number;
  let assetId: number;

  beforeEach(() => {
    companyId = 1;
    assetId = 1;
    obj = {
      _id: '1',
      timestamp: 1,
      data: {
        datetime: '2019-10-10T10:10:10.000Z',
        event_type: 'activity',
        author: mockedInsightAuthor,
        comment: 'Test Comment',
        activity_type: 'repair',
        files: ['1', '2'],
        other_comments: [
          { text: 'Test Comment', id: '1', timestamp: 1, author: mockedInsightAuthor },
        ],
      },
    };
    insight = {
      id: '1',
      timestamp: 1,
      datetime: '2019-10-10T10:10:10.000Z',
      type: INSIGHT_TYPE.ACTIVITY,
      author: mockedInsightAuthor,
      comment: 'Test Comment',
      activityType: ACTIVITY_TYPE.REPAIR,
      filesIds: ['1', '2'],
      otherComments: [{ text: 'Test Comment', id: '1', timestamp: 1, author: mockedInsightAuthor }],
      files: [],
    };
    requestData = {
      asset_id: undefined,
      collection: 'data.insights.events',
      company_id: 1,
      provider: 'corva',
      version: 1,
    };
    types = ['activity', 'site_visit'];
    filters = {
      types,
      range: { start: new Date('2020-01-01'), end: new Date('2020-01-02') },
    };

    jest.resetAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.get.mockImplementation(() => Promise.resolve([obj, obj]));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.put.mockImplementation(() => Promise.resolve(obj));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.patch.mockImplementation(() => Promise.resolve(obj));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.del.mockImplementation(() => Promise.resolve());
  });

  it('should be a singleton', () => {
    expect(insightsApi).toBe(InsightsApiImpl.getInstance());
  });

  it('should get insights with authors for range', async () => {
    const result = await insightsApi.getForRange(assetId, filters);
    expect(result).toEqual([insight, insight]);
    expect(corvaDataAPI.get).toBeCalledWith('/api/v1/data/corva/data.insights.events/', {
      query: JSON.stringify({
        asset_id: assetId,
        $or: [
          {
            'data.datetime': {
              $gte: '01/01/2020',
              $lte: '01/02/2020',
            },
          },
          {
            'data.datetime': {
              $regex: '01/02/2020',
            },
          },
        ],
        'data.event_type': { $in: types },
      }),
      sort: JSON.stringify({ timestamp: -1 }),
      limit: API_CONFIG.DEFAULT_LIMIT,
    });
  });

  it('should get insights with user ids for range', async () => {
    obj = { ...obj, data: { ...obj.data, author: undefined, user_id: 1 } };
    insight = { ...insight, author: { id: 1, firstName: '', lastName: '', profilePhoto: '' } };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.get.mockImplementation(() => Promise.resolve([obj, obj]));

    const result = await insightsApi.getForRange(assetId, filters);
    expect(result).toEqual([insight, insight]);
  });

  it('should get insights for range in different years', async () => {
    filters = {
      types,
      range: { start: new Date('2020-12-31'), end: new Date('2021-01-01') },
    };
    const result = await insightsApi.getForRange(assetId, filters);
    expect(result).toEqual([insight, insight, insight, insight]);
    expect(corvaDataAPI.get).toBeCalledTimes(2);
  });

  it('should create insight', async () => {
    const result = await insightsApi.create(insight, companyId, assetId);
    expect(result).toEqual(insight);
    expect(corvaDataAPI.put).toBeCalledWith(
      '/api/v1/data/corva/data.insights.events/',
      {
        ...requestData,
        asset_id: assetId,
        timestamp: 1577836800,
        data: obj.data,
      },
      {}
    );
  });

  it('should update insight', async () => {
    const id = 'id';
    const result = await insightsApi.update(id, insight, companyId);
    expect(result).toEqual(insight);
    expect(corvaDataAPI.patch).toBeCalledWith(
      '/api/v1/data/corva/data.insights.events/id/',
      { ...requestData, data: obj.data },
      {}
    );
  });

  it('should delete insight', async () => {
    const id = 'id';
    await insightsApi.delete(id);
    expect(corvaDataAPI.del).toBeCalledWith('/api/v1/data/corva/data.insights.events/id/', {});
  });

  it('should add comment', async () => {
    const newComments = [
      obj.data.other_comments[0],
      {
        ...obj.data.other_comments[0],
        id: expect.any(String),
        timestamp: 1577836800,
      },
    ];
    await insightsApi.addComment(insight, insight.otherComments[0], companyId);
    expect(corvaDataAPI.patch).toBeCalledWith(
      '/api/v1/data/corva/data.insights.events/1/',
      {
        ...requestData,
        data: {
          ...obj.data,
          other_comments: newComments,
        },
      },
      {}
    );
  });

  it('should update comment', async () => {
    const comment = {
      ...insight.otherComments[0],
      text: 'Updated comment',
    };
    await insightsApi.updateComment(insight, comment, companyId);
    expect(corvaDataAPI.patch).toBeCalledWith(
      '/api/v1/data/corva/data.insights.events/1/',
      {
        ...requestData,
        data: {
          ...obj.data,
          other_comments: [comment],
        },
      },
      {}
    );
  });

  it('should delete comment', async () => {
    const commentId = insight.otherComments[0].id;
    await insightsApi.deleteComment(insight, commentId, companyId);
    expect(corvaDataAPI.patch).toBeCalledWith(
      '/api/v1/data/corva/data.insights.events/1/',
      {
        ...requestData,
        data: {
          ...obj.data,
          other_comments: [],
        },
      },
      {}
    );
  });
});
