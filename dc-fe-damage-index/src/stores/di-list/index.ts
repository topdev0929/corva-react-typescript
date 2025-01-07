import { action, computed, makeObservable, observable, runInAction } from 'mobx';

import {
  DamageIndex,
  generateDIChanges,
  getCurrentDIFromList,
  sortDIByTime,
} from '@/entities/damage-index';
import { AssetId } from '@/entities/asset';
import { DatasetSubscription } from '@/services/dataset-subscription';

import { DIChange, IDIListStore, IDIRepository } from './types';

export * from './types';

export class DIListStore implements IDIListStore {
  private readonly repository: IDIRepository;
  private readonly datasetSubscription: DatasetSubscription<DamageIndex[]>;
  diList: DamageIndex[] = [];
  currentDI: DamageIndex | null = null;
  isCurrentLoading = true;
  isListLoading = true;

  constructor(repository: IDIRepository) {
    this.repository = repository;
    this.datasetSubscription = new DatasetSubscription(repository);
    makeObservable(this, {
      diList: observable,
      currentDI: observable,
      isListLoading: observable,
      isCurrentLoading: observable,
      diChanges: computed,
      setCurrentDI: action,
      setDIList: action,
      startCurrentLoading: action,
      finishCurrentLoading: action,
      startListLoading: action,
      finishListLoading: action,
    });
  }

  get diChanges(): DIChange[] {
    return generateDIChanges(this.currentDI, this.diList);
  }

  setCurrentDI(di: DamageIndex | null) {
    this.currentDI = di;
  }

  setDIList(diList: DamageIndex[]) {
    this.diList = diList;
  }

  startCurrentLoading() {
    this.isCurrentLoading = true;
  }

  finishCurrentLoading() {
    this.isCurrentLoading = false;
  }

  startListLoading() {
    this.isListLoading = true;
  }

  finishListLoading() {
    this.isListLoading = false;
  }

  loadData(assetId: AssetId): void {
    this.loadCurrentDI(assetId);
    this.loadDIList(assetId);
  }

  onUnmount(): void {
    this.datasetSubscription.clear();
  }

  private addSubscription(assetId: AssetId): void {
    this.datasetSubscription.add({
      assetId,
      onDataUpdate: records => {
        const sortedRecords = sortDIByTime(records);
        runInAction(() => {
          this.setCurrentDI(getCurrentDIFromList(sortedRecords));
          if (!this.isListLoading) {
            this.setDIList(sortedRecords.concat(this.diList));
          }
        });
      },
    });
  }

  async loadCurrentDI(assetId: AssetId): Promise<void> {
    this.startCurrentLoading();
    try {
      const currentDI = await this.repository.getLast(assetId);
      this.setCurrentDI(currentDI);
    } catch {
      this.setCurrentDI(null);
    }
    this.finishCurrentLoading();
    this.datasetSubscription.clear();
    this.addSubscription(assetId);
  }

  async loadDIList(assetId: AssetId): Promise<void> {
    this.startListLoading();
    try {
      const diList = await this.repository.getAll(assetId);
      this.setDIList(diList);
    } catch {
      this.setDIList([]);
    }
    this.finishListLoading();
  }
}
