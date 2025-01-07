import {
  DatasetSubscription,
  SubscriptionRepository,
  SubscribeConfig,
} from '../dataset-subscription';

describe('DatasetSubscription', () => {
  let datasetSubscription: DatasetSubscription<unknown>;
  let repository: SubscriptionRepository<unknown>;
  let config: SubscribeConfig<unknown>;
  let mockUnsubscribe: jest.Mock;
  let mockSubscribe: jest.Mock;

  beforeEach(() => {
    mockUnsubscribe = jest.fn();
    mockSubscribe = jest.fn().mockReturnValue(mockUnsubscribe);

    config = { assetId: 1, onDataUpdate: () => null };
    repository = { subscribe: mockSubscribe };
    datasetSubscription = new DatasetSubscription<unknown>(repository);
  });

  it('should add a new subscription', () => {
    datasetSubscription.add(config);
    expect(mockSubscribe.mock.calls).toHaveLength(1);
    expect(datasetSubscription.getSubscribedAssets()).toContain(config.assetId);
  });

  it('should not add a duplicate subscription', () => {
    datasetSubscription.add(config);
    datasetSubscription.add(config);
    expect(mockSubscribe.mock.calls).toHaveLength(1);
    expect(datasetSubscription.getSubscribedAssets()).toContain(config.assetId);
    expect(datasetSubscription.getSubscribedAssets().length).toBe(1);
  });

  it('should clear all subscriptions', () => {
    datasetSubscription.add(config);
    datasetSubscription.clear();
    expect(mockUnsubscribe.mock.calls).toHaveLength(1);
    expect(datasetSubscription.getSubscribedAssets().length).toBe(0);
  });
});
