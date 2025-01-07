import { SubscriptionRepository } from '@/services/dataset-subscription';
import { DamageIndex } from '@/entities/damage-index';
import { AssetId } from '@/entities/asset';

export type DIChange = {
  label: string;
  unit: string;
  value: number;
};

export interface IDIRepository extends SubscriptionRepository<DamageIndex[]> {
  getAll: (assetId: AssetId) => Promise<DamageIndex[]>;
  getLast: (assetId: AssetId) => Promise<DamageIndex | null>;
}

export interface IDIListStore {
  diChanges: DIChange[];
  diList: DamageIndex[];
  currentDI: DamageIndex | null;
  isCurrentLoading: boolean;
  isListLoading: boolean;
  loadData: (assetId: AssetId) => void;
  onUnmount: () => void;
}
