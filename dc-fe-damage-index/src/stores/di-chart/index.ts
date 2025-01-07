import { makeObservable, observable, computed, action } from 'mobx';

import {
  DIListLine,
  generateLinesForActiveWell,
  generateLinesForOffsetWells,
} from '@/entities/damage-index/chart-line';
import { WellDILists } from '@/entities/damage-index';
import { Well, generateWellsKey } from '@/entities/well';
import { IDIListStore } from '@/stores/di-list';
import { IGlobalStore } from '@/stores/global';
import { IFiltersStore } from '@/stores/filters';
import { LINE_CHART_CONFIG, DEFAULT_SCALE } from '@/constants';

import { AxisOption, IDIChartStore, IChartDIRepository } from './types';

export * from './types';

export class DIChartStore implements IDIChartStore {
  private readonly diRepository: IChartDIRepository;
  private readonly diStore: IDIListStore;
  private readonly globalStore: IGlobalStore;
  private readonly filtersStore: IFiltersStore;
  diLists: WellDILists = [];
  autoScale = false;
  scales: number[] = DEFAULT_SCALE;
  loadingQueue: Set<string> = new Set();
  selectedYAxis: AxisOption = LINE_CHART_CONFIG.DEFAULT_Y_AXIS_OPTION;
  selectedXAxis: AxisOption = LINE_CHART_CONFIG.DEFAULT_X_AXIS_OPTION;

  constructor(
    diRepository: IChartDIRepository,
    diStore: IDIListStore,
    globalStore: IGlobalStore,
    filtersStore: IFiltersStore
  ) {
    this.diRepository = diRepository;
    this.diStore = diStore;
    this.globalStore = globalStore;
    this.filtersStore = filtersStore;
    makeObservable(this, {
      selectedYAxis: observable,
      diLists: observable,
      selectedXAxis: observable,
      loadingQueue: observable,
      autoScale: observable,
      scales: observable,
      isLoading: computed,
      isEmpty: computed,
      lines: computed,
      activeLines: computed,
      offsetLines: computed,
      loadData: action,
      selectYAxis: action,
      selectXAxis: action,
      setDILists: action,
      resetDILists: action,
      setAutoScale: action,
      setScales: action,
    });
  }

  get lines() {
    return [...this.activeLines, ...this.offsetLines];
  }

  get offsetLines() {
    return generateLinesForOffsetWells(
      this.diLists,
      this.selectedXAxis.value,
      this.selectedYAxis.value
    );
  }

  get activeLines(): DIListLine[] {
    return generateLinesForActiveWell(
      this.diStore.diList,
      this.globalStore.currentWell,
      this.filtersStore.bhasToRemove,
      this.selectedXAxis.value,
      this.selectedYAxis.value
    );
  }

  get isLoading(): boolean {
    return !!this.loadingQueue.size || this.diStore.isListLoading;
  }

  get isEmpty(): boolean {
    return !this.activeLines.length && !this.offsetLines.length;
  }

  get yAxisOptions(): AxisOption[] {
    return LINE_CHART_CONFIG.Y_AXIS_OPTIONS;
  }

  get xAxisOptions(): AxisOption[] {
    return LINE_CHART_CONFIG.X_AXIS_OPTIONS;
  }

  selectYAxis(axis: AxisOption) {
    this.selectedYAxis = axis;
  }

  selectXAxis(axis: AxisOption) {
    this.selectedXAxis = axis;
  }

  setDILists(diLists) {
    this.diLists = diLists;
  }

  setAutoScale(autoScale: boolean) {
    this.autoScale = autoScale;
  }

  setScales(scales: number[]) {
    this.scales = scales;
  }

  resetDILists() {
    if (this.diLists.length) {
      this.diLists = [];
    }
  }

  async loadData(offsetWells: Well[]) {
    const wellsKey = generateWellsKey(offsetWells);
    this.loadingQueue.clear();
    if (offsetWells.length) {
      this.loadingQueue.add(wellsKey);
      try {
        const lists = await this.loadDILists(offsetWells);
        if (!this.loadingQueue.has(wellsKey)) return;
        this.setDILists(lists);
      } catch {
        this.resetDILists();
      }
    } else {
      this.resetDILists();
    }
    this.loadingQueue.delete(wellsKey);
  }

  private loadDILists(offsetWells: Well[]): Promise<WellDILists> {
    return Promise.all(
      offsetWells.map(async well => {
        const diList = await this.diRepository.getAllHistorical(well.assetId);
        return [well, diList];
      })
    );
  }
}
