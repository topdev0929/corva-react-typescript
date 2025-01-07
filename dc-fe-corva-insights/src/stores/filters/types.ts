import { DateRange } from '@/shared/types';
import { INSIGHT_TYPE, InsightTypeOption } from '@/entities/insight';

export interface FiltersStore {
  types: INSIGHT_TYPE[];
  startDate: Date | null;
  endDate: Date | null;
  range: DateRange | null;
  selectedDay: Date;
  typeOptions: InsightTypeOption[];
  filtersAmount: number;
  resetRange: () => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setTypes: (types: INSIGHT_TYPE[]) => void;
  setSelectedDay: (dya: Date) => void;
  resetFilters: () => void;
}
