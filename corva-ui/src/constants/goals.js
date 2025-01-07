import metrics from '~/utils/metrics';

export const BENCHMARK_METRIC_GOAL = 'benchmark_metric';

// NOTE: Connections Goals
export const SLIPS_TO_SLIPS_GOAL = 'slips_to_slips_average';
export const BOTTOM_TO_SLIPS_GOAL = 'bottom_to_slips_average';
export const WEIGHT_TO_WEIGHT_GOAL = 'weight_to_weight_average';
export const SLIPS_TO_BOTTOM_GOAL = 'slips_to_bottom_average';

// NOTE: Engineering Goals
export const CUMULATIVE_TORTUOSITY_GOAL = 'cumulative_tortuosity_goal';

// NOTE: Completion Goals
export const STAGES_PER_DAY_GOAL = 'stages_per_day';
export const PUMPING_HOURS_PER_DAY_GOAL = 'pumping_hours_per_day';
export const BBLS_PER_DAY_GOAL = 'bbls_per_day';
export const LBS_PROPPANT_PER_DAY_GOAL = 'lbs_proppant_per_day';
export const FRAC_SWAP_OVER_GOAL = 'frac_swap_over';
export const WIRELINE_SWAP_OVER_GOAL = 'wireline_swap_over';
export const OPTIMAL_PRESSURE_WINDOW_MIN_GOAL = 'optimal_pressure_window_min';
export const OPTIMAL_PRESSURE_WINDOW_MAX_GOAL = 'optimal_pressure_window_max';

// NOTE: Drilling Efficiency Goals
export const DRILLING_EFFICIENCY_GOALS = [
  metrics.drilled_feet_rotary_percentage,
  metrics.drilled_feet_slide_percentage,
  metrics.rop,
  metrics.rop_rotary,
  metrics.rop_slide,
  metrics.rop_gross,
  metrics.feet_per_day,
  metrics.tripping_in_speed,
  metrics.tripping_out_speed,
];

// NOTE: Connections Goals
export const CONNECTIONS_GOALS = [
  metrics.drilling_connection_average,
  metrics.bottom_to_slips_average,
  metrics.slips_to_bottom_average,
  metrics.weight_to_weight_average,
];

// NOTE: Cost Goals
export const COST_GOALS = [
  {
    label: 'Cost',
    key: 'cost',
  },
  metrics.cost_per_lat_ft,
  metrics.cost_per_ft,
];

// NOTE: Engineering Goals
export const ENGINEERING_GOALS = [metrics.cumulative_tortuosity];

// NOTE: Completion Goals
export const COMPLETION_GOALS = [
  {
    label: 'Stages/day',
    key: STAGES_PER_DAY_GOAL,
  },
  {
    label: 'Pumping hours/day',
    key: PUMPING_HOURS_PER_DAY_GOAL,
  },
  {
    label: 'Bbls/day',
    key: BBLS_PER_DAY_GOAL,
  },
  {
    label: 'Lbs Proppant/day',
    key: LBS_PROPPANT_PER_DAY_GOAL,
  },
  {
    label: 'Frac Swap Over',
    key: FRAC_SWAP_OVER_GOAL,
  },
  {
    label: 'Wireline Swap Over',
    key: WIRELINE_SWAP_OVER_GOAL,
  },
  {
    label: 'Optimal Pressure Window Min',
    key: OPTIMAL_PRESSURE_WINDOW_MIN_GOAL,
  },
  {
    label: 'Optimal Pressure Window Max',
    key: OPTIMAL_PRESSURE_WINDOW_MAX_GOAL,
  },
];

export const GOAL_TYPES_DICT = {
  company: {
    label: 'Company',
    key: 'company',
  },
  program: {
    label: 'Program/BU',
    key: 'program',
  },
};
