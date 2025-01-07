import {
  SLIPS_TO_SLIPS_GOAL,
  BOTTOM_TO_SLIPS_GOAL,
  WEIGHT_TO_WEIGHT_GOAL,
  SLIPS_TO_BOTTOM_GOAL,
} from './goals';

export const NAME = 'apps';

export const LOAD_APPS = 'LOAD_APPS';

// On grid constants, see https://www.npmjs.com/package/react-grid-layout

// Screen width breakpoints in pixels. The names are arbitrary but match those
// in GRID_COLUMN_SIZES.
export const GRID_BREAKPOINTS = {
  general: {
    large: 1024,
    medium: 512,
    small: 0,
  },
  // We should use this because of used Responsive provider for
  // react-grid-layout. In case when phone detected there are should be
  // single column in both horizontal and vertical mode
  phone: {
    small: 0,
  },
};

// How wide the grid is, in columns, for each of the supported screen sizes.
// The pixel sizes of columns are dynamic, based on current screen width.
export const GRID_COLUMN_SIZES = {
  large: 12,
  medium: 12,
  small: 1,
};

export const DEFAULT_GRID_LAYOUT_PADDING = 10;

// NOTE: Elements matching this selector won't be used by react-grid-layout to trigger drag events
export const NON_DRAGGABLE_ELEMENT_SELECTOR = [
  'button',
  'a',
  'input',
  'textarea',
  'li',
  'table',
  'tbody',
  'thead',
  'tr',
  'td',
  'label',
  'canvas', // NOTE: disable app dragging on eCharts
  // NOTE: Dependencies class names
  '.MuiButtonBase-root',
  '.MuiInputBase-root',
  '.MuiDialog-paper',
  '.MuiFormControlLabel-label',
  '.MuiSlider-root',
  '.ReactVirtualized__Table',
  '.leaflet-container',
  // NOTE: Internal class names
  '.c-slider',
  '.c-modal',
  '.c-tvs__container',
].join(',');

// How many pixels high each "row" is in the grid.
// App heights are measured in rows. For height 5, height in pixels
// is 5 * GRID_ROW_HEIGHT.
export const GRID_ROW_HEIGHT = 30;

// Orientation settings options used by a number of apps.
export const ORIENTATION_SETTINGS = [
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Horizontal',
    value: 'horizontal',
  },
  {
    label: 'Vertical',
    value: 'vertical',
  },
];

export const FILTERING_MODES = [
  {
    label: 'Dont show',
    value: 'dont_show',
  },
  {
    label: 'Dim',
    value: 'dim',
  },
];

export const REPORT_APP_GRID_TYPES = {
  NORMAL: {
    type: 'normal',
    columns: {
      min: 1,
      max: 7,
    },
    rows: {
      min: 1,
      max: 1000,
    },
    slots: 1,
  },
  WIDE: {
    type: 'wide',
    columns: {
      min: 8,
      max: 12,
    },
    rows: {
      min: 1,
      max: 25,
    },
    slots: 2,
  },
  HALFSCREEN: {
    type: 'halfscreen',
    columns: {
      min: 8,
      max: 12,
    },
    rows: {
      min: 26,
      max: 40,
    },
    slots: 4,
  },
  FULLSCREEN: {
    type: 'fullscreen',
    columns: {
      min: 8,
      max: 12,
    },
    rows: {
      min: 41,
      max: 1000, // NOTE: No limit
    },
    slots: 8,
  },
};

export const DEFAULT_APP_SIZE = { w: 4, h: 10 };

// NOTE: Object where keys and values are the same
export const APP_KEYS = [
  'circulation-volumetric',
  'pdm-overview',
  'hydraulics-overview',
  'torqueAndDrag-broomstick',
  'torqueAndDrag-axialLoad',
  'torqueAndDrag-dowholeTransfer',
  'torqueAndDrag-frictionFactor',
  'torqueAndDrag-stress',
  'torqueAndDrag-torque',
  'drillingEfficiency-mseHeatmap',
  'drillingEfficiency-mseVDepth',
  'drillingEfficiency-gammaVDepth',
  'drillingEfficiency-optimization',
  'drillingEfficiency-ropHeatmap',
  'corva.driller-roadmap',
  'drillingEfficiency-wobFounder',
  'parameter-crossplot',
  'parameter-comparison',
  'dpFounder',
  'directional-trend',
  'directional-accuracy',
  'directional-wellPlan',
  'directional-toolFaceOrientation',
  'directional-slideSheet',
  'corva.trip-sheet-ui',
  'directional-tool-face-depth',
  'directional-rotational-tendencies',
  'directional-surveys',
  'directional-tortuosityIndex',
  'directional-rotary-trend-analysis',
  'corva.bit-projection-ui',
  'corva.directional-guidance-ui',
  'corva.traces',
  'settings-generalInfo',
  'settings-drillstrings',
  'settings-casing',
  'settings-actualSurveys',
  'settings-planSurveys',
  'settings-fluidChecks',
  'settings-costs',
  'stageDesign',
  'settings-map',
  'settings-formations',
  'settings-crewsContact',
  'settings-nptEvents',
  'settings-operationSummaries',
  'settings-filesDocuments',
  'settings-wellSections',
  'operationSummaries',
  'settings-operationDiaries',
  'settings-surfaceEquipment',
  'settings-userEvents',
  'settings-offsetWells',
  'settings-AFE',
  'settings-pressureGradient',
  'rigActivity',
  'drillingOperations',
  'depthVersusDays',
  'operationSummary',
  'non-productive-app',
  'corva.rop-performance',
  'corva.visualizer',
  'corva.metrics-ui',
  'corva.bha-optimization',
  'corva.asset-status',
  'corva.multi-asset-status',
  'corva.asset-daily-metrics',
  'wellboreStability-mwWindow',
  'wellboreStability-surgeAndSwab',
  'hydraulics-annularFlowRegime',
  'bedHeight',
  'concentration',
  'minimumFlowRate',
  'hydraulics-pressureLoss',
  'hydraulics-pressureTrend',
  'hydraulics-annularVelocity',
  'hydraulics-bitHydraulics',
  'mud-weight-vs-depth',
  'pdm-operatingCondition',
  'stallsHistory',
  'corva.well-checkup-ui',
  'corva.completion.settings-generalInfo',
  'corva.completion.settings-costs',
  'corva.completion.settings-crewsContact',
  'corva.completion.settings-nptEvents',
  'corva.completion.settings-operationSummaries',
  'corva.completion.settings-filesDocuments',
  'corva.completion.settings-jobSettings',
  'corva.completion.settings-timeLog',
  'corva.completion.settings-well-goals-ui',
  'corva.completion.settings-stageDesign',
  'corva.completion.settings-stageActual',
  'corva.completion.settings-plugs',
  'corva.completion.asset-status',
  'corva.completion.key-comparison',
  'corva.completion.prc',
  'corva.completion.tvd-v-md',
  'corva.completion.well-comparison',
  'corva.completion.stage-design-actual',
  'corva.completion.activity-detection',
  'corva.completion.parameter-crossplot',
  'corva.completion.pad-analysis',
  'corva.completion.chemicals',
  'corva.completion.proppants',
  'jobSettings',
  'stageDesign',
  'well3D',
  'corva.completion.metrics',
  'corva.completion.non-productive-events',
  'corva.procedural-compliance-ui',
  'corva.tripping-speeds',
  'corva.completion.wireline-traces',
  'corva.completion.wireline-times',
  'corva.completion-wireline-parameters-ui',
  'corva.completion.swap-over-times',
  'corva.drillout.parameter-sheet',
  'corva.completion.flush',
  'corva.completion.pad-metrics-ui',
  'corva.geosteering-ui',
  'corva.completion.heatmap-ui',
  'corva.kpi-visualizer-ui',
  'corva.geosteering.settings-upload-ui',
  'corva.drillout.annular-flow-regime-ui',
  'corva.drillout.bit-hydraulics-ui',
  'corva.drillout.hookload-broomstick-ui',
  'corva.drillout.calcuated-annular-velocity-ui',
  'competitor-analysis-ui',
  'corva.drillout.torque-and-drag-ui',
  'corva.drillout.rig-operations-ui',
  'corva.drillout.rig-activity-ui',
  'corva.drillout.von-mises-stress-ui',
  'corva.drillout.buckling-load-ui',
  'corva.drillout.circulating-pressure-loss-ui',
  'corva.drillout.circulating-pressure-trend-ui',
  'corva.drillout.asset-status-ui',
  'corva.drillout.days-vs-depth-cost-ui',
  'corva.completion.settings-surfaceEquipment',
  'corva.completion.settings-fluidChecks',
  'corva.completion.settings-drillstrings',
  'corva.drillout.traces-ui',
  'corva.leaderboard-ui',
  'corva.completion.settings-AFE',
  'corva.formationevaluation-LAS-upload',
  'corva.fingerprinting-ui',
  'corva.formationevaluation-ui',
  'corva.well-optimization-ui',
  'corva.well-schematic-ui',
  'corva.auto-driller',
].reduce((result, appName) => ({ ...result, [appName]: appName }), {});

export const RIG_OPS_TYPES = {
  trippingInConn: 0,
  trippingInRun: 1,
  trippingOutConn: 2,
  trippingOutRun: 3,
  sTos: 4,
  wTowComplex: 5,
  wTowSimple: 6,
  treatment: 7,
  drillingTime: 8,
  bTos: 16,
  sTob: 17,
  wTowDetailed: 100,
  bTosDetailed: 101,
  sTobDetailed: 102,
  pumpsToOnBottom: 22,
};

export const SUPPORTED_DRILLING_OPERATIONS = {
  [RIG_OPS_TYPES.trippingInConn]: {
    type: 0,
    value: RIG_OPS_TYPES.trippingInConn,
    title: 'Tripping In (Connection)',
    description: 'Pipe connection time from slips to slips.',
    color: '#e0510b',
  },

  [RIG_OPS_TYPES.trippingInRun]: {
    type: 1,
    value: RIG_OPS_TYPES.trippingInRun,
    title: 'Tripping In (Running)',
    description: 'Pipe moving time for entire joint/stand.',
    color: '#f70000',
  },

  [RIG_OPS_TYPES.trippingOutConn]: {
    type: 2,
    value: RIG_OPS_TYPES.trippingOutConn,
    title: 'Tripping Out (Connection)',
    description: 'Pipe connection time from slips to slips.',
    color: '#88450f',
  },

  [RIG_OPS_TYPES.trippingOutRun]: {
    type: 3,
    value: RIG_OPS_TYPES.trippingOutRun,
    title: 'Tripping Out (Running)',
    description: 'Pipe moving time for entire joint/stand.',
    color: '#940000',
  },

  [RIG_OPS_TYPES.sTos]: {
    type: 4,
    value: RIG_OPS_TYPES.sTos,
    title: 'Slips To Slips',
    description: 'Pipe connection time from slips to slips.',
    color: '#0ad4db',
    key: SLIPS_TO_SLIPS_GOAL,
  },

  [RIG_OPS_TYPES.wTowComplex]: {
    type: 5,
    value: RIG_OPS_TYPES.wTowComplex,
    title: 'Weight To Weight',
    description: 'Full drilling connection from weight on-bottom to weight on-bottom.',
    color: '#41c980',
    key: WEIGHT_TO_WEIGHT_GOAL,
  },

  [RIG_OPS_TYPES.wTowSimple]: {
    type: 5,
    value: RIG_OPS_TYPES.wTowSimple,
    title: 'Weight To Weight (Simplified)',
    description: 'Full drilling connection from weight on-bottom to weight on-bottom.',
    color: '#41c980',
    key: WEIGHT_TO_WEIGHT_GOAL,
  },

  [RIG_OPS_TYPES.wTowDetailed]: {
    type: 5,
    value: RIG_OPS_TYPES.wTowDetailed,
    title: 'Weight To Weight (Detailed)',
    description: 'Full drilling connection from weight on-bottom to weight on-bottom.',
    color: '#41c980',
    key: WEIGHT_TO_WEIGHT_GOAL,
  },

  [RIG_OPS_TYPES.treatment]: {
    type: 6,
    value: RIG_OPS_TYPES.treatment,
    title: 'Treatment',
    description: 'Washing, reaming, and circulating time during a Weight to Weight operation.',
    color: '#9500b7',
  },

  [RIG_OPS_TYPES.drillingTime]: {
    type: 7,
    value: RIG_OPS_TYPES.drillingTime,
    title: 'Drilling Time',
    description: 'Rotary or slide drilling time for entire joint/stand.',
    color: '#4840d1',
  },

  [RIG_OPS_TYPES.bTos]: {
    type: 16,
    value: RIG_OPS_TYPES.bTos,
    title: 'On Bottom To Slips',
    description: 'Time from weight on-bottom to in slips.',
    color: '#41c9b4',
    key: BOTTOM_TO_SLIPS_GOAL,
  },

  [RIG_OPS_TYPES.bTosDetailed]: {
    type: 16,
    value: RIG_OPS_TYPES.bTosDetailed,
    title: 'On Bottom To Slips (Detailed)',
    description: 'Time from weight on-bottom to in slips.',
    color: '#41c9b4',
    key: BOTTOM_TO_SLIPS_GOAL,
  },

  [RIG_OPS_TYPES.sTob]: {
    type: 17,
    value: RIG_OPS_TYPES.sTob,
    title: 'Slips To On Bottom',
    description: 'Time from slips to on-bottom weight.',
    color: '#127868',
    key: SLIPS_TO_BOTTOM_GOAL,
  },

  [RIG_OPS_TYPES.sTobDetailed]: {
    type: 17,
    value: RIG_OPS_TYPES.sTobDetailed,
    title: 'Slips To On Bottom (Detailed)',
    description: 'Time from slips to on-bottom weight.',
    color: '#127868',
    key: SLIPS_TO_BOTTOM_GOAL,
  },

  [RIG_OPS_TYPES.pumpsToOnBottom]: {
    type: 22,
    value: RIG_OPS_TYPES.pumpsToOnBottom,
    title: 'Pumps on to Bottom',
    description: 'Time from pumps on to on-bottom weight.',
    color: '#FAEF00',
  },

  // {type: 8, title: 'Running Casing (Setting)', description: '', color: '#e837f3'},
  // {type: 9, title: 'Running Casing', description: '', color: '#f8a2fd'},
  // {type: 10, title: 'Cementing', description: '', color: '#47c7cf'},
  // {type: 11, title: 'Total Casing Time', description: '', color: '#f8a2fd'},
  // {type: 12, title: 'Total Trip Time', description: '', color: '#630a0a'},
  // {type: 13, title: 'Full Trip In', description: '', color: '#f70000'},
  // {type: 14, title: 'Full Trip Out', description: '', color: '#940000'},
  // {type: 15, title: 'Change BHA', description: '', color: '#d2dfd8'},
};

export const DEFAULT_DRILLING_OPERATION_TYPE = 0;

export const APPS_TYPES = ['ui', 'stream'].reduce(
  (result, appsType) => ({ ...result, [appsType]: appsType }),
  {}
);

export const APP_VISIBILITY = {
  private: 'private',
  developer: 'developer',
  company: 'company',
  public: 'public',
};

export const APP_VISIBILITY_META = {
  [APP_VISIBILITY.private]: {
    label: 'Private',
    color: '#15BBD1',
    hintText: 'Not Visible in App Store',
  },
  [APP_VISIBILITY.developer]: {
    label: 'Developer',
    color: '#DF9C19',
    hintText: 'Visible only to Developers in my company',
  },
  [APP_VISIBILITY.company]: {
    label: 'Company',
    color: '#27CAA3',
    hintText: 'Visible to all users in my company',
  },
  [APP_VISIBILITY.public]: {
    label: 'Public',
    color: '#A762FF',
    hintText: 'Visible for all Corva customers',
  },
};
