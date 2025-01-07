import { mockedInsight } from '@/mocks/insight';

import {
  insightsEventListener,
  InsightsEventListener,
  InsightsEventTypes,
  InsightsObserver,
} from '../insights-events-listener';

describe('InsightsEventListener', () => {
  let instance: InsightsEventListener;
  let observer: InsightsObserver;

  beforeEach(() => {
    instance = insightsEventListener;
    observer = {
      update: jest.fn(),
    };
  });

  it('should be a singleton', () => {
    const instance2 = InsightsEventListener.getInstance();
    expect(instance).toBe(instance2);
  });

  it('should notify observers', () => {
    instance.attach(observer);
    instance.notify({ type: InsightsEventTypes.INSIGHT_CREATED, payload: mockedInsight });
    expect(observer.update).toBeCalled();
  });

  it('should not notify detached observers', () => {
    instance.attach(observer);
    instance.detach(observer);
    instance.notify({ type: InsightsEventTypes.INSIGHT_UPDATED, payload: mockedInsight });
    expect(observer.update).not.toBeCalled();
  });

  it('should not notify if there are no observers', () => {
    instance.notify({ type: InsightsEventTypes.INSIGHT_UPDATED, payload: mockedInsight });
    expect(observer.update).not.toBeCalled();
  });

  it('should not add existing observers', () => {
    instance.attach(observer);
    instance.attach(observer);
    instance.notify({ type: InsightsEventTypes.INSIGHT_UPDATED, payload: mockedInsight });
    expect(observer.update).toBeCalledTimes(1);
  });
});
