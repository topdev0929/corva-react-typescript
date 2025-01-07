import { getS3SignedUrl, getS3DownloadLink } from '@corva/ui/clients/jsonApi';
import { corvaDataAPI } from '@corva/ui/clients';

import { Record, RecordPayload } from '@/entities/record';
import {
  API_CONFIG,
  API_PATH,
  getRequestCommonData,
  getSecTimestamp,
  convertRecordToJSON,
  parseRecordFromJSON,
} from '@/constants/file.const';

export const create = async (
  record: RecordPayload,
  companyId: number,
  assetId: number
): Promise<Record> => {
  try {
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
  } catch (error) {
    throw new Error(`Failed to create record: ${error}`);
  }
};

export const uploadingFile = async (file: File): Promise<Pick<RecordPayload, 'ref' | 'name'>> => {
  const { name, type } = file;
  const s3Data = await getS3SignedUrl(name, type); // Assuming this function returns an object with properties 'signed_url', 'file_name', and 'display_name'

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
        reject(new Error(`File upload failed with status: ${request.status}`)); // Reject with an error object
      }
    };

    request.onerror = () => {
      reject(new Error('File upload failed due to network error')); // Reject with an error object
    };

    request.send(file);
  });
};

export const getFileLink = async (ref: string): Promise<string> => {
  const { url } = await getS3DownloadLink(ref);
  return url;
};

export const getPhotoLink = async (record: Record): Promise<string> => {
  return getFileLink(record.ref).catch(() => '');
};

export const deleteFile = async (id: Record['id']): Promise<string> => {
  return corvaDataAPI.del(
    `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.RECORDS_DATASET}/${id}/`,
    {}
  );
};
