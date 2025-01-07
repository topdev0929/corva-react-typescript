// eslint-disable
import { corvaDataAPI } from '@corva/ui/clients';
import { getS3DownloadLink, getS3SignedUrl } from '@corva/ui/clients/jsonApi';

import { Record } from '@/entities/record';
import { API_CONFIG } from '@/constants';

import { recordsApi, RecordsApiImpl } from '../index';

let open;
let send;
let onload;

function createXHRMock() {
  open = jest.fn();
  // eslint-disable-next-line func-names
  send = jest.fn().mockImplementation(function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onload = this.onload.bind(this);
  });

  const xhrMockClass = () => {
    return {
      open,
      send,
      setRequestHeader: jest.fn(),
      status: 200,
    };
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}
jest.mock('@corva/ui/clients');
jest.mock('@corva/ui/clients/jsonApi');
jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('InsightsApi', () => {
  let recordObj: any;
  let record: Record;

  beforeEach(() => {
    recordObj = {
      _id: '1',
      data: {
        datetime: '2019-01-01T00:00:00.000Z',
        is_folder: false,
        display_name: 'name',
        file_name: 'ref',
      },
    };
    record = {
      id: '1',
      datetime: '2019-01-01T00:00:00.000Z',
      name: 'name',
      ref: 'ref',
    };

    recordsApi.resetCache();
    jest.resetAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.get.mockImplementation(() => Promise.resolve([recordObj, recordObj]));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.put.mockImplementation(() => Promise.resolve(recordObj));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    corvaDataAPI.del.mockImplementation(() => Promise.resolve());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getS3DownloadLink.mockImplementation(() => Promise.resolve({ url: 'url' }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getS3SignedUrl.mockImplementation(() =>
      Promise.resolve({
        signed_url: 'signed_url',
        file_name: 'file_name',
        display_name: 'display_name',
      })
    );
  });

  it('should be a singleton', () => {
    expect(recordsApi).toBe(RecordsApiImpl.getInstance());
  });

  describe('getRecords', () => {
    let ids: string[];
    let assetId: number;

    beforeEach(() => {
      ids = ['1', '2'];
      assetId = 1;

      recordsApi.resetCache();
    });

    it('should fetch records by ids', async () => {
      const records = await recordsApi.getByIds(assetId, ids);
      expect(records).toEqual([record, record]);
      expect(corvaDataAPI.get).toBeCalledWith('/api/v1/data/corva/data.insights.files/', {
        query: JSON.stringify({
          asset_id: assetId,
          _id: { $in: ids },
        }),
        sort: JSON.stringify({ timestamp: -1 }),
        limit: API_CONFIG.DEFAULT_LIMIT,
      });
    });

    it('should get records by ids from cache', async () => {
      await recordsApi.getByIds(assetId, ids);
      await recordsApi.getByIds(assetId, ids);
      expect(corvaDataAPI.get).toBeCalledTimes(1);
    });
  });

  it('should create record', async () => {
    const companyId = 1;
    const assetId = 1;
    const result = await recordsApi.create(record, 1, 1);
    expect(result).toEqual(record);
    expect(corvaDataAPI.put).toBeCalledWith(
      '/api/v1/data/corva/data.insights.files/',
      {
        version: 1,
        company_id: companyId,
        asset_id: assetId,
        provider: API_CONFIG.PROVIDER,
        collection: 'data.insights.files',
        timestamp: 1577836800,
        data: recordObj.data,
      },
      {}
    );
  });

  it('should delete record', async () => {
    const id = '1';
    await recordsApi.delete(id);
    expect(corvaDataAPI.del).toBeCalledWith(`/api/v1/data/corva/data.insights.files/${id}/`, {});
  });

  it('should get download link', async () => {
    const ref = 'ref';
    const result = await recordsApi.getFileLink(ref);
    expect(result).toEqual('url');
    expect(getS3DownloadLink).toBeCalledWith(ref);
  });

  it('should get download link from cache', async () => {
    const ref = 'ref';
    await recordsApi.getFileLink(ref);
    await recordsApi.getFileLink(ref);
    expect(getS3DownloadLink).toBeCalledTimes(1);
  });

  describe('uploadFile', () => {
    it('should upload file', async () => {
      createXHRMock();
      const file = new File([''], 'file');
      const promise = recordsApi.uploadFile(file);

      setTimeout(async () => {
        expect(open).toBeCalledWith('GET', 'signed_url');
        expect(send).toBeCalledWith(file);

        onload();

        const result = await promise;
        expect(result).toEqual({
          ref: 'file_name',
          name: 'display_name',
        });
        expect(getS3SignedUrl).toBeCalledWith(file.name, file.type);
      });
    });
  });
});
