import { Well, WellOption } from '@/entities/well';
import { BHA, BHAOption } from '@/entities/bha';
import { AssetId } from '@/entities/asset';

export interface IWellsRepository {
  get: (assetIds: AssetId[]) => Promise<Well[]>;
}

export interface IBHAsRepository {
  get: (assetId: AssetId) => Promise<BHA[]>;
}

export interface FiltersRepository {
  getWells: IWellsRepository['get'];
  getBHAs: IBHAsRepository['get'];
}

export interface IFiltersStore {
  wellsOptions: WellOption[];
  bhasOptions: BHAOption[];
  isWellsLoading: boolean;
  isWellsLoadingFailed: boolean;
  isBHAsLoading: boolean;
  selectedWells: Well[];
  bhasToRemove: BHA[];
  selectedWellsId: AssetId[];
  selectedBHAsId: string[];
  loadWells: (assetIds: AssetId[]) => Promise<void>;
  loadBHAs: (assetId: AssetId) => Promise<void>;
  setSelectedWellsId: (ids: AssetId[]) => void;
  setSelectedBHAsId: (ids: string[]) => void;
}
