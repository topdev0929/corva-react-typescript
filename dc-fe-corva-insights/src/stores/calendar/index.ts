import { action, computed, makeObservable, observable } from 'mobx';

import { groupInsightsByDay, InsightsPerDay } from '@/entities/insight';
import { getDaysForCalendarMonth } from '@/shared/utils';

import { StoreWithDependencies } from '../store';
import { APIDependencies, CalendarStore, StoresDependencies } from './types';

export * from './types';

export class CalendarStoreImpl
  extends StoreWithDependencies<APIDependencies, StoresDependencies>
  implements CalendarStore
{
  @observable selectedMonth = new Date();

  constructor(api: APIDependencies, stores: StoresDependencies) {
    super(api, stores);
    makeObservable(this);
  }

  @computed
  get insightsPerDay(): InsightsPerDay {
    return groupInsightsByDay(
      this.stores.insights.list,
      getDaysForCalendarMonth(this.selectedMonth)
    );
  }

  @action
  setMonth(date: Date) {
    this.selectedMonth = date;
  }

  setNextMonth() {
    const nextMonth = this.selectedMonth.getMonth() + 1;
    this.setMonth(new Date(this.selectedMonth.getFullYear(), nextMonth));
  }

  setPreviousMonth() {
    const previousMonth = this.selectedMonth.getMonth() - 1;
    this.setMonth(new Date(this.selectedMonth.getFullYear(), previousMonth));
  }
}
