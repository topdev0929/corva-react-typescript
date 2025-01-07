import { makeObservable, observable, computed, action } from 'mobx';

import { Well } from '@/entities/well';
import { AssetId, removeCurrentAsset } from '@/entities/asset';
import { SCREEN_BREAK_POINTS } from '@/constants';

import { IGlobalStore, IAssetIdsRepository, AppSize } from './types';

export * from './types';

export class GlobalStore implements IGlobalStore {
  private readonly assetIdsRepository: IAssetIdsRepository;
  allAssetIds: AssetId[] = [];
  currentWell: Well;
  currentCompanyId: number;
  rigName = '';
  isFullScreen = false;
  isAppMaximized = false;
  appSize: AppSize = { width: 0, height: 0 };

  constructor(
    assetIdsRepository: IAssetIdsRepository,
    well: Well,
    companyId: number,
    rigName: string
  ) {
    this.assetIdsRepository = assetIdsRepository;
    this.currentWell = well;
    this.currentCompanyId = companyId;
    this.rigName = rigName;
    makeObservable(this, {
      allAssetIds: observable,
      currentWell: observable,
      currentCompanyId: observable,
      rigName: observable,
      isFullScreen: observable,
      appSize: observable,
      isAppMaximized: observable,
      currentAssetId: computed,
      assetIds: computed,
      isTabletSize: computed,
      isTabletSmSize: computed,
      isMobileSize: computed,
      setCurrentWell: action,
      setCurrentCompanyId: action,
      setAssetIds: action,
      setRigName: action,
      turnOffFullScreen: action,
      turnOnFullScreen: action,
      setAppSize: action,
      setAppMaximizedFlag: action,
    });
    this.loadData();
  }

  get currentAssetId(): AssetId {
    return this.currentWell.assetId;
  }

  get assetIds(): AssetId[] {
    return removeCurrentAsset(this.allAssetIds, this.currentAssetId);
  }

  get isTabletSize(): boolean {
    return (
      this.appSize.width > SCREEN_BREAK_POINTS.TABLET_SM &&
      this.appSize.width <= SCREEN_BREAK_POINTS.TABLET
    );
  }

  get isTabletSmSize(): boolean {
    return (
      this.appSize.width > SCREEN_BREAK_POINTS.MOBILE &&
      this.appSize.width <= SCREEN_BREAK_POINTS.TABLET_SM
    );
  }

  get isMobileSize(): boolean {
    return this.appSize.width <= SCREEN_BREAK_POINTS.MOBILE;
  }

  setAssetIds(assetIds: AssetId[]) {
    this.allAssetIds = assetIds;
  }

  setCurrentWell(well: Well) {
    this.currentWell = well;
  }

  setCurrentCompanyId(companyId: number) {
    this.currentCompanyId = companyId;
  }

  setRigName(name: string) {
    this.rigName = name;
  }

  turnOnFullScreen() {
    this.isFullScreen = true;
  }

  turnOffFullScreen() {
    this.isFullScreen = false;
  }

  setAppSize(size: AppSize) {
    this.appSize = size;
  }

  setAppMaximizedFlag(flag: boolean) {
    this.isAppMaximized = flag;
  }

  async loadData(): Promise<void> {
    try {
      const allAssetIds = await this.assetIdsRepository.getByCompany(this.currentCompanyId);
      this.setAssetIds(allAssetIds);
    } catch {
      this.setAssetIds([]);
    }
  }
}
