import { Record, RecordPayload } from '@/entities/record';

export const API_PATH = '/api/v1/data';
export const USER_API_PATH = '/v2';
const MS_IN_SEC = 1000;

export const API_CONFIG = {
  INSIGHTS_DATASET: 'data.insights.events',
  RECORDS_DATASET: 'data.insights.files',
  PROVIDER: 'corva',
  DEFAULT_LIMIT: 10000,
};

export const SUPPORTED_FILE_MIME_TYPES = [
  'text/csv',
  'text/plain',
  'text/xml',
  'application/json',
  'application/xml',
  'application/pdf',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/bmp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getRequestCommonData(companyId: number, dataset: string, assetId?: number) {
  return {
    version: 1,
    company_id: companyId,
    asset_id: assetId,
    provider: API_CONFIG.PROVIDER,
    collection: dataset,
  };
}

export const getSecTimestamp = (): number => {
  return Math.floor(Date.now() / MS_IN_SEC);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function parseRecordFromJSON(obj: any): Record {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: obj._id,
    datetime: obj.data.datetime,
    name: obj.data.display_name,
    ref: obj.data.file_name,
  };
}

export function convertRecordToJSON(record: RecordPayload): any {
  return {
    datetime: record.datetime,
    display_name: record.name,
    is_folder: false,
    file_name: record.ref,
  };
}

export function parseRecordsFromJSON(list: any[]): Record[] {
  return list.map(item => parseRecordFromJSON(item));
}
