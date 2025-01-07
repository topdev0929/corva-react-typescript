import { INSIGHT_TYPE } from '@/entities/insight';

import { FiltersStoreImpl } from '../index';

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));
jest.mock('../../../entities/insight', () => {
  const originalModule = jest.requireActual('../../../entities/insight');
  return {
    __esModule: true,
    ...originalModule,
    getAllTypes: jest.fn().mockReturnValue(['type1', 'type2']),
    getInsightTypeOptions: jest.fn().mockReturnValue([{ value: 'insight', label: 'label' }]),
  };
});

describe('FiltersStore', () => {
  let store: FiltersStoreImpl;

  beforeEach(() => {
    store = new FiltersStoreImpl();
  });

  it('should be defined', () => {
    expect(store).toBeDefined();
    expect(store.selectedDay).toEqual(new Date('2022-01-01'));
    expect(store.typeOptions).toEqual([{ value: 'insight', label: 'label' }]);
    expect(store.types).toEqual(['type1', 'type2']);
  });

  it('should return null range', () => {
    store.resetRange();
    expect(store.range).toBeNull();
  });

  it('should return range', () => {
    store.setStartDate(new Date('2021-01-01'));
    store.setEndDate(new Date('2021-01-01'));
    expect(store.range).toEqual({
      start: new Date('2021-01-01T00:00:00.000Z'),
      end: new Date('2021-01-01T23:59:59.000Z'),
    });
  });

  it('should reset range', () => {
    store.setStartDate(new Date('2021-01-01'));
    store.setEndDate(new Date('2021-01-01'));
    store.resetRange();
    expect(store.startDate).toBeNull();
    expect(store.endDate).toBeNull();
  });

  it('should set types', () => {
    store.setTypes([INSIGHT_TYPE.ACTIVITY]);
    expect(store.types).toEqual([INSIGHT_TYPE.ACTIVITY]);
  });

  it('should set selected day', () => {
    store.setSelectedDay(new Date('2021-01-01'));
    expect(store.selectedDay).toEqual(new Date('2021-01-01'));
  });

  it('should reset filters', () => {
    store.setStartDate(new Date('2021-01-01'));
    store.setEndDate(new Date('2021-01-01'));
    store.setTypes([INSIGHT_TYPE.ACTIVITY]);
    store.resetFilters();
    expect(store.startDate).toBeNull();
    expect(store.endDate).toBeNull();
    expect(store.types).toEqual(['type1', 'type2']);
  });

  describe('filtersAmount', () => {
    it('should return 0', () => {
      expect(store.filtersAmount).toEqual(0);
    });

    it('should return 1', () => {
      store.setStartDate(new Date('2021-01-01'));
      expect(store.filtersAmount).toEqual(1);
    });

    it('should return 2', () => {
      store.setStartDate(new Date('2021-01-01'));
      store.setEndDate(new Date('2021-01-01'));
      expect(store.filtersAmount).toEqual(2);
    });

    it('should return 3', () => {
      store.setStartDate(new Date('2021-01-01'));
      store.setEndDate(new Date('2021-01-01'));
      store.setTypes([INSIGHT_TYPE.ACTIVITY]);
      expect(store.filtersAmount).toEqual(3);
    });
  });

  describe('setStartDate', () => {
    beforeEach(() => {
      store.resetRange();
    });

    it('should set start date', () => {
      store.setStartDate(new Date('2021-01-01'));
      expect(store.startDate).toEqual(new Date('2021-01-01T00:00:00.000Z'));
    });

    it('should not set start date', () => {
      store.setEndDate(new Date('2020-01-01'));
      store.setStartDate(new Date('2021-01-01'));
      expect(store.startDate).toBeNull();
    });
  });

  describe('setEndDate', () => {
    beforeEach(() => {
      store.resetRange();
    });

    it('should set end date', () => {
      store.setEndDate(new Date('2021-01-01'));
      expect(store.endDate).toEqual(new Date('2021-01-01T23:59:59.000Z'));
    });

    it('should not set end date', () => {
      store.setStartDate(new Date('2022-01-01'));
      store.setEndDate(new Date('2021-01-01'));
      expect(store.endDate).toBeNull();
    });
  });
});
