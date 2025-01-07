import { action, makeObservable, observable, runInAction, computed } from 'mobx';

import {
  FitInParameters,
  OptimizationParameters,
  getLastOptimizationParameters,
  sortParametersByTime,
  generateFitInParameters,
} from '@/entities/optimization-parameter';
import { AssetId } from '@/entities/asset';
import { DatasetSubscription } from '@/services/dataset-subscription';

import { IDIListStore } from '../di-list';
import { IOPStore, IOPRepository, VIEW_TYPES } from './types';

export * from './types';

export class OPStore implements IOPStore {
  private readonly repository: IOPRepository;
  private readonly datasetSubscription: DatasetSubscription<OptimizationParameters[]>;
  private readonly diStore: IDIListStore;
  parameters: OptimizationParameters | null = null;
  isOPLoading = true;
  viewType: VIEW_TYPES = VIEW_TYPES.CHART;

  constructor(repository: IOPRepository, diStore: IDIListStore) {
    this.repository = repository;
    this.diStore = diStore;
    this.datasetSubscription = new DatasetSubscription(repository);
    makeObservable(this, {
      parameters: observable,
      isOPLoading: observable,
      viewType: observable,
      isLoading: computed,
      fitInDIParametersList: computed,
      fitInROPParametersList: computed,
      isEmpty: computed,
      setChartView: action,
      setTableView: action,
      loadOP: action,
    });
  }

  get fitInDIParametersList(): FitInParameters[] {
    return generateFitInParameters(this.parameters, this.diStore.currentDI, 'DI');
  }

  get fitInROPParametersList(): FitInParameters[] {
    return generateFitInParameters(this.parameters, this.diStore.currentDI, 'ROP');
  }

  get isLoading(): boolean {
    return this.diStore.isCurrentLoading || this.isOPLoading;
  }

  get isEmpty(): boolean {
    return !this.diStore.currentDI || !this.parameters;
  }

  setChartView() {
    this.viewType = VIEW_TYPES.CHART;
  }

  setTableView() {
    this.viewType = VIEW_TYPES.TABLE;
  }

  async loadOP(assetId: AssetId): Promise<void> {
    this.isOPLoading = true;
    try {
      // this.parameters = await this.repository.getLast(assetId);
      this.parameters = null;
    } catch {
      this.parameters = null;
    }
    this.isOPLoading = false;
    this.datasetSubscription.clear();
    this.addSubscription(assetId);
  }

  onUnmount(): void {
    this.datasetSubscription.clear();
  }

  private addSubscription(assetId: AssetId): void {
    this.datasetSubscription.add({
      assetId,
      onDataUpdate: records => {
        const sortedRecords = sortParametersByTime(records);
        runInAction(() => {
          // this.parameters = getLastOptimizationParameters(sortedRecords);
          this.parameters = null;
        });
      },
    });
  }
}
