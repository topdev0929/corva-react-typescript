import { action, makeObservable, observable, computed } from 'mobx';

import { Well, WellOption, toWellsOptions } from '@/entities/well';
import { AssetId } from '@/entities/asset';
import { BHA, BHAOption, sortBHAs, toBHAsOptions } from '@/entities/bha';

import { IFiltersStore, FiltersRepository } from './types';

export * from './types';

export class FiltersStore implements IFiltersStore {
  private readonly filtersRepository: FiltersRepository;
  wells: Well[] = [];
  bhas: BHA[] = [];
  selectedWellsId: AssetId[] = [];
  selectedBHAsId: string[] = [];
  isWellsLoading = true;
  isBHAsLoading = true;
  isWellsLoadingFailed = false;

  constructor(filtersRepository: FiltersRepository) {
    this.filtersRepository = filtersRepository;
    makeObservable(this, {
      wells: observable,
      bhas: observable,
      isWellsLoading: observable,
      isBHAsLoading: observable,
      isWellsLoadingFailed: observable,
      selectedWellsId: observable,
      selectedBHAsId: observable,
      wellsOptions: computed,
      bhasOptions: computed,
      selectedWells: computed,
      bhasToRemove: computed,
      setSelectedWellsId: action,
      setSelectedBHAsId: action,
      setWells: action,
      setBHAs: action,
      startWellsLoading: action,
      finishWellsLoading: action,
      startBHAsLoading: action,
      finishBHAsLoading: action,
      onWellsLoadingFailed: action,
    });
  }

  get wellsOptions(): WellOption[] {
    return toWellsOptions(this.wells);
  }

  get bhasOptions(): BHAOption[] {
    return toBHAsOptions(this.bhas);
  }

  get selectedWells(): Well[] {
    return this.wells.filter(well => this.selectedWellsId.includes(well.assetId));
  }

  get bhasToRemove(): BHA[] {
    return this.bhas.filter(bha => !this.selectedBHAsId.includes(bha.id));
  }

  setWells(wells: Well[]) {
    this.wells = wells;
  }

  setBHAs(bhas: BHA[]) {
    this.bhas = bhas;
  }

  startWellsLoading() {
    this.isWellsLoadingFailed = false;
    this.isWellsLoading = true;
  }

  finishWellsLoading() {
    this.isWellsLoading = false;
  }

  startBHAsLoading() {
    this.isBHAsLoading = true;
  }

  finishBHAsLoading() {
    this.isBHAsLoading = false;
  }

  onWellsLoadingFailed() {
    this.isWellsLoadingFailed = true;
  }

  setSelectedWellsId(ids: AssetId[]) {
    this.selectedWellsId = ids;
  }

  setSelectedBHAsId(ids: string[]) {
    this.selectedBHAsId = ids;
  }

  async loadWells(assetIds: AssetId[]): Promise<void> {
    if (!assetIds.length) return;
    this.startWellsLoading();
    try {
      const wells = await this.filtersRepository.getWells(assetIds);
      this.setWells(wells);
    } catch {
      this.onWellsLoadingFailed();
      this.setWells([]);
    }
    this.finishWellsLoading();
  }

  async loadBHAs(assetId: AssetId): Promise<void> {
    this.setSelectedBHAsId([]);
    this.startBHAsLoading();
    try {
      const bhas = await this.filtersRepository.getBHAs(assetId);
      this.setBHAs(sortBHAs(bhas));
      this.setSelectedBHAsId(bhas.map(bha => bha.id));
    } catch {
      this.setBHAs([]);
    }
    this.finishBHAsLoading();
  }
}
