import { DamageIndex } from '@/entities/damage-index';
import { DIListLine } from '@/entities/damage-index/chart-line';
import { Well } from '@/entities/well';
import { AssetId } from '@/entities/asset';

export type AxisOption = {
  label: string;
  value: keyof DamageIndex;
  units?: string;
};

export interface IChartDIRepository {
  getAll: (assetId: AssetId) => Promise<DamageIndex[]>;
  getAllHistorical: (assetId: AssetId) => Promise<DamageIndex[]>;
}

export interface IDIChartStore {
  lines: DIListLine[];
  isLoading: boolean;
  isEmpty: boolean;
  autoScale: boolean;
  scales: number[];
  selectedYAxis: AxisOption;
  selectedXAxis: AxisOption;
  yAxisOptions: AxisOption[];
  xAxisOptions: AxisOption[];
  selectYAxis: (axis: AxisOption) => void;
  selectXAxis: (axis: AxisOption) => void;
  loadData: (wells: Well[]) => Promise<void>;
  setAutoScale: (autoScale: boolean) => void;
  setScales: (scales: number[]) => void;
}
