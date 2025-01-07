import { sortBy } from 'lodash';
import { metricsUtils } from '~/utils';

export const SMALL_SCREEN_HEIGHT = 800;
export const SMALL_SCREEN_WIDTH = 650;
export const ViewType = {
  none: 'none',
  normal: 'normal',
  small: 'small screen',
  tablet: 'tablet',
  mobile: 'mobile',
};
export const MAX_OFFSET_SIZE = 1000;
export const DEFAULT_BIC_OFFSET_SIZE = 50;
export const DEFAULT_LOCAL_OFFSET_SIZE = 50;

export const ANDROID_DEVICE = 'Android';
export const IOS_DEVICE = 'iOS';
export const WINDOWS_PHONE = 'Window Phone';
export const OTHER_DEVICE = 'other';

export const ALL_SECTION_KEY = 'all';
export const ALL_SECTION_LABEL = 'All';
export const EXPANED_WELLNAME_WIDTH = 450;
export const ROWS_PER_PAGE = 50;
export const ROW_HEIGHT = 60;
export const LEAVE_TOUCH_DELAY = 10000;
const metrics = metricsUtils.default;

export const FilterType = {
  status: 'status',
  rig: 'rigName',
  program: 'programName',
  basin: 'basin',
  county: 'county',
  area: 'area',
  formation: 'formation',
  stringDesign: 'stringDesign',
  radius: 'radius',
  period: 'period',
  sideTracks: 'sideTracks',
  timeRangeFrom: 'timeRangeFrom',
  timeRangeTo: 'timeRangeTo',
};

export const FilterOptions = [
  {
    value: FilterType.rig,
    label: 'Rig',
  },
  {
    value: FilterType.program,
    label: 'Program/BU',
  },
  {
    value: FilterType.basin,
    label: 'Basin',
  },
  {
    value: FilterType.county,
    label: 'County',
  },
  {
    value: FilterType.area,
    label: 'Area',
  },
  {
    value: FilterType.formation,
    label: 'Target Formation',
  },
  {
    value: FilterType.stringDesign,
    label: 'String Design',
  },
];

export const WellStatus = {
  unknown: 'unknown',
  idle: 'idle',
  active: 'active',
  paused: 'paused',
  complete: 'complete',
};

export const StatusOptions = [
  { value: WellStatus.unknown, color: '#9E9E9E' },
  { value: WellStatus.idle, color: '#BDBDBD' },
  { value: WellStatus.active, color: '#95F126' },
  { value: WellStatus.paused, color: '#FFF350' },
  { value: WellStatus.complete, color: '#2196F3' },
];

export const ColumnType = {
  name: 'name',
  status: 'status',
  rig: 'rigName',
  distance: 'distance',
  lastActive: 'lastActive',
  metrics: 'metrics',
  wellSection: 'wellSection',
};

export const TableColumns = [
  {
    type: ColumnType.name,
    label: 'Well Name',
    key: ColumnType.name,
    width: [280, 197, 197, 186],
  },
  {
    type: ColumnType.status,
    label: '',
    key: ColumnType.status,
    width: [40, 40, 40, 30],
  },
  {
    type: ColumnType.rig,
    label: 'Rig',
    key: ColumnType.rig,
    width: [220, 140, 140, 93],
  },
  {
    type: ColumnType.distance,
    label: 'Distance',
    key: ColumnType.distance,
    width: [160, 160, 122, 93],
  },
  {
    type: ColumnType.lastActive,
    label: 'Last Active',
    key: ColumnType.lastActive,
    width: [140, 140, 108, 98],
  },
  {
    type: ColumnType.metrics,
    label: '',
    key: '',
    width: [0, 212, 141, 141],
  },
  {
    type: ColumnType.wellSection,
    label: 'Well Section',
    key: ColumnType.wellSection,
    width: [180, 131, 131, 97],
  },
];

export const OBJECTIVE_PERIOD_LIST = [
  { value: 'all', label: 'All' },
  { value: 'last12h', label: 'Last 12 hrs' },
  { value: 'last24h', label: 'Last 24 hrs' },
  { value: 'last7d', label: 'Last 7 days' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'custom', label: 'Сustom' },
];

export const MAX_METRICS_COUNT = 3;

export const METRICS_LIST = sortBy(
  [
    metrics.weight_to_weight_average,
    metrics.bottom_to_slips_average,
    metrics.drilling_connection_average,
    metrics.slips_to_bottom_average,
    metrics.hole_depth,
    metrics.hole_depth_change,
    metrics.drilled_feet_rotary,
    metrics.drilled_feet_slide,
    metrics.rop_gross,
    metrics.rop,
    metrics.rop_rotary,
    metrics.rop_slide,
    metrics.drilled_feet_rotary_percentage,
    metrics.drilled_feet_slide_percentage,
    metrics.on_bottom_percentage,
    metrics.on_bottom_time,
    metrics.cost_per_ft,
    metrics.cost_per_lat_ft,
    metrics.feet_per_day,
    metrics.tripping_in_speed_cased,
    metrics.tripping_in_speed_open,
    metrics.tripping_in_speed,
    metrics.tripping_out_speed_cased,
    metrics.tripping_out_speed_open,
    metrics.tripping_out_speed,
    ...(process.env.REACT_APP_ENVIRONMENT !== 'production'
      ? [
          metrics.npt,
          metrics.circulating_time,
          metrics.spud_to_rig_release_time,
          metrics.spud_to_total_depth_time,
        ]
      : []),
  ],
  'label'
);

export const DEFAULT_SETTINGS = {
  radius: 0,
  filters: {},
  sortInfo: {
    key: 'name',
    direction: 1,
  },
};

export const WellSectionColors = [
  '#6EACFF',
  '#69B919',
  '#E95DAF',
  '#A77DFF',
  '#77FFC1',
  '#018EFE',
  '#FF5D7E',
  '#B9E310',
  '#FFD111',
  '#24BB8E',
  '#C426F3',
];

export const TOP_GRADIENT_MAP = {
  [ViewType.small]: 0,
  [ViewType.mobile]: 52,
  [ViewType.none]: 48,
  [ViewType.tablet]: 48,
  [ViewType.normal]: 48,
};

export const DEFAULT_METRICS_KEY = 'hole_depth_change';
