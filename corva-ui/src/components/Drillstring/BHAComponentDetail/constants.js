export const UR_ACTIVATION_LOGIC_KEYS = {
  FLOW_ACTIVATED: 'flow_activated',
  OPEN_HOLE_ACTIVATED: 'open_hole_activated',
  DEPTH_ACTIVATION: 'depth_activation',
};

export const UR_ACTIVATION_LOGIC_TYPES = [
  { name: 'Flow Activated', type: UR_ACTIVATION_LOGIC_KEYS.FLOW_ACTIVATED },
  { name: 'Open Hole Activation', type: UR_ACTIVATION_LOGIC_KEYS.OPEN_HOLE_ACTIVATED },
  { name: 'Depth Activation', type: UR_ACTIVATION_LOGIC_KEYS.DEPTH_ACTIVATION },
];

export const FLOW_RATE_UNIT = {
  drilling: {
    unitType: 'volumeFlowRate',
    unit: 'gal/min',
  },
  completion: {
    unitType: 'oilFlowRate',
    unit: 'bbl/min',
  },
};

export const BHA_COMPONENT_TYPES = [
  {
    family: 'ct',
    data: [
      {
        key: 'ct-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'reel_diameter',
          'component_length',
          'length',
          'linear_weight',
          'weight',
          'grade',
          'material',
          'class',
        ],
      },
    ],
  },
  {
    family: 'dp',
    data: [
      {
        key: 'dp-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'number_of_joints',
          'component_length',
          'length',
          'linear_weight',
          'weight',
          'grade',
          'outer_diameter_tooljoint',
          'inner_diameter_tooljoint',
          'length_tooljoint',
          'connection_type',
          'material',
          'class',
        ],
      },
    ],
  },
  {
    family: 'hwdp',
    data: [
      {
        key: 'hwdp-1',
        col_size: 4,
        fields: [
          'sub_category',
          'outer_diameter',
          'inner_diameter',
          'number_of_joints',
          'component_length',
          'length',
          'linear_weight',
          'weight',
          'grade',
          'outer_diameter_tooljoint',
          'inner_diameter_tooljoint',
          'length_tooljoint',
          'connection_type',
          'material',
          'class',
        ],
      },
    ],
  },
  {
    family: 'pdm',
    data: [
      {
        key: 'pdm-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'rpg',
          'length',
          'linear_weight',
          'weight',
          'stages',
          'number_rotor_lobes',
          'number_stator_lobes',
          'bend_range',
          'max_weight_on_bit',
          'make',
          'bit_to_bend',
          'name',
          'model',
        ],
      },
      {
        key: 'pdm-standard-flow-range',
        col_size: 4,
        sub_title: 'Standard Flow Range',
        fields: ['min_standard_flowrate', 'max_standard_flowrate'],
      },
      {
        key: 'pdm-op-diff-pressure',
        col_size: 3,
        fields: [
          'max_operating_differential_pressure',
          'torque_at_max_operating_differential_pressure',
        ],
      },
      {
        key: 'pdm-flow-loss',
        col_size: 3,
        fields: ['flow_loss_percentage'],
      },
      {
        key: 'pdm-pressure-loss',
        col_size: 3,
        sub_title: 'Off Bottom Pressure Loss',
        tb_field: 'off_bottom_pressure_loss',
        tb_head: ['Flow Rate', 'Pressure Loss'],
        tb_body: [
          { field: 'flow_rate', isNumber: true },
          { field: 'pressure_loss', isNumber: true },
        ],
      },
      {
        key: 'pdm-stabilizer-1',
        col_size: 2,
        sub_title: 'Stabilizer',
        stablizer_fields: [
          'name',
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'outer_diameter',
        ],
      },
      {
        key: 'pdm-stabilizer-2',
        col_size: 2,
        stablizer_fields: [
          'gauge_od',
          'gauge_length',
          'no_of_blades',
          'stab_centerpoint_to_bit',
          'blade_width',
          'connection_type',
          'material',
        ],
      },
    ],
  },
  {
    family: 'bit',
    data: [
      {
        key: 'bit-1',
        col_size: 3,
        fields: ['size', 'bit_type', 'length', 'weight'],
      },
      {
        key: 'bit-nozzles',
        col_size: 3,
        tb_field: 'nozzle_sizes',
        tb_head: ['# of this size', 'Nozzle Size'],
        tb_body: [
          { field: 'count', isNumber: false },
          { field: 'size', isNumber: true },
        ],
      },
      {
        key: 'bit-3',
        col_size: 3,
        fields: ['shank_od', 'make', 'serial_number', 'model', 'tfa', 'bit_reason_pulled'],
      },
    ],
  },
  {
    family: 'dc',
    data: [
      {
        key: 'dc-1',
        col_size: 4,
        fields: [
          'sub_category',
          'outer_diameter',
          'inner_diameter',
          'number_of_joints',
          'component_length',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
        ],
      },
    ],
  },
  {
    family: 'stabilizer',
    data: [
      {
        key: 'stabilizer-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'gauge_od',
          'gauge_length',
          'no_of_blades',
          'blade_width',
          'connection_type',
          'material',
        ],
      },
    ],
  },
  {
    family: 'sub',
    data: [
      {
        key: 'sub-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
        ],
      },
    ],
  },
  {
    family: 'mwd',
    data: [
      {
        key: 'mwd-1',
        col_size: 3,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
          'gamma_sensor_to_bit_distance',
          'bit_to_survey_distance',
          'vibration_source',
        ],
      },
      {
        key: 'mwd-pressure-loss',
        col_size: 3,
        tb_field: 'pressure_loss',
        sub_title: 'Pressure Loss',
        tb_head: ['Flow Rate', 'Pressure Loss'],
        tb_body: [
          { field: 'flow_rate', isNumber: true },
          { field: 'pressure_loss', isNumber: true },
        ],
      },
    ],
  },
  {
    family: 'rss',
    data: [
      {
        key: 'rss-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
          'vibration_source',
          'flow_loss_percentage',
        ],
      },
      {
        key: 'rss-pressure-loss',
        col_size: 4,
        tb_field: 'pressure_loss',
        sub_title: 'Pressure Loss',
        tb_head: ['Flow Rate', 'Pressure Loss'],
        tb_body: [
          { field: 'flow_rate', isNumber: true },
          { field: 'pressure_loss', isNumber: true },
        ],
      },
    ],
  },
  {
    family: 'ur',
    data: [
      {
        key: 'ur-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
          'name',
        ],
      },
      {
        key: 'ur-nozzles',
        col_size: 4,
        tb_field: 'nozzle_sizes',
        tb_head: ['# of this size', 'Nozzle Size'],
        tb_body: [
          { field: 'count', isNumber: false },
          { field: 'size', isNumber: true },
        ],
      },
      {
        key: 'ur-configuration-block',
        col_size: 4,
        sub_title: 'Under Reamer Configuration',
        sub_key: 'ur-configuration-info',
        sub_fields: [
          'ur_opened_od',
          'gauge_length',
          'no_of_blades',
          'blade_width',
          'ur_to_bit',
          'flow_rate',
          'tfa',
          'ur_opened_depth',
        ],
      },
    ],
  },
  {
    family: 'lwd',
    data: [
      {
        key: 'lwd-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
        ],
      },
      {
        key: 'lwd-measurements',
        col_size: 4,
        tb_field: 'lwd_measurements',
        tb_head: ['Type', 'Name', 'Distance'],
        tb_body: [
          { field: 'type', isNumber: false },
          { field: 'name', isNumber: false },
          { field: 'distance', isNumber: true },
        ],
      },
    ],
  },
  {
    family: 'agitator',
    data: [
      {
        key: 'agitator-1',
        col_size: 4,
        fields: [
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
        ],
      },
      {
        key: 'agitator-pressure-loss',
        col_size: 4,
        tb_field: 'pressure_loss',
        sub_title: 'Pressure Loss',
        tb_head: ['Flow Rate', 'Pressure Loss'],
        tb_body: [
          { field: 'flow_rate', isNumber: true },
          { field: 'pressure_loss', isNumber: true },
        ],
      },
    ],
  },
  {
    family: 'jar',
    data: [
      {
        key: 'jar-1',
        col_size: 4,
        fields: [
          'sub_category',
          'outer_diameter',
          'inner_diameter',
          'length',
          'linear_weight',
          'weight',
          'connection_type',
          'material',
        ],
      },
    ],
  },
];

export const BHA_GENERAL_FIELD_TYPES = [
  { name: 'sub_category', label: 'Sub Category' },
  { name: 'outer_diameter', label: 'OD', unit: 'shortLength' },
  { name: 'inner_diameter', label: 'ID', unit: 'shortLength' },
  { name: 'reel_diameter', label: 'Reel Diameter', unit: 'shortLength' },
  { name: 'number_of_joints', label: '# of Joints' },
  { name: 'component_length', label: 'Component Length', unit: 'length' },
  { name: 'size', label: 'Size', unit: 'shortLength' },
  { name: 'bit_type', label: 'Bit Type' },
  { name: 'rpg', label: 'RPG', unit: 'revolutionPerVolume' },
  { name: 'length', label: 'Total Length', unit: 'length' },
  { name: 'linear_weight', label: 'Adjusted Linear Weight', unit: 'massPerLength' },
  { name: 'weight', label: 'Total Weight', unit: 'mass' },
  { name: 'grade', label: 'Grade' },
  { name: 'gauge_od', label: 'Gauge OD', unit: 'shortLength' },
  { name: 'outer_diameter_tooljoint', label: 'TJ OD' },
  { name: 'inner_diameter_tooljoint', label: 'TJ ID' },
  { name: 'length_tooljoint', label: 'TJ Length per Joint', unit: 'length' },
  { name: 'gauge_length', label: 'Gauge Length', unit: 'shortLength' },
  { name: 'no_of_blades', label: '# of Blades' },
  { name: 'blade_width', label: 'Blade Width', unit: 'shortLength' },
  { name: 'connection_type', label: 'Connection Type' },
  { name: 'material', label: 'Material', unit: 'shortLength' },
  { name: 'stages', label: '# of stages' },
  { name: 'number_rotor_lobes', label: '# of rotor lobes' },
  { name: 'number_stator_lobes', label: '# of stator lobes' },
  { name: 'bend_range', label: 'Bend Range' },
  { name: 'max_weight_on_bit', label: 'Max WOB', unit: 'force' },
  { name: 'shank_od', label: 'Shank OD', unit: 'shortLength' },
  { name: 'make', label: 'Make' },
  { name: 'bit_to_bend', label: 'Bit to Bend', unit: 'length' },
  { name: 'name', label: 'Name' },
  {
    name: 'gamma_sensor_to_bit_distance',
    label: 'Gamma Sensor To Bit Distance',
    cond: 'has_gamma_sensor',
    unit: 'length',
  },
  {
    name: 'bit_to_survey_distance',
    label: 'Survey Sensor to Bit Distance',
    cond: 'has_survey_sensor',
    unit: 'length',
  },
  { name: 'vibration_source', label: 'Vibration Sensor' },
  { name: 'class', label: 'Class' },
  { name: 'serial_number', label: 'Serial Number' },
  { name: 'model', label: 'Model' },
  { name: 'tfa', label: 'TFA' },
  { name: 'bit_reason_pulled', label: 'Reason Pulled' },
  {
    name: 'max_operating_differential_pressure',
    label: 'Max Operating Diff Pressure',
    unit: 'pressure',
    col_size: 3,
  },
  {
    name: 'torque_at_max_operating_differential_pressure',
    label: 'Torque at Max Operating Diff Pressure',
    unit: 'torque',
    col_size: 3,
  },
  { name: 'flow_loss_percentage', label: '% Actuator Flow Loss', col_size: 5, family: 'rss' },
  { name: 'flow_loss_percentage', label: '% Leakage Flow Loss', col_size: 3, family: 'pdm' },
];

export const BHA_ALTERNATIVE_FIELD_TYPES = [
  { name: 'min_standard_flowrate', label: 'Min', col_size: 3, unit: 'volumeFlowRate' },
  { name: 'max_standard_flowrate', label: 'Max', col_size: 3, unit: 'volumeFlowRate' },
];

export const BHA_TABLE_FIELD_TYPES = [
  { name: 'ur_opened_od', label: 'Max OD (Opened)', unit: 'shortLength' },
  { name: 'gauge_length', label: 'Gauge Length', unit: 'shortLength' },
  { name: 'no_of_blades', label: '# of Blades' },
  { name: 'blade_width', label: 'Blade Width', unit: 'shortLength' },
  { name: 'ur_to_bit', label: 'Reamer to Bit Distance', unit: 'shortLength' },
  { name: 'flow_rate', label: 'Activation Flow Rate', unit_from_segment: true },
  { name: 'tfa', label: 'TFA' },
];

export const BHA_STABILIZER_FIELD_TYPES = [
  { name: 'name', label: 'Name' },
  { name: 'outer_diameter', label: 'OD', unit: 'shortLength' },
  { name: 'inner_diameter', label: 'ID' },
  { name: 'length', label: 'Total Length', unit: 'length' },
  { name: 'linear_weight', label: 'Adjusted Linear Weight', unit: 'massPerLength' },
  { name: 'weight', label: 'Total Weight', unit: 'mass' },
  { name: 'gauge_od', label: 'Gauge OD', unit: 'shortLength' },
  { name: 'gauge_length', label: 'Gauge Length', unit: 'shortLength' },
  { name: 'no_of_blades', label: '# of Blades' },
  { name: 'stab_centerpoint_to_bit', label: 'Stab Centerpoint To Bit', unit: 'length' },
  { name: 'blade_width', label: 'Blade Width', unit: 'shortLength' },
  { name: 'connection_type', label: 'Connection Type' },
  { name: 'material', label: 'Material', col_size: 2 },
];
