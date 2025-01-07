/* eslint-disable camelcase */

/*
 These are base configs for all metrics
 Any app can overwrite and extend any config
 Config specs: https://www.notion.so/corva/Drilling-Metrics-31de1dc4b7b448ec9e91ad4b61a941a2

 Fields:
    Required:
      label: UI metric name
      key: api key for metric

    Optional:
      unitType: the class of unit such as volume, length, mass, etc, used in convert.js
      from: the specific unit such as m, gal, lb, etc according to api
      to:  the unit that we want to convert the value to (on UI)
      precision: rounding api metric value, default is 2
      isBiggestBest: some metrics should be maximized, other - minimized
      customScale: function for scaling metrics, for example percents
      formatUnitDisplay: takes unitDisplay as argument
      allowNegativeValue: only a few metrics can be negative

*/
import { getUnitPreference, getUnitDescription, convertValue } from '../convert';
import { convertPercentageMetrics } from './utils';

export const hole_depth = {
  label: 'Hole Depth',
  key: 'hole_depth',
  isBiggestBest: true,
  unitType: 'length',
  from: 'ft',
};

export const hole_depth_change = {
  label: 'Total Distance Drilled',
  key: 'hole_depth_change',
  unitType: 'length',
  from: 'ft',
  isBiggestBest: true,
};

export const drilled_feet_rotary = {
  label: 'Rotary Distance Drilled',
  key: 'drilled_feet_rotary',
  unitType: 'length',
  from: 'ft',
  isBiggestBest: true,
};

export const drilled_feet_slide = {
  label: 'Slide Distance Drilled',
  key: 'drilled_feet_slide',
  unitType: 'length',
  from: 'ft',
};

export const drilled_feet_rotary_percentage = {
  label: 'Rotary %',
  key: 'drilled_feet_rotary_percentage',
  to: '%',
  customConvert: convertPercentageMetrics,
  isBiggestBest: true,
};
export const drilled_feet_slide_percentage = {
  label: 'Slide %',
  key: 'drilled_feet_slide_percentage',
  to: '%',
  customConvert: convertPercentageMetrics,
};
export const drilling_percentage = {
  label: 'Drilling %',
  key: 'drilling_percentage',
  to: '%',
  customConvert: convertPercentageMetrics,
  isBiggestBest: true,
};
export const rop = {
  label: 'On-Bottom ROP',
  key: 'rop',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const rop_rotary = {
  label: 'Rotary ROP',
  key: 'rop_rotary',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const rop_slide = {
  label: 'Slide ROP',
  key: 'rop_slide',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const rop_gross = {
  label: 'Gross ROP',
  key: 'rop_gross',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const feet_per_day = {
  label: 'Drilled Distance/Day',
  key: 'feet_per_day',
  unitType: 'length',
  from: 'ft',
  formatUnitDisplay: unitDisplay => `${unitDisplay}/day`,
  isBiggestBest: true,
};
export const drilling_time_rotary = {
  label: 'Rotary Drilling Time',
  key: 'drilling_time_rotary',
  to: 'h',
  isBiggestBest: true,
};
export const drilling_time_slide = {
  label: 'Slide Drilling Time',
  key: 'drilling_time_slide',
  to: 'h',
};
export const on_bottom_time = {
  label: 'On Bottom Time',
  key: 'on_bottom_time',
  to: 'h',
};
export const on_bottom_percentage = {
  label: 'On Bottom %',
  key: 'on_bottom_percentage',
  to: '%',
  customConvert: convertPercentageMetrics,
  isBiggestBest: true,
};
export const drilling_connection_average = {
  label: 'Slips to Slips',
  key: 'drilling_connection_average',
  to: 'min',
  unitType: 'time',
  from: 's',
};
export const weight_to_weight_average = {
  label: 'Weight to Weight',
  key: 'weight_to_weight_average',
  to: 'min',
  from: 's',
  unitType: 'time',
};

export const bottom_to_slips_average = {
  label: 'Bottom to Slips',
  key: 'bottom_to_slips_average',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const slips_to_bottom_average = {
  label: 'Slips to Bottom',
  key: 'slips_to_bottom_average',
  to: 'min',
  from: 's',
  unitType: 'time',
};

export const pumps_on_to_bottom_average = {
  label: 'Pumps on to Bottom',
  key: 'pumps_on_to_bottom_average',
  to: 'min',
  from: 's',
  unitType: 'time',
};

export const tripping_in_speed = {
  label: 'Hole Tripping In Speed',
  key: 'tripping_in_speed',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_out_speed = {
  label: 'Hole Tripping Out Speed',
  key: 'tripping_out_speed',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_in_speed_cased = {
  label: 'Cased Hole Tripping In Speed',
  key: 'tripping_in_speed_cased',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_out_speed_cased = {
  label: 'Cased Hole Tripping Out Speed',
  key: 'tripping_out_speed_cased',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_in_speed_open = {
  label: 'Open Hole Tripping In Speed',
  key: 'tripping_in_speed_open',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_out_speed_open = {
  label: 'Open Hole Tripping Out Speed',
  key: 'tripping_out_speed_open',
  unitType: 'velocity',
  from: 'ft/h',
  isBiggestBest: true,
};
export const tripping_in_time_cased = {
  label: 'Casing Tripping In Cased Hole',
  key: 'tripping_in_time_cased',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const tripping_in_time_open = {
  label: 'Casing Tripping In Open Hole',
  key: 'tripping_in_time_open',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const tripping_in_time = {
  label: 'Casing Tripping In Entire Hole',
  key: 'tripping_in_time',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const tripping_in_connection_time_cased = {
  label: 'Connection Time in Cased Hole',
  key: 'tripping_in_connection_time_cased',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const tripping_in_time_with_connection_open = {
  label: 'Casing Tripping In Open Hole + Connection Time in Open Hole',
  key: 'tripping_in_time_with_connection_open',
  to: 'min',
  from: 'h',
  unitType: 'time',
};
export const tripping_in_time_with_connection = {
  label: 'Casing Tripping In Entire Hole + Connection Time in Entire Hole',
  key: 'tripping_in_time_with_connection',
  to: 'min',
  from: 'h',
  unitType: 'time',
};
export const slips_to_slips = {
  label: 'Casing Slips to Slips',
  key: 'slips_to_slips_average',
  to: 'min',
  from: 's',
  unitType: 'time',
};
export const gross_tripping_in_speed_cased = {
  label: 'Cased Hole Tripping In Speed (with connection)',
  key: 'gross_tripping_in_speed_cased',
  unitType: 'velocity',
  from: 'ft/h',
};
export const gross_tripping_in_speed_open = {
  label: 'Open Hole Tripping In Speed (with connection)',
  key: 'gross_tripping_in_speed_open',
  unitType: 'velocity',
  from: 'ft/h',
};
export const gross_tripping_in_speed = {
  label: 'Entire Hole Tripping In Speed (with connection)',
  key: 'gross_tripping_in_speed',
  unitType: 'velocity',
  from: 'ft/h',
};

export const gross_tripping_in_speed_total = {
  label: 'Gross Tripping In Speed',
  key: 'gross_tripping_in_speed_total',
  unitType: 'velocity',
  from: 'ft/h',
};

export const gross_tripping_out_speed_total = {
  label: 'Gross Tripping Out Speed',
  key: 'gross_tripping_out_speed_total',
  unitType: 'velocity',
  from: 'ft/h',
};

export const cost_per_ft = {
  label: `Cost/${getUnitDescription(getUnitPreference('length')).singular}`,
  key: 'cost_per_ft',
  customConvert: value => value / convertValue(1, 'length', 'ft'),
};

export const cost_per_lat_ft = {
  label: `Lateral Cost/${getUnitDescription(getUnitPreference('length')).singular}`,
  key: 'cost_per_lat_ft',
  customConvert: value => value / convertValue(1, 'length', 'ft'),
};

export const npt = {
  label: 'NPT',
  key: 'npt',
  unitType: 'time',
  from: 'h',
  to: 'h',
};

export const circulating_time = {
  label: 'Circulating Time',
  key: 'circulating_time',
  unitType: 'time',
  from: 'h',
  to: 'h',
};

export const spud_to_rig_release_time = {
  label: 'Spud to Rig Release',
  key: 'spud_to_rig_release_time',
  unitType: 'time',
  from: 'h',
  to: 'd',
};

export const spud_to_target = {
  label: 'Spud to Target',
  key: 'spud_to_target',
  unitType: 'time',
  from: 'h',
  to: 'd',
};

export const spud_to_total_depth_time = {
  label: 'Spud to Total Depth',
  key: 'spud_to_total_depth_time',
  unitType: 'time',
  from: 'h',
  to: 'd',
};

export const spud_to_landing_point = {
  label: 'Spud to Landing Point',
  key: 'spud_to_landing_point',
  unitType: 'time',
  from: 'h',
  to: 'd',
};

export const gross_time = {
  label: 'Gross Time',
  key: 'gross_time',
  unitType: 'time',
  from: 's',
  to: 'h',
};

export const turn_rate = {
  label: 'Turn Rate',
  key: 'turn_rate',
  unitType: 'anglePerLength',
  from: 'dp100f',
  allowNegativeValue: true,
};

export const build_rate = {
  label: 'Build Rate',
  key: 'build_rate',
  unitType: 'anglePerLength',
  from: 'dp100f',
  allowNegativeValue: true,
};

// NOTE: Has no unit
export const cumulative_tortuosity = {
  label: 'Cumulative Tortuosity',
  key: 'cumulative_tortuosity',
};

export const weight_to_weight_count = {
  label: 'Drilling Stand Count',
  key: 'weight_to_weight_count',
};

export const tripping_connection_count = {
  label: 'Tripping Connection Count',
  key: 'tripping_connection_count',
};

export const slips_to_slips_count = {
  label: 'Casing Stand Count',
  key: 'slips_to_slips_count',
};
