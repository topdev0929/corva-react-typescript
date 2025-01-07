import { corvaDataAPI } from '@corva/ui/clients';

import { getPhotoLink, deleteFile } from '@/entities/upload';
import { API_CONFIG, API_PATH } from '@/constants/file.const';

jest.mock('@corva/ui/clients/jsonApi', () => ({
  getS3SignedUrl: jest.fn(),
  getS3DownloadLink: jest.fn(),
}));

jest.mock('@corva/ui/clients', () => ({
  corvaDataAPI: {
    put: jest.fn(),
    del: jest.fn(),
  },
}));

describe('getPhotoLink', () => {
  it('returns photo link', async () => {
    const fileLinkMock = 'https://example.com/photo/photo123.jpg';
    expect(fileLinkMock).toEqual(fileLinkMock);
  });

  it('returns empty string when getFileLink fails', async () => {
    const recordMock = { ref: 'photo123.jpg', id: '', datetime: '', name: '' };

    const result = await getPhotoLink(recordMock);
    expect(result).toEqual('');
  });
});

describe('deleteFile', () => {
  it('deletes file', async () => {
    const fileId = 'file123';
    const result = await deleteFile(fileId);

    expect(result).toBe(undefined);
    expect(corvaDataAPI.del).toHaveBeenCalledWith(
      `${API_PATH}/${API_CONFIG.PROVIDER}/${API_CONFIG.RECORDS_DATASET}/${fileId}/`,
      {}
    );
  });

  it('throws an error when deleteFile fails', async () => {
    const fileId = 'file123';
    const result = await deleteFile(fileId);
    expect(result).toBe(undefined);
  });
});
