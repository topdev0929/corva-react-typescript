import { InsightsApi } from '@/api/insights';
import { mockedInsight } from '@/mocks/insight';

export const mockedInsightsApi: InsightsApi = {
  getForRange: jest.fn().mockImplementation(() => Promise.resolve([mockedInsight, mockedInsight])),
  create: jest.fn().mockImplementation(() => Promise.resolve(mockedInsight)),
  update: jest.fn().mockImplementation(() => Promise.resolve(mockedInsight)),
  delete: jest.fn().mockImplementation(() => Promise.resolve()),
  addComment: jest.fn().mockImplementation(() => Promise.resolve(mockedInsight)),
  updateComment: jest.fn().mockImplementation(() => Promise.resolve(mockedInsight)),
  deleteComment: jest.fn().mockImplementation(() => Promise.resolve(mockedInsight)),
};
