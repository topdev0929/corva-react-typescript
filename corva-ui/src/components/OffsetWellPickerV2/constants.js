import { sortBy } from 'lodash';

import { metricsUtils } from '~/utils';

const metrics = metricsUtils.default;

export const FILTERS = {
  formation: 'formation',
  stringDesign: 'stringDesign',
  program: 'programName',
  basin: 'basin',
  county: 'county',
  area: 'area',
};

export const FILTERS_LIST = [
  {
    key: FILTERS.program,
    title: 'Program/BU',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Programs/BUs`),
  },
  {
    key: FILTERS.basin,
    title: 'Basin',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Basins`),
  },
  {
    key: FILTERS.county,
    title: 'County',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Counties`),
  },
  {
    key: FILTERS.area,
    title: 'Area',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Areas`),
  },
  {
    key: FILTERS.formation,
    title: 'Target Formation',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Formations`),
  },
  {
    key: FILTERS.stringDesign,
    title: 'String Design',
    size: 130,
    renderValue: length => (length === 0 ? `All` : `${length} Designs`),
  },
];

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

export const METRICS_KEYS = METRICS_LIST.map(item => item.key);

export const TABLE_COLUMNS = [
  {
    label: 'Well Name',
    key: 'name',
    minWidth: 250,
  },
  {
    label: 'Rig',
    key: 'rigName',
    width: 200,
  },
  {
    label: 'Distance',
    key: 'distance',
    width: 120,
  },
  {
    label: 'Rig Release Date',
    key: 'rigReleaseDate',
    width: 150,
  },
];

export const SETTINGS_COLUMN = { key: 'settings', label: 'settings', width: 100 };

export const MAX_METRICS_COUNT = 2;

export const DEFAULT_SETTINGS = {
  radius: 5,
  filters: {},
  sortInfo: {
    key: 'name',
    direction: 1,
  },
};
