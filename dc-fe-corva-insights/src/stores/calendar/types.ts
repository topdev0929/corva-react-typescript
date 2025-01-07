import { InsightsPerDay } from '@/entities/insight';

import { InsightsStore } from '../insights';

export type APIDependencies = undefined;
export type StoresDependencies = {
  insights: InsightsStore;
};

export interface CalendarStore {
  selectedMonth: Date;
  insightsPerDay: InsightsPerDay;
  setMonth: (date: Date) => void;
  setNextMonth: () => void;
  setPreviousMonth: () => void;
}
