import { mockedInsightsStore } from '@/mocks/stores/insights-store';
import { groupInsightsByDay } from '@/entities/insight';
import { getDaysForCalendarMonth } from '@/shared/utils';

import { CalendarStoreImpl } from '../index';

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
jest.mock('../../../entities/insight', () => {
  const originalModule = jest.requireActual('../../../entities/insight');
  return {
    __esModule: true,
    ...originalModule,
    groupInsightsByDay: jest.fn().mockReturnValue(
      new Map([
        [new Date('2022-01-01'), [{ list: [], commentsNumber: 0 }]],
        [new Date('2022-01-02'), [{ list: [], commentsNumber: 1 }]],
        [new Date('2022-01-03'), [{ list: [], commentsNumber: 1 }]],
      ])
    ),
  };
});
jest.mock('../../../shared/utils', () => {
  const originalModule = jest.requireActual('../../../shared/utils');
  return {
    __esModule: true,
    ...originalModule,
    getDaysForCalendarMonth: jest
      .fn()
      .mockReturnValue([new Date('2022-01-01'), new Date('2022-01-02'), new Date('2022-01-03')]),
  };
});

describe('CalendarStore', () => {
  let store: CalendarStoreImpl;

  beforeEach(() => {
    store = new CalendarStoreImpl(undefined, { insights: mockedInsightsStore });
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(store.selectedMonth).toEqual(new Date('2022-01-01'));
  });

  it('should return insights per day', () => {
    expect(store.insightsPerDay.size).toEqual(3);
    expect(getDaysForCalendarMonth).toHaveBeenCalledWith(store.selectedMonth);
    expect(groupInsightsByDay).toHaveBeenCalledWith(mockedInsightsStore.list, [
      new Date('2022-01-01'),
      new Date('2022-01-02'),
      new Date('2022-01-03'),
    ]);
  });

  it('should set next month', () => {
    store.setNextMonth();
    expect(store.selectedMonth).toEqual(new Date('2022-02-01'));
  });

  it('should set previous month', () => {
    store.setPreviousMonth();
    expect(store.selectedMonth).toEqual(new Date('2021-12-01'));
  });
});
