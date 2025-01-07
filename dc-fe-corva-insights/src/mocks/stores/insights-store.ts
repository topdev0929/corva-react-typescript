import { InsightsStore } from '@/stores/insights';

import { mockedInsight } from '../insight';

export const mockedInsightsStore: InsightsStore = {
  list: [mockedInsight, { ...mockedInsight, datetime: '2022-01-02' }],
  isLoading: false,
  isEmpty: false,
  loadData: jest.fn().mockImplementation(() => Promise.resolve()),
  reset: jest.fn(),
  update: jest.fn(),
  onDestroy: jest.fn(),
};
