import { FiltersStore } from '@/stores/filters';
import { INSIGHT_TYPE } from '@/entities/insight';

const startDate = new Date('2022-01-01');
const endDate = new Date('2022-01-03');

export const mockedFiltersStore: FiltersStore = {
  types: [INSIGHT_TYPE.OBSERVATION],
  selectedDay: new Date('2022-01-01'),
  startDate,
  endDate,
  range: { start: startDate, end: endDate },
  filtersAmount: 2,
  typeOptions: [{ value: INSIGHT_TYPE.OBSERVATION, label: 'Observation' }],
  resetRange: jest.fn(),
  setStartDate: jest.fn(),
  setEndDate: jest.fn(),
  setTypes: jest.fn(),
  setSelectedDay: jest.fn(),
  resetFilters: jest.fn(),
};
