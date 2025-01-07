import { AssetId } from '@/entities/asset';

export type SubscribeConfig<Data> = {
  assetId: AssetId;
  onDataUpdate: (data: Data) => void;
};

export interface SubscriptionRepository<Data> {
  subscribe: (config: SubscribeConfig<Data>) => () => void;
}

export class DatasetSubscription<Data> {
  private readonly repository: SubscriptionRepository<Data>;
  private unsubscribes: Map<number, () => void> = new Map();

  constructor(repository: SubscriptionRepository<Data>) {
    this.repository = repository;
  }

  getSubscribedAssets(): number[] {
    return Array.from(this.unsubscribes.keys());
  }

  clear(): void {
    Array.from(this.unsubscribes.values()).forEach(unsubscribe => unsubscribe());
    this.unsubscribes.clear();
  }

  add(config: SubscribeConfig<Data>): void {
    if (this.unsubscribes.has(config.assetId)) {
      return;
    }
    this.unsubscribes.set(config.assetId, this.repository.subscribe(config));
  }
}
