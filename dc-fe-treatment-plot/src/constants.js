import {
  FLOW_RATE_COLORS,
  PRESSURE_COLORS,
  CHEMICALS_VOL_TYPES,
  CHEMICALS_MASS_TYPES,
  PROPPANTS_CON_TYPES,
  PROPPANTS_MASS_TYPES,
  TOTAL_VOLUME_COLORS,
} from '@corva/ui/constants/completion';
import { getUniqueUnitsByType } from '@corva/ui/utils';

// common sizes
export const RT_SIDEBAR_HORIZONTAL_HEIGH = 46;
export const MOBILE_SIZE_BREAKPOINT = 599;
export const TABLET_SIZE_BREAKPOINT = 959;

export const GOALS_LIST = [
  {
    name: 'Rate',
    key: 'slurry_rate_in',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    color: '#257CFF',
    axis: 'rate',
  },
  {
    name: 'HHP',
    key: 'hydraulic_horse_power',
    unitType: 'power',
    unit: 'hp',
    color: '#AA5D3D',
    axis: 'selectedHorsepower',
  },
  {
    name: 'Pressure',
    key: 'pressure',
    axis: 'pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: '#FF4571',
  },
];

export const RATE_LIST = [
  {
    name: 'Clean Flow Rate',
    key: 'clean_flow_rate_in',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    color: FLOW_RATE_COLORS.clean_flow_rate_in,
    precision: 1,
    category: 'rate',
  },
  {
    name: 'Slurry Flow Rate',
    key: 'slurry_flow_rate_in',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    color: FLOW_RATE_COLORS.slurry_flow_rate_in,
    precision: 1,
    category: 'rate',
  },
];

export const HORSEPOWER_LIST = [
  {
    name: 'Hydraulic Horse Power',
    key: 'hydraulic_horse_power',
    unitType: 'power',
    unit: 'hp',
    precision: 1,
    color: '#AA5D3D',
  },
];

export const PRESSURE_LIST = [
  {
    name: 'Wellhead Pressure',
    key: 'wellhead_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.well_head_pressure,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Pipe Frictional Presure Loss',
    key: 'pipe_frictional_pressure_loss',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.pipe_frictional_pressure_loss,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'NWB Frictional Pressure Loss',
    key: 'nwb_frictional_pressure_loss',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.nwb_frictional_pressure_loss,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Bottomhole Pressure',
    key: 'bottomhole_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.bottomhole_pressure,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Net Pressure',
    key: 'net_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.net_pressure,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Hydrostatic Pressure',
    key: 'hydrostatic_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.hydrostatic_pressure,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Backside Pressure',
    key: 'backside_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.backside_pressure,
    precision: 0,
    category: 'pressure',
  },
  {
    name: 'Pumpside Pressure',
    key: 'pumpside_pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: PRESSURE_COLORS.pumpside_pressure,
    precision: 0,
    category: 'pressure',
  },
];

export const CHEMICALS_VOL_LIST = [
  ...CHEMICALS_VOL_TYPES.map(item => ({
    ...item,
    unitType: 'chemVolumeConcentration',
    unit: 'gal/Mgal',
    precision: 2,
    category: 'chemical',
  })),
];

export const CHEMICALS_MASS_LIST = [
  ...CHEMICALS_MASS_TYPES.map(item => ({
    ...item,
    unitType: 'chemMassConcentration',
    unit: 'lb/Mgal',
    precision: 2,
    category: 'chemical',
  })),
];

export const CHEMICALS_LIST = [...CHEMICALS_VOL_LIST, ...CHEMICALS_MASS_LIST];
export const TOTAL_LIQUID_FR_KEY = 'total_friction_reducer';

const TRACKING_LIST = [
  {
    name: 'Time to Perfs',
    key: 'duration_for_surface_to_reach_bottom',
    unitType: 'time',
    unit: 'min',
    min: 0,
    color: 'transparent',
  },
];

export const BHPC_TYPE = {
  name: 'BHPC',
  key: 'bottomhole_proppant_concentration',
  unitType: 'massConcentration',
  unit: 'lb/gal',
  color: '#AC44F6',
  precision: 2,
};

export const PROPPANTS_CON_LIST = PROPPANTS_CON_TYPES.map(item => ({
  ...item,
  precision: 2,
  category: 'proppant',
}));

export const PROPPANTS_MASS_LIST = PROPPANTS_MASS_TYPES.map(item => ({
  ...item,
  precision: 2,
  category: 'proppant',
}));

export const PROPPANTS_LIST = [...PROPPANTS_CON_LIST, ...PROPPANTS_MASS_LIST];

export const TOTAL_VOLUME_LIST = [
  {
    name: 'Clean Volume',
    key: 'total_clean_volume_in',
    unitType: 'oil',
    unit: 'bbl',
    color: TOTAL_VOLUME_COLORS.total_clean_volume_in,
    precision: 0,
    category: 'totalVolume',
  },
  {
    name: 'Slurry Volume',
    key: 'total_slurry_volume_in',
    unitType: 'oil',
    unit: 'bbl',
    color: TOTAL_VOLUME_COLORS.total_slurry_volume_in,
    precision: 0,
    category: 'totalVolume',
  },
];

export const SERIES_TYPES = [
  ...RATE_LIST,
  ...HORSEPOWER_LIST,
  ...PRESSURE_LIST,
  ...CHEMICALS_LIST,
  ...PROPPANTS_CON_LIST,
  ...PROPPANTS_MASS_LIST,
  ...TOTAL_VOLUME_LIST,
];

export const DEFAULT_AXIS_SETTING = [
  {
    key: 'pressure',
    label: 'Pressure',
    unitType: 'pressure',
    unit: 'psi',
    series: PRESSURE_LIST.filter(
      item => item.key !== 'hydrostatic_pressure' && item.key !== 'backside_pressure'
    ),
    min: 0,
  },
  {
    key: 'backsidePressure',
    label: 'Backside Pressure',
    unitType: 'pressure',
    unit: 'psi',
    series: PRESSURE_LIST.filter(item => item.key === 'backside_pressure'),
    min: 0,
  },
  {
    key: 'hydrostaticPressure',
    label: 'Hydrostatic Pressure',
    unitType: 'pressure',
    unit: 'psi',
    series: PRESSURE_LIST.filter(item => item.key === 'hydrostatic_pressure'),
    min: 0,
  },
  {
    key: 'offsetPressure',
    label: 'Offset Pressure',
    unitType: 'pressure',
    unit: 'psi',
    series: [],
    min: 0,
  },
  {
    key: 'rate',
    label: 'Flow Rate',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    series: RATE_LIST,
    min: 0,
  },
  {
    key: 'selectedHorsepower',
    label: 'Horsepower',
    unitType: 'power',
    unit: 'hp',
    series: HORSEPOWER_LIST,
    min: 0,
  },
  {
    key: 'chemVolumeConcentration',
    label: 'Chemical Vol',
    unitType: 'chemVolumeConcentration',
    unit: 'gal/Mgal',
    series: CHEMICALS_VOL_LIST,
    min: 0,
  },
  {
    key: 'chemMassConcentration',
    label: 'Chemical Mass',
    unitType: 'chemMassConcentration',
    unit: 'lb/Mgal',
    series: CHEMICALS_MASS_LIST,
    min: 0,
  },
  {
    key: 'proppantConc',
    label: 'Proppant Conc',
    unitType: 'massConcentration',
    unit: 'lb/gal',
    series: PROPPANTS_CON_LIST,
    min: 0,
  },
  {
    key: 'proppantMass',
    label: 'Proppant Mass',
    unitType: 'mass',
    unit: 'lb',
    series: PROPPANTS_MASS_LIST,
    min: 0,
  },
  {
    key: 'totalVolume',
    label: 'Total Volume',
    unitType: 'oil',
    unit: 'bbl',
    series: TOTAL_VOLUME_LIST,
    min: 0,
  },
  {
    key: 'trashChannels',
    label: 'Trash Channels',
    series: [],
  },
];

export const STAGE_MODE_KEYS = {
  active: 'active',
  lastCustomTime: 'lastCustomTime',
  activeCustom: 'activeCustom',
  last5: 'last5',
  last10: 'last10',
  manual: 'manual',
  all: 'all',
};

export const VIEWER_STAGE_MODE_KEYS = [
  STAGE_MODE_KEYS.lastCustomTime,
  STAGE_MODE_KEYS.activeCustom,
];

export const STAGE_MODE = [
  { name: 'Active Stage', key: STAGE_MODE_KEYS.active },
  { name: 'Last 5 Stages', key: STAGE_MODE_KEYS.last5 },
  { name: 'Last 10 Stages', key: STAGE_MODE_KEYS.last10 },
  { name: 'Manual Stages', key: STAGE_MODE_KEYS.manual },
  { name: 'All Stages', key: STAGE_MODE_KEYS.all },
  { name: 'Last Custom (hrs)', key: STAGE_MODE_KEYS.lastCustomTime },
  { name: 'Custom Time Range', key: STAGE_MODE_KEYS.activeCustom },
];

export const CUSTOM_ACTIVE_MODE = [
  { name: '5', key: 5 },
  { name: '10', key: 10 },
  { name: '15', key: 15 },
  { name: '20', key: 20 },
  { name: '25', key: 25 },
  { name: '30', key: 30 },
];

export const VIEW_MODE_KEYS = {
  series: 'series',
  overlay: 'overlay',
};

export const VIEW_MODE = [
  { name: 'Overlay', key: VIEW_MODE_KEYS.overlay },
  { name: 'Series', key: VIEW_MODE_KEYS.series },
];

export const REF_POINT = [
  { name: 'ISIP', key: 'isip' },
  { name: 'Breakdown', key: 'breakdown' },
  { name: 'Opening Wellhead Pressure', key: 'opening_wellhead_pressure' },
  { name: 'Proppant Injection', key: 'proppant_injection_start_timestamp' },
  { name: 'Rate Start', key: 'main_pumping_start_timestamp' },
  { name: 'Target Ramp Rate', key: 'target_ramp_rate' },
];

export const PREESURE_UNITS = getUniqueUnitsByType('pressure').map(item => item.abbr);

export const OFFSET_PRESSURE_PREFIX = 'offset_pressure_';
export const ABRA_PRESSURE_PREFIX = 'abra_';
export const FRACTURE_GRADIENT_KEY = 'fracture_gradient';

export const SUCCESS_COLOR = '#75DB29';

export const FALLBACK_SERIES_COLOR = '#fff';

export const OFFSET_PRESSURE_COLORS = [
  '#73AFAA',
  '#51A8BA',
  '#1C8195',
  '#006073',
  '#2B5383',
  '#54A688',
  '#1E9C7A',
  '#7CB762',
  '#207561',
  '#375227',
];

export const CUSTOM_SERIES_COLORS = [
  '#99B955',
  '#D8496B',
  '#807DFF',
  '#4DCFB3',
  '#EE752F',
  '#F9D649',
  '#A844FC',
  '#85D947',
  '#DA4D2F',
  '#5580FE',
  '#DB3B7A',
  '#F4AE3D',
  '#2FB7E2',
  '#BBE749',
  '#8860F0',
  '#E44538',
  '#3C91E3',
  '#5AC462',
  '#627CFA',
  '#55BCA6',
];

export const TEXT_GRAY = '#BDBDBD';

export const RT_ACTUAL_TYPES = [
  ...PRESSURE_LIST,
  ...RATE_LIST,
  ...TOTAL_VOLUME_LIST,
  PROPPANTS_LIST[0],
  {
    name: 'Total Proppant Mass',
    key: 'total_proppant_mass',
    unitType: 'mass',
    color: '#C6C013',
    unit: 'lb',
  },
  {
    name: 'Hydraulic Horse Power',
    key: 'hydraulic_horse_power',
    unitType: 'power',
    unit: 'hp',
    precision: 1,
    color: '#AA5D3D',
  },
  BHPC_TYPE,
];

export const ISIPEvent = {
  name: 'ISIP',
  key: 'isip.wellhead_pressure',
  isArray: true,
  unitType: 'pressure',
  unit: 'psi',
  precision: 0,
  color: PRESSURE_COLORS.well_head_pressure,
};

export const RT_COMPUTED_TYPES = [
  {
    name: 'Max Treating Pressure',
    key: 'max_treating_pressure',
    unitType: 'pressure',
    unit: 'psi',
    precision: 0,
    color: PRESSURE_COLORS.max_treating_pressure,
  },
  {
    name: 'Ave Treating Pressure',
    key: 'ave_treating_pressure',
    unitType: 'pressure',
    unit: 'psi',
    precision: 0,
    color: PRESSURE_COLORS.ave_treating_pressure,
  },
  {
    name: 'Breakdown',
    key: 'breakdown.wellhead_pressure',
    isArray: true,
    unitType: 'pressure',
    unit: 'psi',
    precision: 0,
    color: PRESSURE_COLORS.well_head_pressure,
  },
  {
    ...ISIPEvent,
  },
  {
    name: 'Max Slurry Flow Rate',
    key: 'max_flow_rate',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    precision: 1,
    color: FLOW_RATE_COLORS.max_flow_rate,
  },
  {
    name: 'Ave Slurry Flow Rate',
    key: 'ave_pumping_rate',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    precision: 1,
    color: FLOW_RATE_COLORS.ave_flow_rate,
  },
  {
    name: 'Frac Gradient',
    key: FRACTURE_GRADIENT_KEY,
    unitType: 'pressureGradient',
    unit: 'psi/ft',
    precision: 1,
    color: '#F6D06E',
  },
];

export const RT_DERIVED_TYPES = [
  {
    name: 'Area Pressure',
    key: 'area_wellhead_pressure',
    unitType: 'pressure',
    unit: 'psi',
    precision: 0,
    color: PRESSURE_COLORS.well_head_pressure,
  },
  {
    name: 'Area Rate',
    key: 'area_slurry_flow_rate_in',
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
    precision: 1,
    color: FLOW_RATE_COLORS.slurry_flow_rate_in,
  },
  {
    name: 'Area Elapsed Time',
    key: 'area_elapsed_time',
    precision: 1,
    color: '#0085e3',
  },
];

export const RT_TYPES = [
  ...RT_ACTUAL_TYPES.map(item => ({ ...item, collection: 'wits' })),
  ...RT_COMPUTED_TYPES.map(item => ({ ...item, collection: 'prediction' })),
  ...RT_DERIVED_TYPES.map(item => ({ ...item, collection: 'stats' })),
  ...CHEMICALS_LIST.map(item => ({ ...item, collection: 'wits' })),
  ...TRACKING_LIST.map(item => ({ ...item, collection: 'tracking' })),
];

export const DEFAULT_RT_VALUES_SETTINGS = [
  'wellhead_pressure',
  'slurry_flow_rate_in',
  'total_proppant_concentration',
  'friction_reducer',
  'clean_flow_rate_in',
  'area_wellhead_pressure',
  'area_slurry_flow_rate_in',
  'area_elapsed_time',
];

export const DEFAULT_FILTER_SETTINGS = {
  stageMode: STAGE_MODE[0].key,
  lastCustomTime: '0.5',
  customActiveMode: CUSTOM_ACTIVE_MODE[0].key,
  viewMode: VIEW_MODE[1].key,
  manualStages: [],
  refPoint: REF_POINT[0].key,
};

export const DEFAULT_VIEWER_FILTER_SETTINGS = {
  stageMode: VIEWER_STAGE_MODE_KEYS[0],
  lastCustomTime: '3',
  viewMode: VIEW_MODE[1].key,
};

export const RUNNING_STATE = 'running';
export const SUCCEEDED_STATE = 'succeeded';
export const FAILED_STATE = 'failed';

export const DYNAMIC_MENUS = {
  download: {
    icon: 'archive',
    title: 'Export as CSV',
    priority: false,
  },
};

export const TIME_RANGES = {
  specificTimeRange: {
    key: 'specificTimeRange',
    label: 'Custom Time Range',
  },
  specificStages: {
    key: 'specificStages',
    label: 'Custom Stages',
  },
};

export const TIME_RANGE_TYPES = [TIME_RANGES.specificTimeRange, TIME_RANGES.specificStages];
export const VIEWER_TIME_RANGE_TYPES = [TIME_RANGES.specificTimeRange];

export const WELLHUB_PAGE_MAP = {
  surfaceEquip: 'Surface%20Equipment',
  wellPlan: 'Well%20Plan',
  wellSections: 'Well%20Sections',
  bha: 'Drillstrings',
  formations: 'Formations',
  basin: '',
  targetFormation: '',
  stageDesign: 'Stage%20Design',
  casing: 'Casing%20&%20Riser',
  actualSurveys: 'Actual%20Surveys',
  jobSettings: 'Job%20Settings',
  map: '',
};

export const DEFAULT_SETTINGS = {
  offsetSetting: {},
  filterSetting: {},
  dataSetting: {
    selectedPress: [PRESSURE_LIST[0].key],
    selectedHorsepower: [],
    selectedOffsetPressure: [],
    selectedRate: [RATE_LIST[1].key],
    selectedVolumeChemical: [],
    selectedMassChemical: [],
    selectedMassConcentrationProppant: [PROPPANTS_CON_LIST[0].key],
    selectedMassProppant: [],
    selectedTotalVolume: [],
    selectedCustomChannels: [],
  },
  customTimeSetting: { start: null, end: null },
  scaleSetting: DEFAULT_AXIS_SETTING,
  activitySettingByAsset: {},
  graphColors: {},
  offsetGraphColors: {},
  isAssetViewer: false,
  isRealtimeSidebarOpen: true,
  isFilterSidebarOpen: true,
  rtValuesSetting: {},
  sideSetting: {
    showRealtimeValues: true,
    showFeedBar: true,
    showLegendBar: true,
    showSlider: true,
    showStreamboxStatus: true,
    showTooltip: true,
  },
};

export const CATEGORIES = {
  timeline: 'timeline',
  event: 'event',
  main: 'main',
};

export const TARGET_RAMP_ITEM = {
  background: 'rgba(143, 75, 255, 0.40)',
  color: '#8F4BFF',
  name: 'Ramp',
  tooltipName: 'Target Ramp',
  key: 'target_ramp_rate',
  barStyle: {
    borderRadius: '1px',
    border: '1px solid #8F4BFF',
    background: 'rgba(143, 75, 255, 0.50)',
  },
  barStyleDisabled: {
    borderRadius: '1px',
    border: '1px solid #616161',
    background: 'rgba(97, 97, 97, 0.50))',
  },
};

export const FLUSH_ACTIVITY = 'Flush';
export const PAD_ACTIVITY = 'Pad';

export const ABRA_COLLECTION = 'abra';

export const CORVA_PROVIDER = 'corva';

export const PERCENT_PROPPANT = {
  category: 'proppant',
  collection: 'data.stages',
  color: '#F9A400',
  key: 'percent_proppant',
  name: '% Prop Placed',
  precision: 2,
};

export const EVENT_ID_SEPARATOR = '---';

export const DEFAULT_DATE_FORMAT = 'MM/DD HH:mm';
export const TOOLTIP_DATE_FORMAT = 'MM/DD HH:mm:ss';

export const CHANNELS_LIST = [
  {
    label: 'Pressures',
    key: 'pressure',
  },
  {
    label: 'Offset Pressures',
    key: 'offsetPressure',
  },
  {
    label: 'Rates',
    key: 'rate',
  },
  {
    label: 'Volume Chemicals',
    key: 'chemVolumeConcentration',
  },
  {
    label: 'Mass Chemicals',
    key: 'chemMassConcentration',
  },
  {
    label: 'Proppant Concentrations',
    key: 'proppantConc',
  },
  {
    label: 'Proppant Mass',
    key: 'proppantMass',
  },
  {
    label: 'Total Volumes',
    key: 'totalVolume',
  },
  {
    label: 'Custom Channels',
    key: 'trashChannels',
  },
];
