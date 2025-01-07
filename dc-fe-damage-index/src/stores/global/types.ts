import { Well } from '@/entities/well';
import { AssetId } from '@/entities/asset';

export type AppSize = {
  width: number;
  height: number;
};

export interface IAssetIdsRepository {
  getByCompany: (companyId: number) => Promise<number[]>;
}

export interface IGlobalStore {
  assetIds: AssetId[];
  currentWell: Well;
  currentAssetId: number;
  currentCompanyId: number;
  rigName: string;
  appSize: AppSize;
  isTabletSize: boolean;
  isTabletSmSize: boolean;
  isMobileSize: boolean;
  isAppMaximized: boolean;
  isFullScreen: boolean;
  setCurrentWell: (well: Well) => void;
  setCurrentCompanyId: (companyId: number) => void;
  setRigName: (name: string) => void;
  turnOnFullScreen: () => void;
  turnOffFullScreen: () => void;
  setAppSize: (size: AppSize) => void;
  setAppMaximizedFlag: (flag: boolean) => void;
}
