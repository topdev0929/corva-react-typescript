import { corvaDataAPI } from '@corva/ui/clients';
import { getS3SignedUrl, getS3DownloadLink } from '@corva/ui/clients/jsonApi';

import { Record, RecordPayload } from '@/entities/record';
import { AssetId } from '@/entities/asset';
import { getSecTimestamp } from '@/shared/utils';
import { API_CONFIG, API_PATH } from '@/constants';

import { convertRecordToJSON, parseRecordFromJSON, parseRecordsFromJSON } from './parser';
import { getParams, getRequestCommonData } from '../params';

export interface RecordsApi {
  getByIds(assetId: AssetId, ids: string[]): Promise<Record[]>;
  create(record: RecordPayload, companyId: number, assetId: AssetId): Promise<Record>;
  delete(id: Record['id']): Promise<void>;
  uploadFile(file: File): Promise<{ ref: string; name: string }>;
  getFileLink(ref: string): Promise<string>;
  resetCache(): void;
}

export class RecordsApiImpl implements RecordsApi {
  private static instance: RecordsApi;
  #linksCache: Map<string, string> = new Map();
  #recordsCache: Map<string, Record[]> = new Map();

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): RecordsApi {
    if (!RecordsApiImpl.instance) {
      RecordsApiImpl.instance = new RecordsApiImpl();
    }
    return RecordsApiImpl.instance;
  }

  resetCache(): void {
    this.#linksCache = new Map();
    this.#recordsCache = new Map();
  }

  async getByIds(assetId: AssetId, ids: string[]): Promise<Record[]> {
    const key = this.#createKeyFromIds(assetId, ids);
    const cachedRecords = this.#recordsCache.get(key);
    if (cachedRecords) return cachedRecords;

    const params = getParams(assetId, { _id: { $in: ids } });
    const response = await corvaDataAPI.get(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.RECORDS_DATASET}/`,
      params
    );

    const result = parseRecordsFromJSON(response);
    this.#recordsCache.set(key, result);
    return result;
  }

  async create(record: RecordPayload, companyId: number, assetId: AssetId): Promise<Record> {
    const response = await corvaDataAPI.put(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.RECORDS_DATASET}/`,
      {
        ...getRequestCommonData(companyId, API_CONFIG.RECORDS_DATASET, assetId),
        timestamp: getSecTimestamp(),
        data: convertRecordToJSON(record),
      },
      {}
    );
    return parseRecordFromJSON(response);
  }

  async delete(id: Record['id']) {
    return corvaDataAPI.del(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.RECORDS_DATASET}/${id}/`,
      {}
    );
  }

  async uploadFile(file: File): Promise<Pick<RecordPayload, 'ref' | 'name'>> {
    const { name, type } = file;
    const s3Data = await getS3SignedUrl(name, type);
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('PUT', s3Data.signed_url);
      const requestHeaders = { 'x-amz-acl': 'public-read' };
      Object.keys(requestHeaders).forEach(headerName => {
        request.setRequestHeader(headerName, requestHeaders[headerName]);
      });
      request.onload = () => {
        if (request.status === 200) {
          resolve({ ref: s3Data.file_name, name: s3Data.display_name });
        } else {
          reject(request.status);
        }
      };
      request.onerror = () => {
        reject(request.status);
      };
      request.send(file);
    });
  }

  async getFileLink(ref: string): Promise<string> {
    if (this.#linksCache.has(ref)) {
      return this.#linksCache.get(ref) || '';
    }
    const { url } = await getS3DownloadLink(ref);
    this.#linksCache.set(ref, url);
    return url;
  }

  #createKeyFromIds = (assetId: AssetId, ids: string[]) => `${assetId}-${ids.join('-')}`;
}

export const recordsApi = RecordsApiImpl.getInstance();
