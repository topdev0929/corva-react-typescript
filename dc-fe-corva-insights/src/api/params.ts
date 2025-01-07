import { AssetId } from '@/entities/asset';
import { DateRange } from '@/shared/types';
import { formatDate } from '@/shared/utils';
import { API_CONFIG } from '@/constants';

export type Params = {
  query: string;
  sort: string;
  limit: number;
};

export function getRequestCommonData(companyId: number, dataset: string, assetId?: AssetId) {
  return {
    version: 1,
    company_id: companyId,
    asset_id: assetId,
    provider: API_CONFIG.PROVIDER,
    collection: dataset,
  };
}

export function getParams(assetId: AssetId, query: Record<string, unknown>): Params {
  return {
    query: JSON.stringify({
      asset_id: assetId,
      ...query,
    }),
    sort: JSON.stringify({ timestamp: -1 }),
    limit: API_CONFIG.DEFAULT_LIMIT,
  };
}

export function getDateRangeQuery(range: DateRange) {
  return {
    'data.datetime': {
      $gte: formatDate(range.start, 'MM/DD/YYYY'),
      $lte: formatDate(range.end, 'MM/DD/YYYY'),
    },
  };
}

export function getDayQuery(date: Date) {
  return {
    'data.datetime': {
      $regex: formatDate(date, 'MM/DD/YYYY'),
    },
  };
}

export function getDatetimeQuery(range: DateRange) {
  return {
    $or: [getDateRangeQuery(range), getDayQuery(range.end)],
  };
}
