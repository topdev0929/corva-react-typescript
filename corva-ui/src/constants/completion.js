export const ACTIVITIES = [
  {
    name: 'Pressure Testing',
    key: 'pressure testing',
    isFlatTime: true,
    color: '#FFF350',
  },
  {
    name: 'Pump Off',
    key: 'pump off',
    isFlatTime: true,
    color: '#939E98',
  },
  {
    name: 'Fracturing',
    key: 'fracturing',
    isFlatTime: false,
    color: '#429FF8',
  },
  {
    name: 'Pad',
    key: 'pad',
    isFlatTime: false,
    color: '#FF8260',
  },
  {
    name: 'Flush',
    key: 'flush',
    isFlatTime: false,
    color: '#10EAF0',
  },
];

export const WIRELINE_ACTIVITIES = [
  {
    name: 'Pull out of Hole',
    key: 'pull out of hole',
    isFlatTime: false,
    color: '#800080',
  },
  {
    name: 'Plug and Perf',
    key: 'plug and perf',
    isFlatTime: false,
    color: '#FFA500',
  },
  {
    name: 'Run in Hole',
    key: 'run in hole',
    isFlatTime: false,
    color: '#00008B',
  },
  {
    name: 'Static',
    key: 'static',
    isFlatTime: false,
    color: '#D3D3D3',
  },
  {
    name: 'Out of Hole',
    key: 'out of hole',
    isFlatTime: false,
    color: '#FFC0CB',
  },
];

export const WIRELINE_BREAKDOWN_ACTIVITIES = [
  {
    name: 'Pull out of Hole (VT)',
    key: 'pull out of hole vertical',
    isFlatTime: false,
    color: '#EB3447',
  },
  {
    name: 'Pull out of Hole (HZ)',
    key: 'pull out of hole horizontal',
    isFlatTime: false,
    color: '#ED602A',
  },
  {
    name: 'Run in Hole (VT)',
    key: 'run in hole vertical',
    isFlatTime: false,
    color: '#390099',
  },
  {
    name: 'Run in Hole (HZ)',
    key: 'run in hole horizontal',
    isFlatTime: false,
    color: '#6150C1',
  },
  {
    name: 'Static',
    key: 'static',
    isFlatTime: false,
    color: '#FFBD00',
  },
];

export const FLUIDS_TYPES = [
  {
    name: 'HVFR Low',
    key: 'hvfr_low',
    unitType: 'oil',
    color: '#1fff71',
  },
  {
    name: '15# Linear Gel',
    key: '15#_linear_gel',
    unitType: 'oil',
    color: '#00E7E9',
  },
  {
    name: '15% HCL Acid',
    key: '15%_hcl_acid',
    unitType: 'oil',
    color: '#6ec732',
  },
  {
    name: 'Slickwater',
    key: 'slickwater',
    unitType: 'oil',
    color: '#7AB8ED',
  },
  {
    name: '15# XL Borate',
    key: '15#_xl_borate',
    unitType: 'oil',
    color: '#ff9a4c',
  },
  {
    name: 'Fresh Water',
    key: 'fresh_water',
    unitType: 'oil',
    color: '#4c7fff',
  },
];

export const TOTAL_CHEMICAL_TYPE = {
  name: 'Total Chemicals',
  key: 'total_chemical_rate_in',
  color: '#00FF00',
};

export const CHEMICALS_VOL_TYPES = [
  {
    name: 'Liquid Gel',
    color: '#84F4F7',
    key: 'gel',
  },
  {
    name: 'Acid',
    color: '#6ec732',
    key: 'acid',
  },
  {
    name: 'Liquid FR',
    color: '#FFA891',
    key: 'friction_reducer',
  },
  {
    name: 'Liquid FR Extra',
    color: '#91FFA8',
    key: 'friction_reducer_extra',
  },
  {
    name: 'Total Liquid FR',
    color: '#FF91A8',
    key: 'total_friction_reducer',
  },
  {
    name: 'Fluid Loss',
    color: '#c7bd32',
    key: 'fluid_loss',
  },
  {
    name: 'Cross Linker',
    color: '#B0CA87',
    key: 'cross_linker',
  },
  {
    name: 'Liquid EB',
    color: '#32b8c7',
    key: 'enzyme_breaker',
  },
  {
    name: 'Polymer Plug',
    color: '#9fc732',
    key: 'ploymer_plug',
  },
  {
    name: 'Acid Inhibitor',
    color: '#AB9081',
    key: 'acid_inhibitor',
  },
  {
    name: 'Acid Retarder',
    color: '#7CC6FE',
    key: 'acid_retarder',
  },
  {
    name: 'Emulsifier',
    color: '#5DFDCB',
    key: 'emulsifier',
  },
  {
    name: 'Clay Stabilizer',
    color: '#9C6B20',
    key: 'clay_stabilizer',
  },
  {
    name: 'Surfactant',
    color: '#FFF689',
    key: 'surfactant',
  },
  {
    name: 'Non-Emulsifier',
    color: '#C0DF85',
    key: 'non_emulsifier',
  },
  {
    name: 'Fines Suspender',
    color: '#7B8E55',
    key: 'fines_suspender',
  },
  {
    name: 'Anti-Sludge',
    color: '#07393C',
    key: 'anti_sludge',
  },
  {
    name: 'Scale Inhibitor',
    color: '#C0E5CA',
    key: 'scale_inhibitor',
  },
  {
    name: 'Iron Control',
    color: '#CD5334',
    key: 'iron_control',
  },
  {
    name: 'Oxygen Scavenger',
    color: '#DFF283',
    key: 'oxygen_scavenger',
  },
  {
    name: 'Mutual Solvent',
    color: '#ad5ec7',
    key: 'mutual_solvent',
  },
  {
    name: 'Corrosion Inhibitor',
    color: '#7C2209',
    key: 'corrosion_inhibitor',
  },
  {
    name: 'Paraffin Control',
    color: '#F5A65B',
    key: 'paraffin_control',
  },
  {
    name: 'Biocide',
    color: '#E9B76A',
    key: 'biocide',
  },
  {
    name: 'PH Adjusting Agent',
    color: '#519872',
    key: 'ph_adjusting_agent',
  },
  {
    name: 'Accelerator',
    color: '#5E3023',
    key: 'accelerator',
  },
  {
    name: 'Instant Crosslinker',
    color: '#6E6E23',
    key: 'instant_crosslinker',
  },
  {
    name: 'Delayed Crosslinker',
    color: '#7E306E',
    key: 'delayed_crosslinker',
  },
  {
    name: 'Liquid Breaker',
    color: '#233023',
    key: 'liquid_breaker',
  },
];

export const CHEMICALS_MASS_TYPES = [
  {
    // NOTE: Incorrect spellling `divertor` was used by accident in the begnning of development.
    // Since it was used in the column mapper, the key field should be kept as is for existing assets.
    name: 'Diverter',
    color: '#BB9394',
    key: 'divertor',
  },

  {
    name: 'Powder Breaker',
    color: '#c732b8',
    key: 'powder_breaker',
  },

  {
    name: 'Powder Gel',
    color: '#308E23',
    key: 'powder_gel',
  },
  {
    name: 'Powder FR',
    color: '#30239E',
    key: 'powder_friction_reducer',
  },
  {
    name: 'Powder EB',
    color: '#A32A78',
    key: 'powder_enzyme_breaker',
  },
];

// TODO: These checmials are shared between wits channels and settings chemicals app
// Like proppants, we might need to separate those two usage.
export const CHEMICALS_TYPES = [
  ...CHEMICALS_VOL_TYPES.map(item => ({ ...item, unitType: 'volume' })),
  ...CHEMICALS_MASS_TYPES.map(item => ({ ...item, unitType: 'mass' })),
];

export const PROPPANTS_TYPES = [
  {
    name: '100 Mesh',
    key: '100_mesh',
    unitType: 'mass',
    color: '#ff0000',
  },
  {
    name: '40/70 Brown',
    key: '40_70_brown',
    unitType: 'mass',
    color: '#603000',
  },
  {
    name: '40/70 Mesh',
    key: '40_70_mesh',
    unitType: 'mass',
    color: '#5454cc',
  },
  {
    name: '40/70 NWS',
    key: '40_70_nws',
    unitType: 'mass',
    color: '#ff4242',
  },
  {
    name: '40/70 RBS',
    key: '40_70_rbs',
    unitType: 'mass',
    color: '#ff42bc',
  },
  {
    name: '30/50 Brown',
    key: '30_50_brown',
    unitType: 'mass',
    color: '#964B00',
  },
  {
    name: '30/50 Mesh',
    key: '30_50_mesh',
    unitType: 'mass',
    color: '#9898cc',
  },
  {
    name: '25/50 Brown',
    key: '25_50_brown',
    unitType: 'mass',
    color: '#B27C45',
  },
  {
    name: '25/50 Mesh',
    key: '25_50_mesh',
    unitType: 'mass',
    color: '#32aa32',
  },
  {
    name: '20/40 Mesh',
    key: '20_40_mesh',
    unitType: 'mass',
    color: '#ff7979',
  },
];

export const PROPPANTS_CON_TYPES = [
  {
    name: 'Total Proppant Conc',
    key: 'total_proppant_concentration',
    unitType: 'massConcentration',
    unit: 'lb/gal',
    color: '#FF8F0B',
  },
  {
    name: 'BHPC',
    key: 'bottomhole_proppant_concentration',
    unitType: 'massConcentration',
    unit: 'lb/gal',
    color: '#9F4BED',
    precision: 2,
  },
  {
    name: 'Proppant 1 Conc',
    key: 'proppant_1_concentration',
    unitType: 'massConcentration',
    unit: 'lb/gal',
    color: '#7EB93A',
  },
  {
    name: 'Proppant 2 Conc',
    key: 'proppant_2_concentration',
    unitType: 'massConcentration',
    unit: 'lb/gal',
    color: '#6785E8',
  },
];

export const PROPPANTS_MASS_TYPES = [
  {
    name: 'Total Proppant Volume',
    key: 'total_proppant_mass',
    unitType: 'mass',
    color: '#EE964B',
    unit: 'lb',
  },
  {
    name: 'Proppant 1 Volume',
    key: 'proppant_1_mass',
    unitType: 'mass',
    color: '#C6C013',
    unit: 'lb',
  },
  {
    name: 'Proppant 2 Volume',
    key: 'proppant_2_mass',
    unitType: 'mass',
    color: '#7ff577',
    unit: 'lb',
  },
];

export const STAGE_ACTUAL_PARAM_COLORS = {
  top_perforation: '#0085e3',
  bottom_perforation: '#8BC7F2',
  perforated_length: '#519872',
  total_shots: '#9500b7',
  flush_volume: '#FF6161',
};

export const PRESSURE_COLORS = {
  well_head_pressure: '#F50057',
  pipe_frictional_pressure_loss: '#D8496B',
  nwb_frictional_pressure_loss: '#807DFF',
  bottomhole_pressure: '#4DCFB3',
  net_pressure: '#EE752F',
  max_treating_pressure: '#F50258',
  ave_treating_pressure: '#FF6161',
  breakdown_pressure: '#03db5a',
  isip_pressure: '#7169AE',
  delta_pressure: '#efd34b',
  hydrostatic_pressure: '#E458C8',
  backside_pressure: '#32aa32',
  pumpside_pressure: '#855CF8',
};

export const TRACKING_CONCENTRATION_COLORS = {
  fr_concentration: '#D99C88',
  surfactant_concentration: '#FEF798',
  powder_breaker_concentration: '#993895',
};

export const FLOW_RATE_COLORS = {
  clean_flow_rate_in: '#7CC900',
  slurry_flow_rate_in: '#64B5FF',
  max_flow_rate: '#0085e3',
  ave_flow_rate: '#8BC7F2',
};

export const TOTAL_VOLUME_COLORS = {
  total_slurry_volume_in: '#7169AE',
  total_clean_volume_in: '#257CFF',
};

export const COMPLETION_OPERATION_TYPE = [
  {
    name: 'Fracturing',
    key: 'fracturing',
    color: '#429FF8',
  },
  {
    name: 'Wireline',
    key: 'wireline',
    color: '#FF9C00',
  },
  {
    name: 'Swap Over - Fracturing',
    key: 'swap_over_fracturing',
    color: '#347EC5',
  },
  {
    name: 'Swap Over - Wireline',
    key: 'swap_over_wireline',
    color: '#BF7500',
  },
  {
    name: 'Waiting on Offset Wells',
    key: 'waiting_on_offset_wells',
    color: '#BDBDBD',
  },
];

export const WIRELINE_PARAMETERS = [
  {
    key: 'line_speed',
    label: 'Line Speed',
    unitType: 'velocity',
    unit: 'ft/min',
    isDefaultView: true,
  },
  {
    key: 'line_tension',
    label: 'Line Tension',
    unitType: 'mass',
    unit: 'lb',
    isDefaultView: true,
  },
  {
    key: 'casing_collar_locator',
    label: 'CCL',
    isDefaultView: true,
  },
  {
    key: 'elapsed_time',
    label: 'Elapsed Time',
    unitType: 'time',
    unit: 's',
  },
  {
    key: 'voltage',
    label: 'Voltage',
    unitType: 'voltage',
    unit: 'mV',
  },
  {
    key: 'current',
    label: 'Current',
    unitType: 'current',
    unit: 'mA',
  },
  {
    key: 'measured_depth',
    label: 'Measured Depth',
    unitType: 'length',
    unit: 'ft',
  },
];

export const DEFAULT_SUPPORTED_PAD_MODES = [
  {
    key: 'pad',
    label: 'Pad Mode',
  },
];

/**
 * There are 5 different modes in completion apps
 *
 * 1 - Pad Mode (Display data from all assets on pad in series)
 * 2 - Active Frac Mode (Display data from active frac asset on active pad)
 * 3 - Active Wireline Mode (Display data from active wireline asset on active pad)
 * 4 - Active Pumpdown Mode (Display data from active pumpdown asset on active pad)
 * 5 - Custom Mode (Display data from user selected asset on active pad)
 *
 */
export const COMPLETION_MODES = {
  pad: 'pad',
  activeFrac: 'active_frac',
  activeWireline: 'active_wireline',
  activePumpdown: 'active_pumpdown',
  custom: 'custom',
};

/**
 * There are 8 different types of completion apps,
 * and each one will have different modes in the dropdown
 *
 * 1 - Pad apps
 * 2 - Frac & Wireline Multi-Well Apps
 * 3 - Frac Multi-Well Apps
 * 4 - Wireline Multi-Well Apps
 * 5 - Pumpdown Multi-Well Apps
 * 6 - Frac Single Well Apps
 * 7 - Wireline Single Well Apps
 * 8 - Pumpdown Single Well Apps
 *
 */
export const COMPLETION_APP_TYPES = {
  padApp: 'Pad Apps',
  fracWirelineMultiWellApp: 'Frac & Wireline Multi-Well Apps',
  fracMultiWellApp: 'Frac Multi-Well Apps',
  wirelineMultiWellApp: 'Wireline Multi-Well Apps',
  pumpdownMultiWellApp: 'Pumpdown Multi-Well Apps',
  fracSingleWellApp: 'Frac Single Well Apps',
  wirelineSingleWellApp: 'Wireline Single Well Apps',
  pumpdownSingleWellApp: 'Pumpdown Single Well Apps',
};

export const COMPLETION_APPTYPE_MODES_DICT = {
  [COMPLETION_APP_TYPES.padApp]: [COMPLETION_MODES.pad, COMPLETION_MODES.custom],
  [COMPLETION_APP_TYPES.fracWirelineMultiWellApp]: [
    COMPLETION_MODES.pad,
    COMPLETION_MODES.activeFrac,
    COMPLETION_MODES.activeWireline,
    COMPLETION_MODES.custom,
  ],
  [COMPLETION_APP_TYPES.fracMultiWellApp]: [
    COMPLETION_MODES.pad,
    COMPLETION_MODES.activeFrac,
    COMPLETION_MODES.custom,
  ],
  [COMPLETION_APP_TYPES.fracSingleWellApp]: [COMPLETION_MODES.activeFrac, COMPLETION_MODES.custom],
  [COMPLETION_APP_TYPES.wirelineMultiWellApp]: [
    COMPLETION_MODES.pad,
    COMPLETION_MODES.activeWireline,
    COMPLETION_MODES.custom,
  ],
  [COMPLETION_APP_TYPES.wirelineSingleWellApp]: [
    COMPLETION_MODES.activeWireline,
    COMPLETION_MODES.custom,
  ],
  [COMPLETION_APP_TYPES.pumpdownMultiWellApp]: [
    COMPLETION_MODES.pad,
    COMPLETION_MODES.activePumpdown,
    COMPLETION_MODES.custom,
  ],
  [COMPLETION_APP_TYPES.wirelineSingleWellApp]: [
    COMPLETION_MODES.activePumpdown,
    COMPLETION_MODES.custom,
  ],
};
