import { corvaDataAPI } from '@corva/ui/clients';
import { v4 as uuidv4 } from 'uuid';

import { CommentPayload, Insight, InsightComment, InsightPayload } from '@/entities/insight';
import { AssetId } from '@/entities/asset';
import { splitDateRangeInTwoByYears, getSecTimestamp, isSameYear } from '@/shared/utils';
import { API_CONFIG, API_PATH } from '@/constants';

import { convertInsightToJSON, parseInsightFromJson, parseInsightsFromJson } from './parser';
import { getDatetimeQuery, getParams, getRequestCommonData } from '../params';

export interface InsightsApi {
  getForRange(assetId: AssetId, { range, types }): Promise<Insight[]>;
  create(payload: InsightPayload, companyId: number, assetId: AssetId): Promise<Insight>;
  update(insightId: string, payload: InsightPayload, companyId: number): Promise<Insight>;
  delete(id: string): Promise<void>;
  addComment(insight: Insight, commentPayload: CommentPayload, companyId: number): Promise<Insight>;
  updateComment(insight: Insight, comment: InsightComment, companyId: number): Promise<Insight>;
  deleteComment(insight: Insight, commentId: string, companyId: number): Promise<Insight>;
}

export class InsightsApiImpl implements InsightsApi {
  private static instance: InsightsApi;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): InsightsApi {
    if (!InsightsApiImpl.instance) InsightsApiImpl.instance = new InsightsApiImpl();
    return InsightsApiImpl.instance;
  }

  async getForRange(assetId: AssetId, { range, types }): Promise<Insight[]> {
    // API returns empty list for range with limits in different years,
    // so we need to split range in two parts and make two requests
    if (!isSameYear(range.start, range.end)) {
      return this.#getForRangeInDifferentYears(assetId, { range, types });
    }

    const query = {
      ...getDatetimeQuery(range),
      'data.event_type': { $in: types },
    };
    const params = getParams(assetId, query);
    const response = await corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.INSIGHTS_DATASET}/`,
      params
    );
    return parseInsightsFromJson(response);
  }

  async create(payload: InsightPayload, companyId: number, assetId: AssetId): Promise<Insight> {
    const response = await corvaDataAPI.put(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.INSIGHTS_DATASET}/`,
      {
        ...getRequestCommonData(companyId, API_CONFIG.INSIGHTS_DATASET, assetId),
        timestamp: getSecTimestamp(),
        data: convertInsightToJSON(payload),
      },
      {}
    );
    return parseInsightFromJson(response);
  }

  async update(insightId: string, payload: InsightPayload, companyId: number): Promise<Insight> {
    const response = await corvaDataAPI.patch(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.INSIGHTS_DATASET}/${insightId}/`,
      {
        ...getRequestCommonData(companyId, API_CONFIG.INSIGHTS_DATASET),
        data: convertInsightToJSON(payload),
      },
      {}
    );
    return parseInsightFromJson(response);
  }

  async addComment(
    insight: Insight,
    commentPayload: CommentPayload,
    companyId: number
  ): Promise<Insight> {
    const comment = { ...commentPayload, timestamp: getSecTimestamp(), id: uuidv4() };
    const payload = { ...insight, otherComments: [...insight.otherComments, comment] };
    return this.update(insight.id, payload, companyId);
  }

  async updateComment(
    insight: Insight,
    comment: InsightComment,
    companyId: number
  ): Promise<Insight> {
    const payload = {
      ...insight,
      otherComments: [
        ...insight.otherComments.map(item => (item.id === comment.id ? comment : item)),
      ],
    };
    return this.update(insight.id, payload, companyId);
  }

  async deleteComment(insight: Insight, commentId: string, companyId: number): Promise<Insight> {
    const payload = {
      ...insight,
      otherComments: [...insight.otherComments.filter(item => item.id !== commentId)],
    };
    return this.update(insight.id, payload, companyId);
  }

  async delete(insightId: string): Promise<void> {
    await corvaDataAPI.del(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.INSIGHTS_DATASET}/${insightId}/`,
      {}
    );
  }

  async #getForRangeInDifferentYears(assetId: AssetId, { range, types }): Promise<Insight[]> {
    let insights: Insight[] = [];
    const ranges = splitDateRangeInTwoByYears(range);
    await Promise.all(
      ranges.map(async range => {
        const list = await this.getForRange(assetId, { range, types });
        insights = [...insights, ...list];
      })
    );
    return insights;
  }
}

export const insightsApi = InsightsApiImpl.getInstance();
