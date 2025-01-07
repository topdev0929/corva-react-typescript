import { RecordsApi } from '@/api/records';
import { mockedRecord } from '@/mocks/record';

export const mockedRecordsApi: RecordsApi = {
  getByIds: jest.fn().mockImplementation(() => Promise.resolve([mockedRecord, mockedRecord])),
  create: jest.fn().mockImplementation(() => Promise.resolve(mockedRecord)),
  delete: jest.fn().mockImplementation(() => Promise.resolve()),
  uploadFile: jest.fn().mockImplementation(() => Promise.resolve({ ref: 'ref', name: 'name' })),
  getFileLink: jest.fn().mockImplementation(() => Promise.resolve({ url: 'url' })),
  resetCache: jest.fn(),
};
