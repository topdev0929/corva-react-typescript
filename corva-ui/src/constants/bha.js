export const QUERY_CHUNK_SIZE = 7;

export const COLLECTIONS = {
  metrics: {
    provider: 'corva',
    collection: 'metrics',
  },
  wellSections: {
    provider: 'corva',
    collection: 'data.well-sections',
  },
  survey: {
    provider: 'corva',
    collection: 'data.actual_survey',
  },
  drillstring: {
    provider: 'corva',
    collection: 'data.drillstring',
  },
  offsetWells: {
    provider: 'corva',
    collection: 'data.offset_wells',
  },
};

export const METRICS_KEYS = {
  cost: 'cost_per_ft', // Cost/ft
  // costlat: 'cost_per_lat_ft', // Cost/lat ft
  onBottomPercent: 'on_bottom_percentage', // On-Bottom %
  slidePercent: 'drilled_feet_slide_percentage', // Slide %
  distance: 'hole_depth_change', // Distance Drilled
  buildRate: 'build_rate',
  turnRate: 'turn_rate',
  netROP: 'rop',
  onBottomTime: 'on_bottom_time',
  totalTime: 'total_time',
  rotaryFootage: 'drilled_feet_rotary',
  slideFootage: 'drilled_feet_slide',
  holeDepth: 'hole_depth',
  ropRotary: 'rop_rotary',
  ropSlide: 'rop_slide',
};

export const DRILLSTRING_KEYS = {
  tfa: 'tfa',
  model: 'model',
  holeSize: 'size',
  motorSize: 'outer_diameter',
  motorBend: 'bend_range',
  motorConfig: 'motorConfig',
  make: 'make',
  hwdpLength: 'length',
  bitToBend: 'bit_to_bend',
};

export const PERCENTILE_KEYS = {
  mse: 'mse_percentiles',
  wob: 'wob_percentiles',
  diffPressure: 'diff_pressure_percentiles',
  flowIn: 'flow_in_percentiles',
  rotaryRPM: 'rpm_percentiles',
  bitRPM: 'bit_rpm_percentiles',
  ropRotary: 'rop_rotary_percentiles',
  ropSlide: 'rop_slide_percentiles',
};

export const MOTOR_CONFIG = {
  outer_diameter: 'outer_diameter',
  stages: 'stages',
  rotor_lobe: 'number_rotor_lobes',
  stator_lobe: 'number_stator_lobes',
  rpg: 'rpg',
  make: 'make',
};

export const WHISKER_OPTIONS = [
  {
    label: 'Rotary ROP',
    key: 'rop_rotary_percentiles',
    from: 'ft/h',
    unitType: 'velocity',
  },
  {
    label: 'Distance Drilled',
    key: 'distance',
    unitType: 'length',
  },
  {
    label: 'Rotary Distance',
    key: 'rotaryFootage',
    unitType: 'length',
  },
  {
    label: 'Slide Distance',
    key: 'slideFootage',
    unitType: 'length',
  },
  {
    label: 'Slide',
    key: 'slidePercent',
    toUnit: () => '%',
  },
  {
    label: 'MSE',
    key: 'mse_percentiles',
    from: 'psi',
    unitType: 'msePressure',
  },
  {
    label: 'Slide ROP',
    key: 'rop_slide_percentiles',
    from: 'ft/h',
    unitType: 'velocity',
  },
  {
    label: 'Diff Pressure',
    key: 'diff_pressure_percentiles',
    from: 'psi',
    unitType: 'pressure',
  },
  {
    label: 'WOB',
    key: 'wob_percentiles',
    from: 'klbf',
    unitType: 'force',
  },
  {
    label: 'Flow in',
    key: 'flow_in_percentiles',
    from: 'gal/min',
    unitType: 'volumeFlowRate',
  },
  {
    label: 'Rotary RPM',
    key: 'rpm_percentiles',
    from: 'ft/h',
    unitType: 'velocity',
    toUnit: () => 'rpm', // NOTE: The unit is always rpm
  },
  {
    label: 'Est Cost/foot',
    key: 'cost',
  },
  // {
  //   label: 'Cost/lat ft',
  //   key: 'costlat',
  // },
  {
    label: 'On-Bottom',
    key: 'onBottomPercent',
    toUnit: () => '%',
  },
  {
    label: 'Turn Rate',
    key: 'turnRate',
    from: 'dp100f',
    unitType: 'anglePerLength',
  },
  {
    label: 'Bit RPM',
    key: 'bit_rpm_percentiles',
    toUnit: () => 'rpm',
  },
  {
    label: 'Build Rate',
    key: 'buildRate',
    from: 'dp100f',
    unitType: 'anglePerLength',
  },
  {
    label: 'On-Bottom ROP',
    key: 'netROP',
    from: 'ft/h',
    unitType: 'velocity',
  },
];

export const MSE_WHISKER_OPTION = WHISKER_OPTIONS[3];

export const NON_MAGNETIC_TYPE = 'Non Magnetic';

export const CONVENTIONAL_TYPES = [
  {
    title: 'Conventional/RSS',
    key: 'all',
  },
  {
    title: 'Conventional',
    key: 'conventional',
  },
  {
    title: 'RSS',
    key: 'rss',
  },
];

export const BHA_FAMILY = {
  bit: 'bit',
  pdm: 'pdm',
  stabilizer: 'stabilizer',
  rss: 'rss',
  hwdp: 'hwdp',
};

export const BIT_TYPE = {
  pdc: 'pdc',
  triCone: 'Tri Cone',
};

export const RIG_NAME_KEY = 'rigName';
export const WELL_NAME_KEY = 'assetName';
export const DRILLING_CO_KEY = 'driller';
export const MOTOR_CONFIG_KEY = 'motorConfig';

export const MAX_DEPTH_LIMIT = 50000;
export const MAX_INC_LIMIT = 180;

const WELL_STATUS = {
  all: {
    title: 'All Wells',
    status: 'all',
  },
  completed: {
    title: 'Completed Wells',
    status: 'complete',
  },
  active: {
    title: 'Active Wells',
    status: 'active',
  },
};

const basicFilters = {
  basins: [],
  targetFormations: [],
  rigs: [],
  holeSizes: [],
  sectionNames: [],
};

export const DEFAULT_SETTINGS = {
  whiskerCount: 3,
  savedCompanyId: 3,
  filterSetting: {
    allFilters: basicFilters,
    activeFilters: basicFilters,
  },
  savedRadius: 10,
  savedWellName: 'All Wells',
  savedConventional: 'all',
  savedValueRange: {
    incRange: {
      minInc: 0,
      maxInc: MAX_INC_LIMIT,
    },
    depthRange: {
      minDepth: 0,
      maxDepth: MAX_DEPTH_LIMIT,
    },
  },
  savedWellSelectionInfo: {
    savedWellStatus: WELL_STATUS.completed.status,
    savedWellIds: [],
  },
  savedDeselectedIds: {},
  savedWhiskerOption: {
    'whisker-chart-0': WHISKER_OPTIONS[0].key,
    'whisker-chart-1': WHISKER_OPTIONS[1].key,
    'whisker-chart-2': WHISKER_OPTIONS[2].key,
    'whisker-chart-3': WHISKER_OPTIONS[3].key,
  },
  kpiSettings: {
    rigName: true,
    assetName: true,
    bhaId: true,
    depthIn: true,
    depthOut: true,
    holeSize: true,
    distance: true,
    rotaryFootage: false,
    slideFootage: false,
    ropRotary: true,
    ropSlide: true,
    netROP: false,
    onBottomPercent: true,
    totalTime: true,
    onBottomTime: true,
    slidePercent: true,
    turnRate: false,
    buildRate: false,
    wob: false,
    diffPressure: false,
    flowIn: false,
    rotaryRPM: false,
    bitRPM: false,
    cost: true,
    mse: true,
    bitMake: false,
    model: true,
    tfa: true,
    motorMfr: false,
    motorSize: true,
    motorBend: true,
    rpg: false,
    bitToBend: false,
    motorConfig: true,
    hwdpLength: false,
    driller: true,
    // costlat: true,
    bhaInfo: true,
  },
};
