export const DP_SUGGESTION_COLUMNS = [
  {
    label: 'OD',
    key: 'outer_diameter',
    unitType: 'shortLength',
    width: 60,
  },
  {
    label: 'ID',
    key: 'inner_diameter',
    unitType: 'shortLength',
    width: 60,
  },
  {
    label: 'Adjusted Linear Weight',
    key: 'linear_weight',
    unitType: 'massPerLength',
    width: 106,
  },
  {
    label: 'TJ OD',
    key: 'outer_diameter_tooljoint',
    unitType: 'shortLength',
    width: 60,
  },
  {
    label: 'TJ ID',
    key: 'inner_diameter_tooljoint',
    unitType: 'shortLength',
    width: 60,
  },
  {
    label: 'Length Tool Joint',
    key: 'length_tooljoint',
    unitType: 'shortLength',
    width: 106,
  },
  {
    label: 'Connection Type',
    key: 'connection_type',
    width: 100,
  },
  {
    label: 'Grade',
    key: 'grade',
    width: 60,
  },
];

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

export const CONTAINER_XS = 12;
