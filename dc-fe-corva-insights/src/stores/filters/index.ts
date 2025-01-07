import { makeObservable, observable, action, computed } from 'mobx';
import { showWarningNotification } from '@corva/ui/utils';

import {
  getAllTypes,
  getInsightTypeOptions,
  INSIGHT_TYPE,
  InsightTypeOption,
} from '@/entities/insight';
import { DateRange } from '@/shared/types';

import { FiltersStore } from './types';
import { getEndOfDay, getStartOfDay } from '@/shared/utils';

export * from './types';

export class FiltersStoreImpl implements FiltersStore {
  @observable startDate: Date | null = null;
  @observable endDate: Date | null = null;
  @observable types: INSIGHT_TYPE[] = getAllTypes();
  @observable selectedDay: Date = new Date();
  typeOptions: InsightTypeOption[] = getInsightTypeOptions();

  constructor() {
    makeObservable(this);
  }

  @computed
  get range(): DateRange | null {
    if (!this.startDate || !this.endDate) return null;
    return { start: this.startDate, end: this.endDate };
  }

  @computed
  get filtersAmount(): number {
    let amount = 0;

    if (this.startDate) {
      amount += 1;
    }

    if (this.endDate) {
      amount += 1;
    }

    if (this.types.length !== getAllTypes().length) {
      amount += 1;
    }

    return amount;
  }

  @action
  setStartDate(date: Date | null) {
    if (!this.#checkDateRangePreCondition(date, this.endDate)) {
      return this.#notifyAboutDateRangeError();
    }
    this.startDate = date ? getStartOfDay(date) : null;
  }

  @action
  setEndDate(date: Date | null) {
    if (!this.#checkDateRangePreCondition(this.startDate, date)) {
      return this.#notifyAboutDateRangeError();
    }
    this.endDate = date ? getEndOfDay(date) : null;
  }

  @action
  setTypes(types: INSIGHT_TYPE[]) {
    this.types = types;
  }

  @action
  setSelectedDay(day: Date) {
    this.selectedDay = day;
  }

  resetRange() {
    this.setStartDate(null);
    this.setEndDate(null);
  }

  resetFilters() {
    this.resetRange();
    this.setTypes(getAllTypes());
  }

  #checkDateRangePreCondition(startDate: Date | null, endDate: Date | null): boolean {
    return !(startDate && endDate && startDate > endDate);
  }

  #notifyAboutDateRangeError() {
    showWarningNotification('Start date should be before end date');
  }
}
