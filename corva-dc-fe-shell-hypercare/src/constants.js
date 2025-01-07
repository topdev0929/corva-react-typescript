import { sortBy } from 'lodash';

export const COLLECTIONS = {
  witsSubscription: {
    provider: 'corva',
    collection: 'wits',
    meta: { isRequired: false, subscribeToLatestOnly: true, subscribeOnly: true },
  },
  witsFirstData: {
    provider: 'corva',
    collection: 'wits',
    params: {
      limit: 1,
      sort: '{ timestamp: 1 }',
    },
  },
  witsLastData: {
    provider: 'corva',
    collection: 'wits',
    params: {
      limit: 1,
      sort: '{ timestamp: -1 }',
    },
  },
  wits: {
    provider: 'corva',
    collection: 'wits',
    params: {
      sort: '{timestamp: 1}',
      limit: 10000,
    },
  },
  phasesManual: {
    provider: 'corva',
    collection: 'completion.manual.phases',
    params: {
      limit: 1000,
      sort: '{timestamp: -1}',
    },
  },
  phasesCritical: {
    provider: 'corva',
    collection: 'completion.manual.points',
    params: {
      limit: 1000,
      sort: '{timestamp: -1}',
    },
  },
  downholeSensorAdjustment: {
    provider: 'corva',
    collection: 'downhole.sensor.adjustment',
    params: {
      limit: 1,
      sort: '{timestamp: -1}',
    },
  },
};

const MAX_RECORDS = 1500;

export const LOW_DIFF_SECONDS = MAX_RECORDS * 1; // max records on 1 sec
export const MEDIUM_DIFF_SECONDS = MAX_RECORDS * 1 * 60; // max records on 1 min
export const HIGH_DIFF_SECONDS = MAX_RECORDS * 30 * 60; // max records on 30 min
export const XHIGH_DIFF_SECONDS = MAX_RECORDS * 6 * 3600; // max records on 6 hr

export const SOURCE_TYPE = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  xhigh: 'xhigh',
};

export const DATASET_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: '6 hours', value: '6hrs' },
  { label: '30 min', value: '30min' },
  { label: '1 min', value: '1min' },
  { label: '1 sec', value: '1sec' },
];

export const EMPTY_STATE = {
  noAsset: 'Asset has no Data',
  noDataAvailable: 'No Data Available in Selected Range',
};

export const DATASET = {
  [SOURCE_TYPE.low]: {
    wits: 'wits',
    sensor: 'downhole.sensor.data',
    unit: 1, // record number per one second
  },
  [SOURCE_TYPE.medium]: {
    wits: 'wits.summary-1m',
    sensor: 'downhole.sensor.data-1m',
    unit: 1 / 60,
  },
  [SOURCE_TYPE.high]: {
    wits: 'wits.summary-30m',
    sensor: 'downhole.sensor.data-30m',
    unit: 1 / 1800,
  },
  [SOURCE_TYPE.xhigh]: {
    wits: 'wits.summary-6h',
    sensor: 'downhole.sensor.data-6h',
    unit: 1 / (3600 * 6),
  },
};

export const PHASE_DIALOG_TYPE = {
  close: 'close',
  create: 'create',
  edit: 'edit',
};

export const Y_AXIS_START_OFFSET = 5;
export const Y_AXIS_INTERVAL_OFFSET = 56;

export const MAX_OFFSET_SIZE = 6;

export const LAST_24H = 86400; // 24 hrs in seconds
export const DEFAULT_PHASE_COLOR = '#FFF350';
export const DEFAULT_CRITICAL_COLOR = '#F44336';
export const POINT_WIDTH = 30;

export const VIEW_MODE_OPTIONS = [
  { label: 'Series', value: 'series' },
  { label: 'Overlay', value: 'overlay' },
];

export const C_EVENT_LIST = [
  { event: 'SO prior to entering sump packer w/ Frac head', trace: 'hook_load' },
  { event: 'PU Prior to entering sump packer w/ Frac head', trace: 'hook_load' },
  { event: 'Sump packer seals engaged (bit depth)', trace: 'bit_depth' },
  { event: 'Sump packer snap out', trace: 'hook_load' },
  { event: 'Block height w/ Neutral weight on sump packer', trace: 'block_height' },
  { event: 'max pressure when setting packer', trace: 'standpipe_pressure' },
  { event: 'Hook load when element sets', trace: 'hook_load' },
  { event: 'Hook load for pull test on packer', trace: 'hook_load' },
  { event: 'SO to set weight down for release', trace: 'hook_load' },
  { event: 'Max hookload (overload) when releasing', trace: 'hook_load' },
  { event: 'Start PU (multi variable: time, Block height)', trace: 'block_height' },
  { event: 'End PU (multi variable: time, Block height)', trace: 'block_height' },
  { event: 'PU after release from packer', trace: 'hook_load' },
  { event: 'Block height in reverse after releaseing', trace: 'block_height' },
  { event: 'Pickle: Avg forward circuling rate', trace: 'mud_flow_in' },
  { event: 'Pickle: Avg reverse circulating rate', trace: 'mud_flow_in' },
  { event: 'Reverse circulating rates after releasing (RCRAR)', trace: null },
  { event: 'RCRAR-12: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-12: Annulus Static Line', trace: null },
  { event: 'RCRAR-12: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-12: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'RCRAR-10: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-10: Annulus Static Line', trace: null },
  { event: 'RCRAR-10: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-10: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'RCRAR-8: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-8: Annulus Static Line', trace: null },
  { event: 'RCRAR-8: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-8: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'RCRAR-6: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-6: Annulus Static Line', trace: null },
  { event: 'RCRAR-6: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-6: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'RCRAR-4: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-4: Annulus Static Line', trace: null },
  { event: 'RCRAR-4: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-4: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'RCRAR-2: Pump Pressure (Standpipe)', trace: 'standpipe_pressure' },
  { event: 'RCRAR-2: Annulus Static Line', trace: null },
  { event: 'RCRAR-2: Workstring Ahead of Open Choke', trace: null },
  { event: 'RCRAR-2: Flowmeter Return Rate', trace: 'tbg_flowmeter_1' },
  { event: 'DHCR-0.5: workstring pressure', trace: 'standpipe_pressure' },
  { event: 'DHCR-0.5: return rate', trace: 'ann_flowmeter_1' },
  { event: 'DHCR-1.0: workstring pressure', trace: 'standpipe_pressure' },
  { event: 'DHCR-1.0: return rate', trace: 'ann_flowmeter_1' },
  { event: 'DHCR-2.0: workstring pressure', trace: 'standpipe_pressure' },
  { event: 'DHCR-2.0: return rate', trace: 'ann_flowmeter_1' },
  { event: 'Line test: start pressure', trace: 'rig_floor_treating_pressure' },
  { event: 'Line test: end pressure', trace: 'rig_floor_treating_pressure' },
  { event: 'pop off value', trace: 'standpipe_pressure' },
  { event: 'Final acid injection rate', trace: 'slurry_rate' },
  { event: 'injection rate', trace: 'slurry_rate' },
  { event: 'treating pressure', trace: 'standpipe_pressure' },
  { event: 'closure pressure', trace: 'standpipe_pressure' },
  { event: 'shut down pumps', trace: 'slurry_rate' },
  { event: 'closure time', trace: 'standpipe_pressure' },
  { event: 'breakdown pressure', trace: 'standpipe_pressure' },
  { event: 'leakoff rate', trace: 'standpipe_pressure' },
  { event: 'ISIP', trace: 'standpipe_pressure' },
  { event: 'Bullhead rate', trace: 'slurry_rate' },
  { event: 'Propant start', trace: 'bh_proppant_conc' },
  { event: 'DH Proppant concentration at screenout', trace: 'bh_proppant_conc' },
  { event: 'Max surface proppant concentration', trace: 'bh_proppant_conc' },
  { event: 'Annular pressure when initial proppant hits perfs', trace: 'annular_back_pressure' },
  { event: 'max annulus pressure', trace: 'annular_back_pressure' },
  { event: 'annulus pressure at screenout', trace: 'annular_back_pressure' },
  { event: 'Screenout pressure', trace: 'rig_floor_treating_pressure' },
  { event: 'max treating rate', trace: 'slurry_rate' },
  { event: 'treating rate at screenout', trace: 'slurry_rate' },
  { event: 'return rate at screanout', trace: 'ann_flowmeter_1' },
];

export const TRACE_SOURCES = {
  SENSOR_TRACE: 'trace',
  MODEL_PREDICTION: 'predicted',
  DRM: 'drm',
  DOWNHOLE: 'downhole.sensor',
};

export const DEFAULT_SERIES = [
  {
    trackType: TRACE_SOURCES.SENSOR_TRACE,
    traceName: 'hole_depth',
    unitType: 'length',
    unit: 'ft',
    color: '#F50057',
    yAxisLabelVisible: true,
    sidePosition: 'left',
    isAutoScale: true,
  },
  {
    trackType: TRACE_SOURCES.SENSOR_TRACE,
    traceName: 'hook_load',
    unitType: 'force',
    unit: 'klbf',
    color: '#63AAFD',
    yAxisLabelVisible: true,
    sidePosition: 'left',
    isAutoScale: true,
  },
  {
    trackType: TRACE_SOURCES.SENSOR_TRACE,
    traceName: 'block_height',
    unitType: 'length',
    unit: 'ft',
    color: '#BBC6CC',
    yAxisLabelVisible: true,
    sidePosition: 'left',
    isAutoScale: true,
  },
];

export const DEFAULT_SENSOR_SERIES = [
  {
    trackType: TRACE_SOURCES.DOWNHOLE,
    traceName: 'pressure',
    unitType: 'pressure',
    unit: 'psi',
    color: '#1EDCC1',
    yAxisLabelVisible: true,
    sidePosition: 'right',
    isAutoScale: true,
  },
  {
    trackType: TRACE_SOURCES.DOWNHOLE,
    traceName: 'temperature',
    unitType: 'temperature',
    unit: 'F',
    color: '#CC2AFB',
    yAxisLabelVisible: true,
    sidePosition: 'right',
    isAutoScale: true,
  },
];

export const REF_POINT_NONE = 'None';

export const DEFAULT_SETTINGS = {
  traces: DEFAULT_SERIES,
  padMode: {},
  filtered_zones: [],
  filtered_phases: [],
  view_mode: VIEW_MODE_OPTIONS[0].value,
  view_dataset: DATASET_OPTIONS[0].value,
  time_range: {
    min: null,
    max: null,
    start_time: null,
    end_time: null,
  },
  offset_picker: {},
  ref_point: REF_POINT_NONE,
  invisible_legends: [],
  settings: {
    table: false,
    graph: true,
  },
};

export const TRACE_SOURCE_DEFINITIONS = [
  {
    label: 'Sensor Trace (WITSML)',
    value: TRACE_SOURCES.SENSOR_TRACE,
    tooltip: 'Mapped and unmapped WITSML channels',
  },
  {
    label: 'Corva Trace',
    value: TRACE_SOURCES.MODEL_PREDICTION,
    tooltip: 'Corva models and predicted data calculated by Corva',
  },
  {
    label: 'Roadmap Trace',
    value: TRACE_SOURCES.DRM,
    tooltip: 'DRM recommended parameters tracks',
  },
  {
    label: 'Sensor Data',
    value: TRACE_SOURCES.DOWNHOLE,
    tooltip: '',
  },
];

export const SUPPORTED_TRACES = sortBy(
  [
    {
      trace: 'weight_on_bit',
      label: 'Weight on Bit',
      unitType: 'force',
      unit: 'klbf',
      min: 0,
      max: 150,
    },
    {
      trace: 'hook_load',
      label: 'Hookload',
      unitType: 'force',
      unit: 'klbf',
      min: 0,
      max: 500,
    },
    {
      trace: 'rotary_rpm',
      label: 'RPM',
      unit: 'rpm',
      min: 0,
      max: 250,
    },
    {
      trace: 'rotary_torque',
      label: 'Rotary Torque',
      unitType: 'torque',
      unit: 'ft-klbf',
      min: 0,
      max: 50,
    },
    {
      trace: 'rop',
      label: 'ROP',
      unitType: 'velocity',
      unit: 'ft/h',
      min: 0,
      max: 500,
    },
    {
      trace: 'mud_flow_in',
      label: 'Flow In',
      unitType: 'volumeFlowRate',
      unit: 'gal/min',
      min: 0,
      max: 1000,
    },
    {
      trace: 'mud_flow_out',
      label: 'Flow Out',
      unitType: 'volumeFlowRate',
      unit: 'gal/min',
      min: 0,
      max: 1000,
    },
    {
      trace: 'standpipe_pressure',
      label: 'Standpipe Pressure',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 10000,
    },
    {
      trace: 'pump_spm_total',
      label: 'SPM',
      unit: 'spm',
      min: 0,
      max: 250,
    },
    {
      trace: 'mud_volume',
      label: 'MV',
      unitType: 'oil',
      unit: 'bbl',
      min: 0,
      max: 1000,
    },
    {
      trace: 'diff_press',
      label: 'Diff Press',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 1000,
    },
    {
      trace: 'block_height',
      label: 'Block Height',
      unitType: 'length',
      unit: 'ft',
      min: 0,
      max: 100,
    },
    {
      trace: 'bit_depth',
      label: 'Bit Depth',
      unitType: 'length',
      unit: 'ft',
    },
    {
      trace: 'hole_depth',
      label: 'Hole Depth',
      unitType: 'length',
      unit: 'ft',
    },
    {
      trace: 'gamma_ray',
      label: 'Gamma Ray',
      unit: 'api',
    },
  ],
  'label'
);

export const LINE_STYLE_OPTIONS = [
  { label: 'Solid', value: 'Solid' },
  { label: 'Dotted', value: 'Dot' },
  { label: 'Dashed', value: 'Dash' },
];

export const NO_FILL = 'noFill';
export const AREA_FILL = 'areaFill';
export const GRADIENT_FILL = 'gradientFill';
export const TRACE_FILL_OPTIONS = [
  { label: 'No Fill', value: NO_FILL },
  { label: 'Area Fill', value: AREA_FILL },
  { label: 'Gradient', value: GRADIENT_FILL },
];

export const DEFAULT_GRADIENTS = [
  {
    id: 'chromium',
    name: 'Chromium',
    gradientStops: [
      { color: '#F7F7F7', pos: 0 },
      { color: '#828282', pos: 100 },
    ],
  },
  {
    id: 'garden',
    name: 'Garden',
    gradientStops: [
      { color: '#5256BE', pos: 0 },
      { color: '#3CA3BD', pos: 25 },
      { color: '#18B756', pos: 50 },
      { color: '#DECF11', pos: 75 },
      { color: '#AF534C', pos: 100 },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    gradientStops: [
      { color: '#C05B5B', pos: 0 },
      { color: '#D6CA1D', pos: 50 },
      { color: '#14C23A', pos: 100 },
    ],
  },
  {
    id: 'amber',
    name: 'Amber',
    gradientStops: [
      { color: '#FFFBF4', pos: 0 },
      { color: '#C0A87D', pos: 25 },
      { color: '#E2A547', pos: 50 },
      { color: '#CA8846', pos: 75 },
      { color: '#6D4B48', pos: 100 },
    ],
  },
  {
    id: 'volcano',
    name: 'Volcano',
    gradientStops: [
      { color: '#807373', pos: 0 },
      { color: '#C56265', pos: 25 },
      { color: '#CA8846', pos: 50 },
      { color: '#CF9957', pos: 75 },
      { color: '#D7CD1F', pos: 100 },
    ],
  },
  {
    id: 'cave',
    name: 'Cave',
    gradientStops: [
      { color: '#FEFEF3', pos: 0 },
      { color: '#F5D09E', pos: 10 },
      { color: '#ED9F3B', pos: 30 },
      { color: '#B9421C', pos: 50 },
      { color: '#541106', pos: 75 },
      { color: '#050204', pos: 100 },
    ],
  },
];

// NOTE: Please note if you add new predicted trace - don't forget
// to add a mapping to COLLECTION_TO_TVD_FIELD
export const PREDICTED_TRACES = sortBy(
  [
    {
      trace: 'annulus_pressure_loss',
      label: 'Annulus Pressure Loss',
      collection: 'hydraulics.pressure-loss',
      path: 'predicted_annulus_pressure_loss',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 10000,
    },
    {
      trace: 'diff_press',
      label: 'Diff Press',
      collection: 'torque-and-drag.predictions',
      path: 'differential_pressure',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 3000,
    },
    {
      trace: 'downhole_mse',
      label: 'Downhole MSE',
      collection: 'torque-and-drag.predictions',
      path: 'predicted_downhole_mse',
      unitType: 'msePressure',
      unit: 'psi',
      min: 0,
      max: 1000,
    },
    {
      trace: 'ecd_at_bit',
      label: 'Corva ECD at Bit',
      collection: 'hydraulics.pressure-loss',
      path: 'predicted_ecd_at_bit',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 10000,
    },
    {
      trace: 'predicted_ecd_at_casing',
      label: 'Corva ECD at Casing',
      collection: 'hydraulics.pressure-loss',
      path: 'predicted_ecd_at_casing',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 10000,
    },
    {
      trace: 'hook_load',
      label: 'Hookload',
      collection: 'torque-and-drag.predictions',
      path: 'predicted_hookload',
      unitType: 'force',
      unit: 'klbf',
      min: 0,
      max: 500,
    },
    {
      trace: 'recommended_minimum_flowrate',
      label: 'Minimum Recommended Flowrate',
      collection: 'hydraulics.overview',
      path: 'recommended_minimum_flowrate',
      unitType: 'volumeFlowRate',
      unit: 'gal/min',
      min: 0,
      max: 1000,
    },
    {
      trace: 'surface_torque',
      label: 'Rotary Torque',
      collection: 'torque-and-drag.predictions',
      path: 'predicted_surface_torque',
      unitType: 'torque',
      unit: 'ft-klbf',
      min: 0,
      max: 50,
    },
    {
      trace: 'pdm_rpm',
      label: 'PDM RPM',
      collection: 'pdm.operating-condition',
      path: 'rpm',
      unit: 'rpm',
      min: 0,
      max: 250,
    },
    {
      trace: 'pdm_torque',
      label: 'PDM Torque',
      collection: 'pdm.operating-condition',
      path: 'torque',
      unitType: 'torque',
      unit: 'ft-klbf',
      min: 0,
      max: 50,
    },
    {
      trace: 'standpipe_pressure',
      label: 'Standpipe Pressure',
      collection: 'hydraulics.pressure-loss',
      path: 'predicted_standpipe_pressure',
      unitType: 'pressure',
      unit: 'psi',
      min: 0,
      max: 10000,
    },
    {
      trace: 'total_bit_rpm',
      label: 'Total Bit RPM',
      collection: 'pdm.operating-condition',
      path: 'total_bit_rpm',
      unit: 'rpm',
      min: 0,
      max: 250,
    },
    {
      trace: 'total_bit_torque',
      label: 'Total Bit Torque',
      collection: 'torque-and-drag.predictions',
      path: 'downhole_torque',
      unitType: 'torque',
      unit: 'ft-klbf',
      min: 0,
      max: 50,
    },
    {
      trace: 'bit_aggressivity',
      label: 'Bit Aggressivity',
      collection: 'torque-and-drag.downhole-transfer',
      path: 'downhole.bit_aggressivity',
    },
    {
      trace: 'downhole_weight_on_bit',
      label: 'Downhole Weight on Bit',
      collection: 'torque-and-drag.predictions',
      path: 'downhole_weight_on_bit',
      unitType: 'force',
      unit: 'klbf',
    },
    {
      trace: 'depth_of_cut',
      label: 'Depth of Cut',
      collection: 'torque-and-drag.predictions',
      path: 'depth_of_cut',
      unitType: 'lengthPerAngle',
      unit: 'in/rev',
    },
  ],
  'label'
);

export const DRM_TRACES = sortBy(
  [
    {
      trace: 'mse',
      label: 'MSE',
      path: ['mse'],
      unitType: 'msePressure',
      unit: 'psi',
    },
    {
      trace: 'diff_press',
      label: 'Diff Press',
      path: ['diff_press'],
      unitType: 'pressure',
      unit: 'psi',
    },
    {
      trace: 'torque',
      label: 'Rotary Torque',
      path: ['torque'],
      unitType: 'torque',
      unit: 'ft-klbf',
    },
    {
      trace: 'rop',
      label: 'ROP',
      path: ['rop'],
      unitType: 'velocity',
      unit: 'ft/h',
    },
    {
      trace: 'rpm',
      label: 'RPM',
      path: [
        ['from', 'rpm'],
        ['to', 'rpm'],
      ], // NOTE: calculate the average value
    },
    {
      trace: 'wob',
      label: 'Weight on Bit',
      path: [
        ['from', 'wob'],
        ['to', 'wob'],
      ], // NOTE: calculate the average value
      unitType: 'force',
      unit: 'klbf',
    },
  ],
  'label'
);

export const SUPPORTED_FILE_MIME_TYPES = ['text/csv', 'text/plain'];
export const TASK_STATE = {
  none: 'none',
  fileSelected: 'file_selected',
  fileUploading: 'file_uploading',
  fileUploaded: 'file_uploaded',
  fileUploadError: 'file_upload_error',
  succeeded: 'succeeded',
  failed: 'failed',
};

export const DEFAULT_TRACE_COLORS = [
  { label: 'Hook Load', unitType: 'force', lineStyle: 'Solid', color: '#63AAFD' },
  { label: 'Block height', unitType: 'length', lineStyle: 'Solid', color: '#BBC6CC' },
  { label: 'Blk height', unitType: 'length', lineStyle: 'Solid', color: '#BBC6CC' },
  { label: 'Bit Depth', unitType: 'length', lineStyle: 'Solid', color: '#6E6E6E' },
  { label: 'Mud Flow In', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#598162' },
  { label: 'Standpipe', unitType: 'pressure', lineStyle: 'Solid', color: '#F0B3DF' },
  { label: 'Cement Pressure', unitType: 'pressure', lineStyle: 'Solid', color: '#F6377C' },
  { label: 'Cement rate', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#3C79F4' },
  { label: 'E-Choke', unitType: 'pressure', lineStyle: 'Solid', color: '#FBB368' },
  { label: 'Trip Tank 1', unitType: 'oil', lineStyle: 'Solid', color: '#1EDCC1' },
  { label: 'Trip Tank 2', unitType: 'oil', lineStyle: 'Solid', color: '#78FEEA' },
  {
    label: 'Rig Floor Treating Pressure',
    unitType: 'pressure',
    lineStyle: 'Solid',
    color: '#EB3F24',
  },
  { label: 'Backside Pressure', unitType: 'pressure', lineStyle: 'Solid', color: '#FF8200' },
  { label: '2in Flow 1', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#0295AA' },
  { label: '2in Flow 2', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#06BFD8' },
  { label: '3in Flow 3', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#6F9BF0' },
  { label: '3in Flow 4', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#97B7F9' },
  { label: 'Slurry Rate', unitType: 'oilFlowRate', lineStyle: 'Solid', color: '#0753EB' },
  {
    label: 'BH Proppant Conc',
    unitType: 'massConcentration',
    lineStyle: 'Solid',
    color: '#486539',
  },
  {
    label: 'Slurry Proppant Conc',
    unitType: 'massConcentration',
    lineStyle: 'Solid',
    color: '#92C976',
  },
  { label: 'Ann Hydro to PKR', unitType: 'pressure', lineStyle: 'Solid', color: '#BCBCBC' },
  { label: 'Ann Pull to Rev', unitType: 'pressure', lineStyle: 'Solid', color: '#FF8200' },
  { label: 'Tubing Bleed pressure', unitType: 'pressure', lineStyle: 'Dash', color: '#EB3F24' },
  { label: 'Injectivity', unitType: 'pressure', lineStyle: 'Solid', color: '#01A053' },
  { label: 'BHP Tbg', unitType: 'pressure', lineStyle: 'Dash', color: '#A63508' },
  { label: 'BHP Ann', unitType: 'pressure', lineStyle: 'Dash', color: '#693400' },
  { label: 'Hydrostatic', unitType: 'pressure', lineStyle: 'Solid', color: '#494747' },
  { label: 'BHPann-BHPtbg', unitType: 'pressure', lineStyle: 'Dot', color: '#EEEBEB' },
  { label: 'Pump kick outs', unitType: 'pressure', lineStyle: 'Dot', color: '#EB3F24' },
  { label: 'Total slurry', unitType: 'oil', lineStyle: 'Dot', color: '#0753EB' },
  {
    label: 'Stage slurry volume',
    unitType: 'oil',

    lineStyle: 'Solid',
    color: '#5BAA1A',
  },
  {
    label: 'Slurry Stage Size',
    unitType: 'oil',

    lineStyle: 'Solid',
    color: '#5BAA1A',
  },
  {
    label: 'Slurry left in Stage',
    unitType: 'oil',

    lineStyle: 'Solid',
    color: '#84B55B',
  },
  { label: 'Stage at wellhead', lineStyle: 'Solid', color: '#EBD95A' },
  { label: 'Stage at Top Perf', lineStyle: 'Solid', color: '#887B02' },
  {
    label: 'P-Max GP assemblies Live Ann',
    unitType: 'pressure',
    lineStyle: 'Dot',
    color: '#EB3F24',
  },
  { label: 'Proppant in Wellbore', unitType: 'massFlowRate', lineStyle: 'Solid', color: '#8A1CAA' },
  {
    label: 'Proppant in Formation or Below Crossover',
    unitType: 'massFlowRate',
    lineStyle: 'Solid',
    color: '#CC2AFB',
  },
  { label: 'Proppant Pumped', unitType: 'massFlowRate', lineStyle: 'Solid', color: '#E488FF' },
  { label: 'BHG WP Lower Psi', unitType: 'pressure', lineStyle: 'Solid', color: '#4D2FBF' },
  { label: 'BHG WP Lower Temp', unitType: 'temperature', lineStyle: 'Dot', color: '#4D2FBF' },
  { label: 'BHG WP Middle Psi', unitType: 'pressure', lineStyle: 'Solid', color: '#714CFF' },
  { label: 'BHG WP Middle Temp', unitType: 'temperature', lineStyle: 'Dot', color: '#714CFF' },
  { label: 'BHG WP Upper Psi', unitType: 'pressure', lineStyle: 'Solid', color: '#AD99FB' },
  { label: 'BHG WP Upper Temp', unitType: 'temperature', lineStyle: 'Dot', color: '#AD99FB' },
  { label: 'BHG WS Ann Psi', unitType: 'pressure', lineStyle: 'Solid', color: '#BA6304' },
  { label: 'BHG WS Ann Temp', unitType: 'temperature', lineStyle: 'Dot', color: '#BA6304' },
  { label: 'BHG WS Tub Psi', unitType: 'pressure', lineStyle: 'Solid', color: '#9B2310' },
  { label: 'BHG WS Tub Temp', unitType: 'temperature', lineStyle: 'Dot', color: '#9B2310' },
];
