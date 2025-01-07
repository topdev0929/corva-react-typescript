import { AxisOption } from '@/stores/di-chart';

export const API_PATH = '/api/v1/data';

// Used to fetch every 168th item from DI list
const DI_TIMESTAMP_DIVISOR = 168;
const DI_TIMESTAMP_REMAINDER = 6;
export const API_CONFIG = {
  PO_DATASET: 'parameter-optimization-v0',
  DI_DATASET: 'digs_di',
  DI_HISTORICAL_DATASET: 'digs_di_historical',
  PROVIDER: 'trinity',
  DEFAULT_LIMIT: 10000,
  DI_FETCH_MOD: [DI_TIMESTAMP_DIVISOR, DI_TIMESTAMP_REMAINDER],
  DAMAGE_INDEX_DEPTH: 'damage_index_depth',
};

const Y_AXIS_OPTIONS: AxisOption[] = [
  { label: 'Damage Index', value: 'value' },
  { label: 'ROP', value: 'rop' },
];
const X_AXIS_OPTIONS: AxisOption[] = [
  { label: 'Hole Depth', value: 'depth', units: 'ft' },
  { label: 'Normalized Depth', value: 'normDepth', units: 'ft' },
  { label: 'Date Time CTS', value: 'time' },
];
const CURRENT_WELL_COLOR = 'rgba(3, 188, 212, 1)';
const LINE_CHART_COLORS = [
  'rgba(255, 187, 55, 0.5)',
  'rgba(100, 181, 246, 0.5)',
  'rgba(236, 80, 40, 0.5)',
  'rgba(119, 255, 193, 0.5)',
  'rgba(177, 77, 186, 0.5)',
  'rgba(24, 94, 176, 0.5)',
];
export const LINE_CHART_CONFIG = {
  TYPE: 'line' as const,
  CURRENT_WELL_COLOR,
  COLORS: LINE_CHART_COLORS,
  X_AXIS_OPTIONS,
  Y_AXIS_OPTIONS,
  DEFAULT_X_AXIS_OPTION: X_AXIS_OPTIONS[0],
  DEFAULT_Y_AXIS_OPTION: Y_AXIS_OPTIONS[0],
  MAIN_LINE_DASH_STYLE: 'Solid' as const,
  SECONDARY_LINE_DASH_STYLE: 'Dot' as const,
  MAIN_LINE_WIDTH: 3,
  SECONDARY_LINE_WIDTH: 1,
};

export const DEFAULT_SCALE = [0, 0.5, 1.5, 4];

export enum SCALE_TYPE {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type SCALE_PROPS = `${SCALE_TYPE}`;

export const DEFAULT_DI_CHANGES = [
  {
    label: '1',
    unit: 'hr',
    value: 0,
  },
  {
    label: '100',
    unit: 'ft',
    value: 0,
  },
  {
    label: '500',
    unit: 'ft',
    value: 0,
  },
];

export const FIT_IN_PERCENTS = {
  LOW_DANGER: 0,
  HIGH_DANGER: 100,
  LOW_WARN: 20,
  HIGH_WARN: 80,
};

export const SCREEN_BREAK_POINTS = {
  TABLET: 1200,
  TABLET_SM: 750,
  MOBILE: 588,
};

export const MAX_OFFSET_SIZE = 10;

export const Missing = 'NaN';
