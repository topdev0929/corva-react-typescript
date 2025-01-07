import { Insight } from '@/entities/insight';

import { Observer, Subject } from './event-listener';

export enum InsightsEventTypes {
  INSIGHT_CREATED,
  INSIGHT_UPDATED,
  INSIGHT_DELETED,
}

type CreateInsightEvent = {
  type: InsightsEventTypes.INSIGHT_CREATED;
  payload: Insight;
};

type UpdateInsightEvent = {
  type: InsightsEventTypes.INSIGHT_UPDATED;
  payload: Insight;
};

type DeleteInsightEvent = {
  type: InsightsEventTypes.INSIGHT_DELETED;
  payload: string;
};

export type InsightsEvent = CreateInsightEvent | UpdateInsightEvent | DeleteInsightEvent;

export interface InsightsObserver extends Observer {
  update(event: InsightsEvent): void;
}

export class InsightsEventListener implements Subject {
  #observers: Observer[] = [];
  static #instance: InsightsEventListener;

  // eslint-disable-next-line no-useless-constructor,@typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): InsightsEventListener {
    if (!InsightsEventListener.#instance) {
      InsightsEventListener.#instance = new InsightsEventListener();
    }
    return InsightsEventListener.#instance;
  }

  public attach(observer: Observer): void {
    const isExist = this.#observers.includes(observer);
    if (!isExist) {
      this.#observers.push(observer);
    }
  }

  public detach(observer: Observer): void {
    const observerIndex = this.#observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.#observers.splice(observerIndex, 1);
    }
  }

  public notify(event: InsightsEvent): void {
    this.#observers.forEach(observer => observer.update(event));
  }
}

export const insightsEventListener = InsightsEventListener.getInstance();
