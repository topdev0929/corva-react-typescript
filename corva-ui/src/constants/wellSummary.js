import { get } from 'lodash';

import HoleSectionIcon from '~/assets/hole_section.svg';
import BhaIcon from '~/assets/bha.svg';
import CasingIcon from '~/assets/casing.svg';
import DollarIcon from '~/assets/dollar.svg';
import MudIcon from '~/assets/mud.svg';
import FormationIcon from '~/assets/formation.svg';
import DirectionalIcon from '~/assets/directional.svg';
import NptIcon from '~/assets/npt.svg';
import OperationSummaryIcon from '~/assets/operation_summary.svg';
import AlertIcon from '~/assets/alert.svg';
import AnnotationIcon from '~/assets/annotation.svg';
import ProppantIcon from '~/assets/proppant.svg';
import FluidIcon from '~/assets/fluid.svg';

export const DRILLING_WELL_SUMMARY = {
  PREVIOUS_24H_STAGE_COUNT: {
    key: 'PREVIOUS_24H_STAGE_COUNT',
    label: 'Previous 24h Stages',
    dataGetter: summaryData => {
      const metrics = get(summaryData, ['corva#completion-metrics', 'data', 'metrics']);
      const previous24hStageCount = metrics
        ? get(
            metrics.filter(item => item.key === 'stage_count'),
            ['0', 'split']
          )
        : 0;
      return { previous24hStageCount };
    },
  },
  PREVIOUS_24H_PUMPING_HOURS: {
    key: 'PREVIOUS_24H_PUMPING_HOURS',
    label: 'Previous 24h Pumping',
    dataGetter: summaryData => {
      const metrics = get(summaryData, ['corva#completion-metrics', 'data', 'metrics']);
      const previous24hPumpingHours = metrics
        ? get(
            metrics.filter(item => item.key === 'pumping_hours'),
            ['0', 'split']
          )
        : 0;
      return { previous24hPumpingHours };
    },
  },
  HOLE_DEPTH: {
    key: 'HOLE_DEPTH',
    label: 'Hole Depth',
    dataSource: [
      {
        provider: 'corva',
        collection: 'wits',
        fields: ['data.hole_depth'],
      },
    ],
    dataGetter: summaryData => ({
      holeDepth: get(summaryData, ['corva#wits', 'data', 'hole_depth']),
    }),
  },
  BIT_HOLE_DEPTH: {
    key: 'BIT_HOLE_DEPTH',
    label: 'Bit/Hole Depth',
    dataSource: [
      {
        provider: 'corva',
        collection: 'wits',
        fields: ['data.bit_depth'],
      },
      {
        provider: 'corva',
        collection: 'wits',
        fields: ['data.hole_depth'],
      },
    ],
    dataGetter: summaryData => ({
      bitDepth: get(summaryData, ['corva#wits', 'data', 'bit_depth']),
      holeDepth: get(summaryData, ['corva#wits', 'data', 'hole_depth']),
    }),
  },
  LAST_ACTIVE: {
    key: 'LAST_ACTIVE',
    label: 'Last Active',
    dataSource: [
      {
        provider: 'corva',
        collection: 'wits',
        fields: ['timestamp'],
      },
    ],
    dataGetter: summaryData => ({
      timestamp: get(summaryData, ['corva#wits', 'timestamp']),
    }),
  },
  PHASE: {
    key: 'PHASE',
    label: 'Phase',
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-well-sections-phases',
        fields: ['data.phase_name'],
      },
    ],
    dataGetter: summaryData => ({
      phaseName: get(summaryData, ['corva#data-well-sections-phases', 'data', 'phase_name']),
    }),
  },
  CURRENT_ACTIVITY: {
    key: 'CURRENT_ACTIVITY',
    label: 'Current Activity',
    dataSource: [
      {
        provider: 'corva',
        collection: 'wits',
        fields: ['data.state'],
      },
    ],
    dataGetter: summaryData => ({
      activityName: get(summaryData, ['corva#wits', 'data', 'state']),
    }),
  },
  HOLE_SECTION: {
    key: 'HOLE_SECTION',
    label: 'Hole Section',
    icon: HoleSectionIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-well-sections',
        fields: ['data.name'],
      },
    ],
    dataGetter: summaryData => ({
      sectionName: get(summaryData, ['corva#data-well-sections', 'data', 'name']),
    }),
  },
  BHA: {
    key: 'BHA',
    label: 'BHA',
    icon: BhaIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-drillstring',
        fields: [
          'timestamp',
          'data.id',
          'data.components.family',
          'data.components.material',
          'data.components.stabilizer',
          'data.components.bit_type',
          'data.setting_timestamp',
        ],
      },
    ],
    dataGetter: summaryData => ({
      components: get(summaryData, ['corva#data-drillstring', 'data', 'components']),
      bhaId: get(summaryData, ['corva#data-drillstring', 'data', 'id']),
    }),
  },
  BHA_COUNT: {
    key: 'BHA_COUNT',
    label: '# of Total BHAs',
    icon: BhaIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-drillstring',
        fields: ['data.id'],
      },
    ],
    dataGetter: summaryData => ({
      count: get(summaryData, ['corva#data-drillstring', 'data', 'id']),
    }),
  },
  CASING: {
    key: 'CASING',
    label: 'Casing',
    icon: CasingIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-casing',
        fields: ['timestamp', 'data.outer_diameter', 'data.setting_timestamp'],
      },
    ],
    dataGetter: summaryData => ({
      outerDiameter: get(summaryData, ['corva#data-casing', 'data', 'outer_diameter']),
      settingTimestamp: get(summaryData, ['corva#data-casing', 'data', 'setting_timestamp']),
    }),
  },
  STRING_DESIGN: {
    key: 'STRING_DESIGN',
    label: 'String Design',
    icon: CasingIcon,
  },
  TOTAL_COST: {
    key: 'TOTAL_COST',
    label: 'Total Cost',
    icon: DollarIcon,
  },
  MUD: {
    key: 'MUD',
    label: 'Mud',
    icon: MudIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-mud',
        fields: ['data.mud_density', 'data.mud_type'],
      },
    ],
    dataGetter: summaryData => ({
      mudDensity: get(summaryData, ['corva#data-mud', 'data', 'mud_density']),
      mudType: get(summaryData, ['corva#data-mud', 'data', 'mud_type']),
    }),
  },
  TARGET_FORMATION: {
    key: 'TARGET_FORMATION',
    label: 'Target Formation',
    icon: FormationIcon,
  },
  DIVERGENCE: {
    key: 'DIVERGENCE',
    label: 'Divergence From Plan',
    icon: DirectionalIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'directional-accuracy',
        fields: [
          'data.horizontal_plane.distance',
          'data.horizontal_plane.ahead',
          'data.horizontal_plane.right',
        ],
      },
    ],
    dataGetter: summaryData => ({
      distance: get(summaryData, [
        'corva#directional-accuracy',
        'data',
        'horizontal_plane',
        'distance',
      ]),
      ahead: get(summaryData, ['corva#directional-accuracy', 'data', 'horizontal_plane', 'ahead']),
      right: get(summaryData, ['corva#directional-accuracy', 'data', 'horizontal_plane', 'right']),
    }),
  },
  NPT: {
    key: 'NPT',
    label: 'NPT',
    icon: NptIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-npt-events',
        fields: ['data.type', 'data.start_time', 'data.end_time'],
      },
    ],
    dataGetter: summaryData => ({
      nptType: get(summaryData, ['corva#data-npt-events', 'data', 'type']),
      startTime: get(summaryData, ['corva#data-npt-events', 'data', 'start_time']),
      endTime: get(summaryData, ['corva#data-npt-events', 'data', 'end_time']),
    }),
  },
  OPERATIONS_SUMMARY: {
    key: 'OPERATIONS_SUMMARY',
    label: 'Operations Summary',
    icon: OperationSummaryIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'data-operation-summaries',
        fields: ['data'],
      },
    ],
    dataGetter: summaryData => ({
      dateTime: get(summaryData, ['corva#data-operation-summaries', 'data', 'date_time']),
      summary: get(summaryData, ['corva#data-operation-summaries', 'data', 'summary']),
    }),
  },
  ALERT: {
    key: 'ALERT',
    label: 'Alerts',
    icon: AlertIcon,
    dataSource: [
      {
        collection: 'alert',
      },
    ],
    dataGetter: summaryData => ({
      decisionPath: get(summaryData, ['alert', 'decision_path']),
    }),
  },
  ANNOTATION: {
    key: 'ANNOTATION',
    label: 'Comments',
    icon: AnnotationIcon,
    dataSource: [
      {
        collection: 'app_annotation',
      },
    ],
    dataGetter: summaryData => ({
      firstName: get(summaryData, ['app_annotation', 'user', 'first_name']),
      lastName: get(summaryData, ['app_annotation', 'user', 'last_name']),
      profilePhoto: get(summaryData, ['app_annotation', 'user', 'profile_photo']),
      content: get(summaryData, ['app_annotation', 'context', 'app_annotation', 'body']),
    }),
  },
  DRILLING_PERIOD: {
    key: 'DRILLING_PERIOD',
    label: 'Drilling Period',
    dataSource: [],
    dataGetter: summaryData => ({
      start: get(summaryData, ['asset', 'stats', 'drilling', 'start']),
      end: get(summaryData, ['asset', 'stats', 'drilling', 'end']),
    }),
  },
};

export const COMPLETION_WELL_SUMMARY = {
  PREVIOUS_24H_STAGE_COUNT: {
    key: 'COMPLETION_PREVIOUS_24H_STAGE_COUNT',
    label: 'Previous 24h Stages',
    dataGetter: summaryData => {
      const metrics = get(summaryData, ['corva#completion-metrics', 'data', 'metrics']);
      const previous24hStageCount = metrics
        ? get(
            metrics.filter(item => item.key === 'stage_count'),
            ['0', 'split']
          )
        : 0;
      return { previous24hStageCount };
    },
  },
  PREVIOUS_24H_PUMPING_HOURS: {
    key: 'COMPLETION_PREVIOUS_24H_PUMPING_HOURS',
    label: 'Previous 24h Pumping',
    dataGetter: summaryData => {
      const metrics = get(summaryData, ['corva#completion-metrics', 'data', 'metrics']);
      const previous24hPumpingHours = metrics
        ? get(
            metrics.filter(item => item.key === 'pumping_hours'),
            ['0', 'split']
          )
        : 0;
      return { previous24hPumpingHours };
    },
  },
  LAST_ACTIVE: {
    key: 'COMPLETION_LAST_ACTIVE',
    label: 'Last Active',
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-wits',
        fields: ['timestamp'],
      },
      {
        provider: 'corva',
        collection: 'wireline-wits',
        fields: ['timestamp'],
      },
    ],
    dataGetter: summaryData => {
      const fracTimestamp = get(summaryData, ['corva#completion-wits', 'timestamp']);
      const wirelineTimestamp = get(summaryData, ['corva#wireline-wits', 'timestamp']);

      let timestamp = null;
      if (fracTimestamp && wirelineTimestamp) {
        timestamp = fracTimestamp > wirelineTimestamp ? fracTimestamp : wirelineTimestamp;
      } else if (fracTimestamp) {
        timestamp = fracTimestamp;
      } else if (wirelineTimestamp) {
        timestamp = wirelineTimestamp;
      }
      return { timestamp };
    },
  },
  CURRENT_ACTIVITY: {
    key: 'COMPLETION_CURRENT_ACTIVITY',
    label: 'Current Activity',
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-wits',
        fields: ['timestamp'],
      },
      {
        provider: 'corva',
        collection: 'wireline-wits',
        fields: ['timestamp'],
      },
    ],
    dataGetter: summaryData => {
      const fracTimiestamp = get(summaryData, ['corva#completion-wits', 'timestamp']);
      const wirelineTimestamp = get(summaryData, ['corva#wireline-wits', 'timestamp']);

      let activityName = '';
      if (fracTimiestamp && wirelineTimestamp) {
        activityName = fracTimiestamp > wirelineTimestamp ? 'frac' : 'wireline';
      } else if (fracTimiestamp) {
        activityName = 'frac';
      } else if (wirelineTimestamp) {
        activityName = 'wireline';
      }
      return { activityName };
    },
  },
  STAGE: {
    key: 'COMPLETION_STAGE',
    label: 'Stage',
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-wits',
        fields: ['stage_number'],
      },
      {
        provider: 'corva',
        collection: 'completion-data-stages',
        fields: ['data.stage_number'],
      },
    ],
    dataGetter: summaryData => {
      const planned = get(summaryData, ['corva#completion-data-stages', 'data', 'stage_number']);
      const actual = get(summaryData, ['corva#completion-wits', 'stage_number']);
      return { planned, actual };
    },
  },
  PROPPANTS: {
    key: 'COMPLETION_PROPPANTS',
    label: 'Proppant Type',
    icon: ProppantIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-data-actual-stages',
        fields: ['data.proppants'],
      },
    ],
    dataGetter: summaryData => ({
      proppants:
        get(summaryData, ['corva#completion-data-actual-stages', 'data', 'proppants']) || [],
    }),
  },
  FLUIDS: {
    key: 'COMPLETION_FLUIDS',
    label: 'Fluid Type',
    icon: FluidIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-data-actual-stages',
        fields: ['data.fluids'],
      },
    ],
    dataGetter: summaryData => ({
      fluids: get(summaryData, ['corva#completion-data-actual-stages', 'data', 'fluids']) || [],
    }),
  },
  TARGET_FORMATION: {
    key: 'COMPLETION_TARGET_FORMATION',
    label: 'Target Formation',
    icon: FormationIcon,
  },
  NPT: {
    key: 'COMPLETION_NPT',
    label: 'NPT',
    icon: NptIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-data-npt-events',
        fields: ['data.type', 'data.start_time', 'data.end_time'],
      },
    ],
    dataGetter: summaryData => ({
      nptType: get(summaryData, ['corva#completion-data-npt-events', 'data', 'type']),
      startTime: get(summaryData, ['corva#completion-data-npt-events', 'data', 'start_time']),
      endTime: get(summaryData, ['corva#completion-data-npt-events', 'data', 'end_time']),
    }),
  },
  PLUGS_DRILLED_COUNT: {
    key: 'PLUGS_DRILLED_COUNT',
    label: 'Plugs drilled',
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-data-plugs',
        fields: ['data'],
      },
    ],
    dataGetter: summaryData => ({
      plugsDrilledCount: (get(summaryData, ['corva#completion-data-plugs']) || []).length,
    }),
  },
  OPERATIONS_SUMMARY: {
    key: 'COMPLETION_OPERATIONS_SUMMARY',
    label: 'Operations Summary',
    icon: OperationSummaryIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'completion-data-operation-summaries',
        fields: ['data'],
      },
    ],
    dataGetter: summaryData => ({
      dateTime: get(summaryData, [
        'corva#completion-data-operation-summaries',
        'data',
        'date_time',
      ]),
      summary: get(summaryData, ['corva#completion-data-operation-summaries', 'data', 'summary']),
    }),
  },
  ALERT: {
    key: 'COMPLETION_ALERT',
    label: 'Alerts',
    icon: AlertIcon,
    dataSource: [
      {
        collection: 'alert',
      },
    ],
    dataGetter: summaryData => ({
      decisionPath: get(summaryData, ['alert', 'decision_path']),
    }),
  },
  ANNOTATION: {
    key: 'COMPLETION_ANNOTATION',
    label: 'Comments',
    icon: AnnotationIcon,
    dataSource: [
      {
        collection: 'app_annotation',
      },
    ],
    dataGetter: summaryData => ({
      firstName: get(summaryData, ['app_annotation', 'user', 'first_name']),
      lastName: get(summaryData, ['app_annotation', 'user', 'last_name']),
      profilePhoto: get(summaryData, ['app_annotation', 'user', 'profile_photo']),
      content: get(summaryData, ['app_annotation', 'context', 'app_annotation', 'body']),
    }),
  },
  COMPLETION_PERIOD: {
    key: 'COMPLETION_PERIOD',
    label: 'Completion Period',
    dataSource: [],
    dataGetter: summaryData => ({
      start: get(summaryData, ['asset', 'stats', 'completion', 'start']),
      end: get(summaryData, ['asset', 'stats', 'completion', 'end']),
    }),
  },
  TOTAL_FRAC_TIME: {
    key: 'TOTAL_FRAC_TIME',
    label: 'Total Frac Time',
    dataSource: [],
  },
  TOTAL_WIRELINE_TIME: {
    key: 'TOTAL_WIRELINE_TIME',
    label: 'Total Wireline Time',
    dataSource: [],
  },
  STAGES_DESIGN: {
    key: 'STAGES_DESIGN',
    label: 'Stages Design vs Actual',
    dataSource: [
      {
        collection: 'completion-data-stages',
      },
    ],
    dataGetter: summaryData => ({
      totalNumberOfStages: get(summaryData, ['completion-data-stages', 'data', 'stage_number']),
    }),
  },
};

export const DRILLOUT_WELL_SUMMARY = {
  MUD: {
    key: 'DRILLOUT_MUD',
    label: 'Mud',
    icon: MudIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'drillout-data-mud',
        fields: ['data.mud_density', 'data.mud_type'],
      },
    ],
    dataGetter: summaryData => ({
      mudDensity: get(summaryData, ['corva#drillout-data-mud', 'data', 'mud_density']),
      mudType: get(summaryData, ['corva#drillout-data-mud', 'data', 'mud_type']),
    }),
  },
  BHA: {
    key: 'DRILLOUT_BHA',
    label: 'BHA',
    icon: BhaIcon,
    dataSource: [
      {
        provider: 'corva',
        collection: 'drillout-data-drillstring',
        fields: [
          'timestamp',
          'data.id',
          'data.components.family',
          'data.components.material',
          'data.components.stabilizer',
          'data.components.bit_type',
          'data.setting_timestamp',
        ],
      },
    ],
    dataGetter: summaryData => ({
      components: get(summaryData, ['corva#drillout-data-drillstring', 'data', 'components']),
      bhaId: get(summaryData, ['corva#drillout-data-drillstring', 'data', 'id']),
    }),
  },
};
