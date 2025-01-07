export const NAME = 'alerts';

export const ADD_NEW_ALERTS = 'ADD_NEW_ALERTS';
export const DELETE_NEW_ALERT = 'DELETE_NEW_ALERT';
export const CLEAR_NEW_ALERTS = 'CLEAR_NEW_ALERTS';

export const ALERT_DEFINITION_TYPES = {
  company: { value: 'company', label: 'Company' },
  personal: { value: 'personal', label: 'Personal' },
};

export const ALERT_DEFINITION_MODES = {
  advanced: 'advanced',
  simple: 'simple',
};

export const DESKTOP_ALERT_NOTIFICATION_TYPE = 'desktop';
export const BANNER_ALERT_NOTIFICATION_TYPE = 'banner';

export const ALERT_NOTIFICATION_TYPE_USER_PREFERENCES = {
  email: {
    label: 'Email',
    userPreferencesKey: 'emails_enabled',
  },
  mobile: {
    label: 'Mobile App notifications',
    userPreferencesKey: 'push_notifications_enabled',
  },
  sms: {
    label: 'SMS/Text Message',
    userPreferencesKey: 'sms_enabled',
  },
};

export const ALERT_LEVELS = [
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'CRITICAL', label: 'Critical' },
];

export const ALERT_LEVEL_COLOR = {
  INFO: 'rgb(119, 195, 241)',
  WARNING: 'rgb(242, 192, 70)',
  CRITICAL: 'rgb(237, 70, 48)',
};

export const ALERTS = {
  SUBSCRIPTIONS: [
    {
      collection: 'alerts',
    },
  ],
};

const VALUE_PATHS = {
  directional: [
    {
      label: 'Distance to plan',
      value: 'directional.accuracy.data.accuracy.distance_to_plan',
    },
    {
      label: 'Dogleg Severity',
      value: 'directional.trend.data.last_dls.dls',
    },
    {
      label: 'High/Low divergence from plan',
      value: 'directional.accuracy.data.recommendation.high',
    },
    {
      label: 'Right/Left divergence from plan',
      value: 'directional.accuracy.data.recommendation.right',
    },
  ],

  hydraulics: [
    {
      label: 'Annulus Pressure Loss',
      value: 'hydraulics.pressure-loss.data.predicted_annulus_pressure_loss',
    },
    {
      label: 'Bit HSI',
      value: 'hydraulics.pressure-loss.data.bit_hsi',
    },
    {
      label: 'Bit Jet Impact Force',
      value: 'hydraulics.pressure-loss.data.bit_jet_impact_force',
    },
    {
      label: 'ECD at Bit',
      value: 'hydraulics.pressure-loss.data.predicted_ecd_at_bit',
    },
    {
      label: 'ECD at Casing',
      value: 'hydraulics.pressure-loss.data.predicted_ecd_at_casing',
    },
    {
      label: 'Minimum Recommended Flowrate',
      value: 'hydraulics.overview.data.recommended_minimum_flowrate',
    },
    {
      label: 'Predicted Standpipe Pressure',
      value: 'hydraulics.pressure-loss.data.predicted_standpipe_pressure',
    },
    {
      label: 'Standpipe Pressure',
      value: 'hydraulics.pressure-loss.data.standpipe_pressure',
    },
  ],

  pdm: [
    {
      label: 'Bit RPM',
      value: 'pdm.operating-condition.data.total_bit_rpm',
    },
    {
      label: 'Bit Torque',
      value: 'pdm.operating-condition.data.total_bit_torque',
    },
    {
      label: 'Diff Press',
      value: 'pdm.operating-condition.data.differential_pressure',
    },
    {
      label: 'PDM RPM',
      value: 'pdm.operating-condition.data.rpm',
    },
    {
      label: 'PDM Torque',
      value: 'pdm.operating-condition.data.torque',
    },
  ],

  torqueAndDrag: [
    {
      label: 'Bit Aggressivity',
      value: 'torque-and-drag.downhole-transfer.data.downhole.bit_aggressivity',
    },
    {
      label: 'Drag Severity',
      value: 'torque-and-drag.overview.data.drag.severity',
    },
    {
      label: 'Predicted Surface Torque',
      value: 'torque-and-drag.predictions.data.predicted_surface_torque',
    },
    {
      label: 'Predicted Downhole Torque',
      value: 'torque-and-drag.predictions.data.downhole_torque',
    },
  ],

  wits: [
    {
      label: 'BH',
      value: 'wits.data.block_height',
    },
    {
      label: 'Bit Depth',
      value: 'wits.data.bit_depth',
    },
    {
      label: 'Diff Press',
      value: 'wits.data.diff_press',
    },
    {
      label: 'Flow In',
      value: 'wits.data.mud_flow_in',
    },
    {
      label: 'Flow Out',
      value: 'wits.data.mud_flow_out',
    },
    {
      label: 'Flow Out %',
      value: 'wits.data.mud_flow_out_percent',
    },
    {
      label: 'Hole Depth',
      value: 'wits.data.hole_depth',
    },
    {
      label: 'Hookload',
      value: 'wits.data.hook_load',
    },
    {
      label: 'MV',
      value: 'wits.data.mud_volume',
    },
    {
      label: 'ROP',
      value: 'wits.data.rop',
    },
    {
      label: 'Rotary Torque',
      value: 'wits.data.rotary_torque',
    },
    {
      label: 'RPM',
      value: 'wits.data.rotary_rpm',
    },
    {
      label: 'SPM',
      value: 'wits.data.pump_spm_total',
    },
    {
      label: 'Standpipe Pressure',
      value: 'wits.data.standpipe_pressure',
    },
    {
      label: 'Weight on Bit',
      value: 'wits.data.weight_on_bit',
    },
  ],
};

const VALUE_PATHS_WITH_SECTIONS = [
  { label: 'Directional:' },
  ...VALUE_PATHS.directional,

  { label: 'Hydraulics:' },
  ...VALUE_PATHS.hydraulics,

  { label: 'PDM:' },
  ...VALUE_PATHS.pdm,

  { label: 'Torque and Drag:' },
  ...VALUE_PATHS.torqueAndDrag,

  { label: 'WITS:' },
  ...VALUE_PATHS.wits,
];

export const ADVANCED_MODE_VALUE_PATHS = VALUE_PATHS_WITH_SECTIONS.map(({ label, value }) => ({
  label: `${label}${value ? ` (${value})` : ''}`,
  value,
}));

export const SIMPLE_MODE_VALUE_PATHS = [...VALUE_PATHS_WITH_SECTIONS];

// NOTE: Based on time units of 'corva-convert-units' package
export const TIME_UNITS = {
  s: 's',
  min: 'min',
  h: 'h',
  d: 'd',
};

export const RECURRENCES = [
  { value: 'continuous', label: 'Continuous' },
  { value: 'once-per-asset', label: 'Once Per Asset' },
  { value: 'once', label: 'Once' },
  { value: 'periodic', label: 'Periodic' },
];

export const COMBINE_LOGICS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
];

export const OPERATORS = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '~', label: '~' },
  { value: '!~', label: '!~' },
];

export const SAMPLING_FUNCTIONS = [
  { value: 'average', label: 'Average' },
  { value: 'median', label: 'Median' },
  { value: 'count', label: 'Count' },
  { value: 'percentage', label: '% Change' },
  { value: 'minimum', label: 'Minimum' },
  { value: 'maximum', label: 'Maximum' },
  { value: 'value', label: 'Any Match' },
];

export const DATE_RANGE_FILTERS = [
  // NOTE: Order matters in Alerts filters and withAlertsSubscriptionHOC
  { label: 'All', value: 'all' },
  { label: 'Last 12 hours', value: 'last12hours' },
  { label: 'Last 24 hours', value: 'last24hours' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'Custom', value: 'custom' },
];

export const DATE_RANGE_FILTERS_BY_KEYS = DATE_RANGE_FILTERS.reduce(
  (result, item) => ({ ...result, [item.value]: item }),
  {}
);
export const ADD_ALERT_BANNERS = 'ADD_ALERT_BANNERS';
export const REMOVE_ALERT_BANNER = 'REMOVE_ALERT_BANNER';
export const ADD_ALERT_BANNER_SOUND = 'ADD_ALERT_BANNER_SOUND';
export const REMOVE_ALERT_BANNER_SOUND = 'REMOVE_ALERT_BANNER_SOUND';

export const isAlertBannerEnabled = currentUser =>
  currentUser &&
  [
    'Corva',
    'Corva Default Company Do Not Use',
    'Chevron',
    'Default Company',
    'Sai Company',
    'Shell',
    'Southwestern',
    'Completion Company',
  ].includes(currentUser.getIn(['company', 'name']));
