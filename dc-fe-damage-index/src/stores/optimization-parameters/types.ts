import { SubscriptionRepository } from '@/services/dataset-subscription';
import { FitInParameters, OptimizationParameters } from '@/entities/optimization-parameter';
import { AssetId } from '@/entities/asset';

export interface IOPRepository extends SubscriptionRepository<OptimizationParameters[]> {
  getLast: (assetId: AssetId) => Promise<OptimizationParameters | null>;
}

export enum VIEW_TYPES {
  CHART,
  TABLE,
}

export interface IOPStore {
  fitInDIParametersList: FitInParameters[];
  fitInROPParametersList: FitInParameters[];
  viewType: VIEW_TYPES;
  isLoading: boolean;
  isEmpty: boolean;
  setChartView: () => void;
  setTableView: () => void;
  loadOP: (assetId: AssetId) => Promise<void>;
  onUnmount: () => void;
}
