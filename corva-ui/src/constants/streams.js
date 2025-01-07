import { SEGMENTS } from './segment';

export const NAME = 'streams';
export const UPDATE_STREAMS = 'UPDATE_STREAMS';
export const UPDATE_CURRENT_STREAM = 'UPDATE_CURRENT_STREAM';

export const NEW_STREAM_FROM_WITSML = {
  NAME: 'corva.wits-meta-lookup',

  SUBSCRIPTIONS: [
    {
      provider: 'corva',
      collection: 'corva.wits-meta-lookup',
      event: 'update',
      meta: { subscribeOnly: true },
    },
  ],

  SERVER_URLS: [
    'https://witsml.welldata.net/witsml/wmls.asmx',
    'https://witsml2.welldata.net/witsml/wmls.asmx',
    'https://witsml.welldata.ca/witsml/wmls.asmx',
    'https://hub.us.pason.com/hub/witsml/store',
    'https://hub.pason.com/hub/witsml/store',
    'https://witsml.mywells.com/MWCommServices/WMLS',
    'Other',
  ],

  SEGMENT_COLUMN_MAPPING: {
    [SEGMENTS.DRILLING]: {
      COLUMNS: [
        {
          targetName: 'bit_depth',
          targetNameLabel: 'Bit Depth',
          isRequired: true,
          isRequiredForCoil: true,
        },
        {
          targetName: 'hole_depth',
          targetNameLabel: 'Hole Depth',
          isRequired: true,
        },
        {
          targetName: 'block_height',
          targetNameLabel: 'Block Height',
          isRequired: true,
        },
        {
          targetName: 'hook_load',
          targetNameLabel: 'Hook Load',
          isRequired: true,
          isRequiredForCoil: true,
        },
        {
          targetName: 'rotary_torque',
          targetNameLabel: 'Rotary Torque',
          isRequired: true,
        },
        {
          targetName: 'weight_on_bit',
          targetNameLabel: 'Weight on Bit',
          isRequired: true,
        },
        {
          targetName: 'rocker_status',
          targetNameLabel: 'Rocker Status',
          isRequired: false,
        },
        {
          targetName: 'rop',
          targetNameLabel: 'ROP',
          isRequired: true,
        },
        {
          targetName: 'rop_average',
          targetNameLabel: 'ROP (Average)',
          isRequired: false,
        },
        {
          targetName: 'rotary_rpm',
          targetNameLabel: 'Rotary RPM',
          isRequired: true,
        },
        {
          targetName: 'standpipe_pressure',
          targetNameLabel: 'Standpipe Pressure',
          isRequired: true,
          isRequiredForCoil: true,
        },
        {
          targetName: 'diff_press',
          targetNameLabel: 'Differential Pressure',
          isRequired: false,
        },
        {
          targetName: 'mud_flow_in',
          targetNameLabel: 'Mud Flow In',
          isRequired: true,
          isRequiredForCoil: true,
        },
        {
          targetName: 'mud_flow_out_percent',
          targetNameLabel: 'Mud Flow Out %',
          isRequired: false,
        },
        {
          targetName: 'mud_flow_out',
          targetNameLabel: 'Mud Flow Out',
          isRequired: false,
        },
        {
          targetName: 'pump_spm_total',
          targetNameLabel: 'Pump Total Strokes Rate',
          isRequired: false,
        },
        {
          targetName: 'pump_spm_1',
          targetNameLabel: 'Pump 1 strokes/min',
          isRequired: false,
        },
        {
          targetName: 'pump_spm_2',
          targetNameLabel: 'Pump 2 strokes/min',
          isRequired: false,
        },
        {
          targetName: 'pump_spm_3',
          targetNameLabel: 'Pump 3 strokes/min',
          isRequired: false,
        },
        {
          targetName: 'pump_spm_4',
          targetNameLabel: 'Pump 4 strokes/min',
          isRequired: false,
        },
        {
          targetName: 'mud_density',
          targetNameLabel: 'Mud Density',
          isRequired: false,
        },
        {
          targetName: 'strks_total',
          targetNameLabel: 'Total Strokes',
          isRequired: false,
        },
        {
          targetName: 'strks_pump_1',
          targetNameLabel: 'Pump 1 Total Strokes',
          isRequired: false,
        },
        {
          targetName: 'strks_pump_2',
          targetNameLabel: 'Pump 2 Total Strokes',
          isRequired: false,
        },
        {
          targetName: 'strks_pump_3',
          targetNameLabel: 'Pump 3 Total Strokes',
          isRequired: false,
        },
        {
          targetName: 'gain_loss',
          targetNameLabel: 'Gain/loss',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_1',
          targetNameLabel: 'Mud Tank 1 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_2',
          targetNameLabel: 'Mud Tank 2 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_3',
          targetNameLabel: 'Mud Tank 3 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_4',
          targetNameLabel: 'Mud Tank 4 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_5',
          targetNameLabel: 'Mud Tank 5 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_6',
          targetNameLabel: 'Mud Tank 6 Volume',
          isRequired: false,
        },
        {
          targetName: 'pit_volume_7',
          targetNameLabel: 'Mud Tank 7 Volume',
          isRequired: false,
        },
        {
          targetName: 'gamma_ray',
          targetNameLabel: 'Gamma',
          isRequired: false,
        },
        {
          targetName: 'magnetic_tool_face',
          targetNameLabel: 'Magnetic Tool Face',
          isRequired: false,
        },
        {
          targetName: 'gravity_tool_face',
          targetNameLabel: 'Gravity Tool Face',
          isRequired: false,
        },
        {
          targetName: 'ad_wob_setpoint',
          targetNameLabel: 'AutoDriller WOB SP',
          isRequired: false,
        },
        {
          targetName: 'ad_rop_setpoint',
          targetNameLabel: 'AutoDriller On Bottom ROP Setpoint',
          isRequired: false,
        },
        {
          targetName: 'ad_diff_press_setpoint',
          targetNameLabel: 'AutoDriller Diff Press SP',
          isRequired: false,
        },
        {
          targetName: 'ad_torque_limit',
          targetNameLabel: 'AutoDriller Torque Limit',
          isRequired: false,
        },
        {
          targetName: 'continuous_inclination',
          targetNameLabel: 'Continuous Inclination',
          isRequired: false,
        },
        {
          targetName: 'mwd_annulus_ecd',
          targetNameLabel: 'MWD Annulus ECD',
          isRequired: false,
        },
        {
          targetName: 'mwd_annulus_pressure',
          targetNameLabel: 'MWD Annulus Pressure',
          isRequired: false,
        },
        {
          targetName: 'total_gas',
          targetNameLabel: 'Total Gas',
          isRequired: false,
        },
        {
          targetName: 'lateral_shock',
          targetNameLabel: 'Lateral Shock',
          isRequired: false,
        },
        {
          targetName: 'axial_shock',
          targetNameLabel: 'Axial Shock',
          isRequired: false,
        },
        {
          targetName: 'casing_pressure',
          targetNameLabel: 'Casing Pressure',
          isRequired: false,
        },
        {
          targetName: 'annular_back_pressure',
          targetNameLabel: 'Annular Back Pressure',
          isRequired: false,
        },
        {
          targetName: 'drillsmart_onoff',
          targetNameLabel: 'DrillSmart On/Off',
          isRequired: false,
        },
        {
          targetName: 'rockit_onoff',
          targetNameLabel: 'ROCKit On/Off',
          isRequired: false,
        },
        {
          targetName: 'revit_onoff',
          targetNameLabel: 'REVit On/Off',
          isRequired: false,
        },
        {
          targetName: 'rockit_pilot_onoff',
          targetNameLabel: 'ROCKit Pilot On/Off',
          isRequired: false,
        },
        {
          targetName: 'process_auto_onoff',
          targetNameLabel: 'Process Automation On/Off',
          isRequired: false,
        },
        {
          targetName: 'das_time',
          targetNameLabel: 'DAS Time',
          isRequired: false,
        },
        {
          targetName: 'das_recommended_wob',
          targetNameLabel: 'DAS Recommended WOB',
          isRequired: false,
        },
        {
          targetName: 'das_recommended_rpm',
          targetNameLabel: 'DAS Recommended RPM',
          isRequired: false,
        },
        {
          targetName: 'das_recommended_flow',
          targetNameLabel: 'DAS Recommended Flow',
          isRequired: false,
        },
        {
          targetName: 'das_learning_score',
          targetNameLabel: 'DAS Learning Score',
          isRequired: false,
        },
        {
          targetName: 'das_stick_slip',
          targetNameLabel: 'DAS Stick Slip',
          isRequired: false,
        },
        {
          targetName: 'das_bit_rpm_min',
          targetNameLabel: 'DAS Bit RPM Min',
          isRequired: false,
        },
        {
          targetName: 'das_bit_rpm_max',
          targetNameLabel: 'DAS Bit RPM Max',
          isRequired: false,
        },
        {
          targetName: 'das_mu',
          targetNameLabel: 'DAS mu',
          isRequired: false,
        },
        {
          targetName: 'das_doc',
          targetNameLabel: 'DAS DOC',
          isRequired: false,
        },
        {
          targetName: 'das_mse',
          targetNameLabel: 'DAS MSE',
          isRequired: false,
        },
        {
          targetName: 'das_rop',
          targetNameLabel: 'DAS ROP',
          isRequired: false,
        },
        {
          targetName: 'das_bha_tse',
          targetNameLabel: 'DAS BHA TSE',
          isRequired: false,
        },
        {
          targetName: 'das_recommended_rop',
          targetNameLabel: 'DAS Recommended ROP',
          isRequired: false,
        },
        {
          targetName: 'das_downhole_mse',
          targetNameLabel: 'DAS Downhole MSE',
          isRequired: false,
        },
        {
          targetName: 'das_rop_upper_limit',
          targetNameLabel: 'DAS ROP Upper Limit',
          isRequired: false,
        },
        {
          targetName: 'das_rop_lower_limit',
          targetNameLabel: 'DAS ROP Lower Limit',
          isRequired: false,
        },
        {
          targetName: 'das_wob_upper_limit',
          targetNameLabel: 'DAS WOB Upper Limit',
          isRequired: false,
        },
        {
          targetName: 'das_wob_lower_limit',
          targetNameLabel: 'DAS WOB Lower Limit',
          isRequired: false,
        },
        {
          targetName: 'das_rpm_upper_limit',
          targetNameLabel: 'DAS RPM Upper Limit',
          isRequired: false,
        },
        {
          targetName: 'das_rpm_lower_limit',
          targetNameLabel: 'DAS RPM Lower Limit',
          isRequired: false,
        },
        {
          targetName: 'das_in_control',
          targetNameLabel: 'DAS in Control',
          isRequired: false,
        },
        {
          targetName: 'das_rop_limiting_max',
          targetNameLabel: 'DAS ROP Limiting Max',
          isRequired: false,
        },
        {
          targetName: 'das_status',
          targetNameLabel: 'DAS Status',
          isRequired: false,
        },
        {
          targetName: 'das_stall_detector_status',
          targetNameLabel: 'DAS Stall Detector Status',
          isRequired: false,
        },
        {
          targetName: 'wave_sp_tracking_status',
          targetNameLabel: 'Wave SP Tracking Status',
          isRequired: false,
        },
        {
          targetName: 'wave_stick_slip_threshold',
          targetNameLabel: 'Wave Stick Slip Threshold',
          isRequired: false,
        },
        {
          targetName: 'wave_limiting_status',
          targetNameLabel: 'Wave Limiting Status',
          isRequired: false,
        },
        {
          targetName: 'wave_aggressiveness',
          targetNameLabel: 'Wave Aggressiveness',
          isRequired: false,
        },
        {
          targetName: 'trip_tank_volume_1',
          targetNameLabel: 'Trip Tank Volume 1',
          isRequired: false,
        },
        {
          targetName: 'trip_tank_volume_2',
          targetNameLabel: 'Trip Tank Volume 2',
          isRequired: false,
        },
        {
          targetName: 'trip_tank_volume_3',
          targetNameLabel: 'Trip Tank Volume 3',
          isRequired: false,
        },
        {
          targetName: 'choke_pressure',
          targetNameLabel: 'Choke Pressure',
          isRequired: false,
        },
        {
          targetName: 'kill_pressure',
          targetNameLabel: 'Kill Pressure',
          isRequired: false,
        },
        {
          targetName: 'wellhead_pressure',
          targetNameLabel: 'Wellhead Pressure',
          isRequired: false,
        },
        {
          targetName: 'active_pit_volume',
          targetNameLabel: 'Active Pit Volume',
          isRequired: false,
        },
        {
          targetName: 'total_pit_volume',
          targetNameLabel: 'Total Pit Volume',
          isRequired: false,
        },
        {
          targetName: 'mwd_downhole_stick_slip',
          targetNameLabel: 'MWD Downhole Stick Slip',
          isRequired: false,
        },
      ],

      AUTO_RESOLVER: [
        {
          targetName: 'bit_depth',
          sourceNames: ['bdep', 'bit position', 'bit depth', 'bit_depth', 'bitdepth', 'deptbitm'],
        },
        {
          targetName: 'hole_depth',
          sourceNames: ['dept', 'hole depth', 'tot_dpt_md', 'holedepth', 'deptmeas'],
        },
        {
          targetName: 'block_height',
          sourceNames: ['bht', 'block height', 'block_pos', 'bpos', 'blkpos'],
        },
        {
          targetName: 'hook_load',
          sourceNames: ['hl', 'hook load', 'hookload_max', 'hookload', 'hkla'],
        },
        {
          targetName: 'rotary_torque',
          sourceNames: [
            'tor',
            'rotary torque',
            'top drive torque',
            'td_torque',
            'torque',
            'torqtdfl',
          ],
        },
        {
          targetName: 'weight_on_bit',
          sourceNames: ['wob', 'weight on bit', 'weight on bit', 'bit weight', 'woba'],
        },
        {
          targetName: 'rocker_status',
          sourceNames: ['TDSTA', 'Top Drive State'],
        },
        {
          targetName: 'rop',
          sourceNames: [
            'obr',
            'on bottom rop',
            'rop',
            'rop - average',
            'fast_rop_ft_hr',
            'rate of penetration',
            'ropa',
          ],
        },
        {
          targetName: 'rop_average',
          sourceNames: [],
        },
        {
          targetName: 'rotary_rpm',
          sourceNames: ['rpm', 'rotary rpm', 'top drive rpm', 'td_speed', 'rpmtd'],
        },
        {
          targetName: 'standpipe_pressure',
          sourceNames: ['spp', 'standpipe pressure', 'pump pressure', 'stp_prs_1', 'sppa'],
        },
        {
          targetName: 'diff_press',
          sourceNames: [
            'difp',
            'differential pressure',
            'diff press',
            'diff_press',
            'diff',
            'diffpres',
          ],
        },
        {
          targetName: 'mud_flow_in',
          sourceNames: ['tpo', 'total pump output', 'flow in rate', 'flow_in', 'flowin', 'mfia'],
        },
        {
          targetName: 'mud_flow_out_percent',
          sourceNames: [
            'flow_out_percent',
            'flow out %',
            'flow out percent',
            'flow_out_rel',
            'flow',
            'flow out rate',
            'flow_out',
            'mfop',
          ], // NOTE: This line is from 'mud_flow_out'
        },
        {
          targetName: 'mud_flow_out',
          sourceNames: [],
        },
        {
          targetName: 'pump_spm_total',
          sourceNames: [
            'tpd',
            'totalpumpdisplacement',
            'pump total strokes rate',
            'tot_spm',
            'pump spm - total',
            'pump_displacement',
            'spmtot',
          ],
        },
        {
          targetName: 'pump_spm_1',
          sourceNames: ['spm1', 'pump 1 strokes/min', 'mp1_spm', 'pump spm 1'],
        },
        {
          targetName: 'pump_spm_2',
          sourceNames: ['spm2', 'pump 2 strokes/min', 'mp2_spm', 'pump spm 2'],
        },
        {
          targetName: 'pump_spm_3',
          sourceNames: ['spm3', 'pump 3 strokes/min', 'mp3_spm', 'pump spm 3'],
        },
        {
          targetName: 'pump_spm_4',
          sourceNames: ['spm4', 'pump 4 strokes/min', 'mp4_spm', 'pump spm 4'],
        },
        {
          targetName: 'mud_density',
          sourceNames: ['MDEN'],
        },
        {
          targetName: 'strks_total',
          sourceNames: ['ts1-4', 'total strokes p1+p2+p3+p4', 'pump_strokes'],
        },
        {
          targetName: 'strks_pump_1',
          sourceNames: ['pump 1 strokes/min', 'pump 1 total strokes', 'mp1_stk'],
        },
        {
          targetName: 'strks_pump_2',
          sourceNames: ['pump 2 strokes/min', 'pump 2 total strokes', 'mp2_stk'],
        },
        {
          targetName: 'strks_pump_3',
          sourceNames: ['pump 3 strokes/min', 'pump 3 total strokes', 'mp3_stk', 'ts3'],
        },
        {
          targetName: 'gain_loss',
          sourceNames: ['vtgl', 'flow 1 gain/loss', 'gain loss', 'gainloss'],
        },
        {
          targetName: 'pit_volume_1',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_2',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_3',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_4',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_5',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_6',
          sourceNames: [],
        },
        {
          targetName: 'pit_volume_7',
          sourceNames: [],
        },
        {
          targetName: 'gamma_ray',
          sourceNames: ['gamma', 'gamma_ray', 'gamma ray', 'gr', 'gam', 'grc'],
        },
        {
          targetName: 'magnetic_tool_face',
          sourceNames: [
            'magnetic tool face',
            'magnetic toolface',
            'magnetic_tool_face',
            'mtf',
            'toolface mag',
            'srv_mag_tf',
            'svymtf',
          ],
        },
        {
          targetName: 'gravity_tool_face',
          sourceNames: [
            'gravity tool face',
            'gravity toolface',
            'gravity_tool_face',
            'gtf',
            'toolface grav',
            'srv_gra_tf',
            'svygtf',
          ],
        },
        {
          targetName: 'ad_wob_setpoint',
          sourceNames: [
            'ad wob setpoint',
            'ad wob set point',
            'autodriller wob sp',
            'adwoblimit',
            'wobsp',
          ],
        },
        {
          targetName: 'ad_rop_setpoint',
          sourceNames: [
            'ad rop setpoint',
            'ad rop set point',
            'autodriller on bottom rop setpoint',
            'adropactual',
            'dtdsp',
          ],
        },
        {
          targetName: 'ad_diff_press_setpoint',
          sourceNames: [
            'ad delta p setpoint',
            'ad delta p set point',
            'autodriller diff press sp',
            'addiffpresspval',
            'DDPSP',
            'ddpsp',
          ],
        },
        {
          targetName: 'ad_torque_limit',
          sourceNames: ['ADTSP', 'adtsp'],
        },
        {
          targetName: 'continuous_inclination',
          sourceNames: ['dynin'],
        },
        {
          targetName: 'mwd_annulus_ecd',
          sourceNames: ['Ecd Bit', 'ecd_bit'],
        },
        {
          targetName: 'mwd_annulus_pressure',
          sourceNames: ['Ann Press Dh', 'ann_press_dh'],
        },
        {
          targetName: 'total_gas',
          sourceNames: ['3gas', 'pgas', 'total_gas', 'gas_total', '3_gas'],
        },
        {
          targetName: 'lateral_shock',
          sourceNames: [],
        },
        {
          targetName: 'axial_shock',
          sourceNames: [],
        },
        {
          targetName: 'casing_pressure',
          sourceNames: ['pcas'],
        },
        {
          targetName: 'annular_back_pressure',
          sourceNames: ['Annular Pressure', 'Annular Back Pressure', 'Back Pressure'],
        },
        {
          targetName: 'drillsmart_onoff',
          sourceNames: [],
        },
        {
          targetName: 'rockit_onoff',
          sourceNames: [],
        },
        {
          targetName: 'revit_onoff',
          sourceNames: [],
        },
        {
          targetName: 'rockit_pilot_onoff',
          sourceNames: [],
        },
        {
          targetName: 'process_auto_onoff',
          sourceNames: [],
        },
        {
          targetName: 'das_time',
          sourceNames: ['datm'],
        },
        {
          targetName: 'das_recommended_wob',
          sourceNames: ['darw'],
        },
        {
          targetName: 'das_recommended_rpm',
          sourceNames: ['darr'],
        },
        {
          targetName: 'das_recommended_flow',
          sourceNames: ['darf'],
        },
        {
          targetName: 'das_learning_score',
          sourceNames: ['dals'],
        },
        {
          targetName: 'das_stick_slip',
          sourceNames: ['datse'],
        },
        {
          targetName: 'das_bit_rpm_min',
          sourceNames: ['dbrmn'],
        },
        {
          targetName: 'das_bit_rpm_max',
          sourceNames: ['dbrmx'],
        },
        {
          targetName: 'das_mu',
          sourceNames: ['damu'],
        },
        {
          targetName: 'das_doc',
          sourceNames: ['dadoc'],
        },
        {
          targetName: 'das_mse',
          sourceNames: ['damse'],
        },
        {
          targetName: 'das_rop',
          sourceNames: ['darop'],
        },
        {
          targetName: 'das_bha_tse',
          sourceNames: ['dbtse'],
        },
        {
          targetName: 'das_recommended_rop',
          sourceNames: ['drrop'],
        },
        {
          targetName: 'das_downhole_mse',
          sourceNames: ['dmsed'],
        },
        {
          targetName: 'das_rop_upper_limit',
          sourceNames: ['drplx'],
        },
        {
          targetName: 'das_rop_lower_limit',
          sourceNames: ['drpln'],
        },
        {
          targetName: 'das_wob_upper_limit',
          sourceNames: ['dwblx'],
        },
        {
          targetName: 'das_wob_lower_limit',
          sourceNames: ['dwbln'],
        },
        {
          targetName: 'das_rpm_upper_limit',
          sourceNames: ['drmlx'],
        },
        {
          targetName: 'das_rpm_lower_limit',
          sourceNames: ['drmln'],
        },
        {
          targetName: 'das_in_control',
          sourceNames: ['dacon'],
        },
        {
          targetName: 'das_rop_limiting_max',
          sourceNames: ['drplm'],
        },
        {
          targetName: 'das_status',
          sourceNames: ['dasst'],
        },
        {
          targetName: 'das_stall_detector_status',
          sourceNames: ['dasds'],
        },
        {
          targetName: 'wave_sp_tracking_status',
          sourceNames: ['wsts'],
        },
        {
          targetName: 'wave_stick_slip_threshold',
          sourceNames: ['wsst'],
        },
        {
          targetName: 'wave_limiting_status',
          sourceNames: ['wls'],
        },
        {
          targetName: 'wave_aggressiveness',
          sourceNames: ['waagg'],
        },
        {
          targetName: 'trip_tank_volume_1',
          sourceNames: ['ttk1'],
        },
        {
          targetName: 'trip_tank_volume_2',
          sourceNames: ['ttk2'],
        },
        {
          targetName: 'trip_tank_volume_3',
          sourceNames: ['ttk3'],
        },
        {
          targetName: 'choke_pressure',
          sourceNames: ['cp'],
        },
        {
          targetName: 'kill_pressure',
          sourceNames: ['kp'],
        },
        {
          targetName: 'wellhead_pressure',
          sourceNames: ['whp'],
        },
        {
          targetName: 'active_pit_volume',
          sourceNames: ['active'],
        },
        {
          targetName: 'total_pit_volume',
          sourceNames: [],
        },
        {
          targetName: 'mwd_downhole_stick_slip',
          sourceNames: [],
        },
      ],

      UNITS: [
        {
          type: 'pressure',
          value: {
            imperial: 'psi',
            metric: 'kPa',
          },
          targetNames: [
            'annulus_pressure_loss',
            'diff_press',
            'downhole_mse',
            'ecd_at_bit',
            'ad_diff_press_setpoint',
            'predicted_ecd_at_casing',
            'standpipe_pressure',
            'mwd_annulus_pressure',
            'casing_pressure',
            'annular_back_pressure',
            'choke_pressure',
            'kill_pressure',
            'wellhead_pressure',
          ],
        },
        {
          type: 'length',
          value: {
            imperial: 'ft',
            metric: 'm',
          },
          targetNames: ['bit_depth', 'block_height', 'hole_depth', 'rop', 'rop_average'],
        },
        {
          type: 'force',
          value: {
            imperial: 'klbf',
            metric: 'kdaN',
          },
          targetNames: [
            'hook_load',
            'weight_on_bit',
            'ad_wob_setpoint',
            'das_recommended_wob',
            'das_wob_upper_limit',
            'das_wob_lower_limit',
          ],
        },
        {
          type: 'torque',
          value: {
            imperial: 'ft-lbf',
            metric: 'Nm',
          },
          optionalValue: 'ft-klbf',
          targetNames: [
            'rotary_torque',
            'pdm_torque',
            'surface_torque',
            'total_bit_torque',
            'ad_torque_limit',
          ],
        },
        {
          type: 'volume',
          value: {
            imperial: 'gal',
            metric: 'm3',
          },
          targetNames: ['recommended_minimum_flowrate'],
        },
        {
          type: 'volumeFlowRate',
          value: {
            imperial: 'gal/min',
            metric: 'm3/min',
          },
          targetNames: ['mud_flow_in', 'mud_flow_out', 'das_recommended_flow'],
        },
        {
          type: 'oil',
          value: {
            imperial: 'bbl',
            metric: 'm3',
          },
          targetNames: [
            'gain_loss',
            'pit_volume_1',
            'pit_volume_2',
            'pit_volume_3',
            'pit_volume_4',
            'pit_volume_5',
            'pit_volume_6',
            'pit_volume_7',
            'trip_tank_volume_1',
            'trip_tank_volume_2',
            'trip_tank_volume_3',
            'active_pit_volume',
            'total_pit_volume',
          ],
        },
        {
          type: 'unitless',
          value: {
            imperial: 'unitless',
            metric: 'unitless',
          },
          targetNames: [
            'rocker_status',
            'rotary_rpm',
            'pump_spm_total',
            'pump_spm_1',
            'pump_spm_2',
            'pump_spm_3',
            'pump_spm_4',
            'gamma_ray',
            'mud_flow_out_percent',
            'strks_total',
            'strks_pump_1',
            'strks_pump_2',
            'strks_pump_3',
            'total_gas',
            'lateral_shock',
            'axial_shock',
            'drillsmart_onoff',
            'rockit_onoff',
            'revit_onoff',
            'rockit_pilot_onoff',
            'process_auto_onoff',
            'das_recommended_rpm',
            'das_learning_score',
            'das_stick_slip',
            'das_bit_rpm_min',
            'das_bit_rpm_max',
            'das_mu',
            'das_bha_tse',
            'das_rpm_upper_limit',
            'das_rpm_lower_limit',
            'das_in_control',
            'das_status',
            'das_stall_detector_status',
            'wave_sp_tracking_status',
            'wave_stick_slip_threshold',
            'wave_limiting_status',
            'wave_aggressiveness',
            'mwd_downhole_stick_slip',
          ],
        },
        {
          type: null,
          value: {
            imperial: 'rpm',
            metric: 'rpm',
          },
          targetNames: ['pdm_rpm', 'total_bit_rpm'],
        },
        {
          type: null,
          value: {
            imperial: '%',
            metric: '%',
          },
          targetNames: [],
        },
        {
          type: 'angle',
          value: {
            imperial: 'deg',
            metric: 'deg',
          },
          targetNames: ['magnetic_tool_face', 'gravity_tool_face', 'continuous_inclination'],
        },
        {
          type: 'density',
          value: {
            imperial: 'ppg',
            metric: 'kg/m3',
          },
          targetNames: ['mwd_annulus_ecd', 'mud_density'],
        },
        {
          type: 'speed',
          value: {
            imperial: 'ft/h',
            metric: 'm/h',
          },
          targetNames: [
            'ad_rop_setpoint',
            'das_rop',
            'das_recommended_rop',
            'das_rop_upper_limit',
            'das_rop_lower_limit',
            'das_rop_limiting_max',
          ],
        },
        {
          type: 'time',
          value: {
            imperial: 's',
            metric: 's',
          },
          targetNames: ['das_time'],
        },
        {
          type: 'lengthPerAngle',
          value: {
            imperial: 'in/rev',
            metric: 'mm/rev',
          },
          targetNames: ['das_doc'],
        },
        {
          type: 'msePressure',
          value: {
            imperial: 'ksi',
            metric: 'ksi',
          },
          targetNames: ['das_mse', 'das_downhole_mse'],
        },
      ],
    },

    [SEGMENTS.COMPLETION]: {
      COLUMNS: [
        {
          targetName: 'date_time',
          targetNameLabel: 'Date Time',
          isRequired: true,
        },
        {
          targetName: 'wellhead_pressure',
          targetNameLabel: 'Wellhead Pressure',
          isRequired: true,
        },
        {
          targetName: 'backside_pressure',
          targetNameLabel: 'Backside Pressure',
          isRequired: false,
        },
        {
          targetName: 'clean_flow_rate_in',
          targetNameLabel: 'Clean Flow Rate',
          isRequired: false,
        },
        {
          targetName: 'slurry_flow_rate_in',
          targetNameLabel: 'Slurry Flow Rate',
          isRequired: true,
        },
        {
          targetName: 'total_clean_volume_in',
          targetNameLabel: 'Clean Flow Total',
          isRequired: false,
        },
        {
          targetName: 'total_slurry_volume_in',
          targetNameLabel: 'Slurry Flow Total',
          isRequired: false,
        },
        {
          targetName: 'total_pump_spm',
          targetNameLabel: 'Pump Flow Rate',
          isRequired: false,
        },
        {
          targetName: 'proppant_1_concentration',
          targetNameLabel: 'Proppant 1 (Concentration)',
          isRequired: true,
        },
        {
          targetName: 'proppant_1_mass',
          targetNameLabel: 'Proppant 1 (Mass)',
          isRequired: false,
        },
        {
          targetName: 'proppant_2_concentration',
          targetNameLabel: 'Proppant 2 (Concentration)',
          isRequired: false,
        },
        {
          targetName: 'proppant_2_mass',
          targetNameLabel: 'Proppant 2 (Mass)',
          isRequired: false,
        },
        {
          targetName: 'slurry_density',
          targetNameLabel: 'Slurry Density',
          isRequired: false,
        },
        {
          targetName: 'enzyme_breaker',
          targetNameLabel: 'Liquid EB',
          isRequired: false,
        },
        {
          targetName: 'scale_inhibitor',
          targetNameLabel: 'Scale Inhibitor',
          isRequired: false,
        },
        {
          targetName: 'surfactant',
          targetNameLabel: 'Surfactant',
          isRequired: false,
        },
        {
          targetName: 'powder_breaker',
          targetNameLabel: 'Powder Breaker',
          isRequired: false,
        },
        {
          targetName: 'friction_reducer',
          targetNameLabel: 'Liquid FR',
          isRequired: false,
        },
        {
          targetName: 'friction_reducer_extra',
          targetNameLabel: 'Liquid FR Backup',
          isRequired: false,
        },
        {
          targetName: 'cross_linker',
          targetNameLabel: 'Cross Linker',
          isRequired: false,
        },
        {
          targetName: 'acid',
          targetNameLabel: 'Acid',
          isRequired: false,
        },
        {
          targetName: 'gel',
          targetNameLabel: 'Liquid Gel',
          isRequired: false,
        },
        {
          targetName: 'ph_adjusting_agent',
          targetNameLabel: 'PH Adjusting Agent',
          isRequired: false,
        },
        {
          targetName: 'accelerator',
          targetNameLabel: 'Accelerator',
          isRequired: false,
        },
        {
          targetName: 'fluid_loss',
          targetNameLabel: 'Fluid Loss',
          isRequired: false,
        },
        {
          targetName: 'divertor',
          targetNameLabel: 'Divertor',
          isRequired: false,
        },
        {
          targetName: 'ploymer_plug',
          targetNameLabel: 'Polymer Plug',
          isRequired: false,
        },
        {
          targetName: 'acid_inhibitor',
          targetNameLabel: 'Acid Inhibitor',
          isRequired: false,
        },
        {
          targetName: 'acid_retarder',
          targetNameLabel: 'Acid Retarder',
          isRequired: false,
        },
        {
          targetName: 'emulsifier',
          targetNameLabel: 'Emulsifier',
          isRequired: false,
        },
        {
          targetName: 'clay_stabilizer',
          targetNameLabel: 'Clay Stabilizer',
          isRequired: false,
        },
        {
          targetName: 'non_emulsifier',
          targetNameLabel: 'Non-Emulsifier',
          isRequired: false,
        },
        {
          targetName: 'fines_suspender',
          targetNameLabel: 'Fines Suspender',
          isRequired: false,
        },
        {
          targetName: 'anti_sludge',
          targetNameLabel: 'Anti-Sludge',
          isRequired: false,
        },
        {
          targetName: 'iron_control',
          targetNameLabel: 'Iron Control',
          isRequired: false,
        },
        {
          targetName: 'oxygen_scavenger',
          targetNameLabel: 'Oxygen Scavenger',
          isRequired: false,
        },
        {
          targetName: 'mutual_solvent',
          targetNameLabel: 'Mutual Solvent',
          isRequired: false,
        },
        {
          targetName: 'corrosion_inhibitor',
          targetNameLabel: 'Corrosion Inhibitor',
          isRequired: false,
        },
        {
          targetName: 'paraffin_control',
          targetNameLabel: 'Paraffin Control',
          isRequired: false,
        },
        {
          targetName: 'biocide',
          targetNameLabel: 'Biocide',
          isRequired: false,
        },
        {
          targetName: 'instant_crosslinker',
          targetNameLabel: 'Instant Crosslinker',
          isRequired: false,
        },
        {
          targetName: 'delayed_crosslinker',
          targetNameLabel: 'Delayed Crosslinker',
          isRequired: false,
        },
        {
          targetName: 'liquid_breaker',
          targetNameLabel: 'Liquid Breaker',
          isRequired: false,
        },
        {
          targetName: 'powder_gel',
          targetNameLabel: 'Powder Gel',
          isRequired: false,
        },
        {
          targetName: 'powder_friction_reducer',
          targetNameLabel: 'Powder FR',
          isRequired: false,
        },
        {
          targetName: 'powder_enzyme_breaker',
          targetNameLabel: 'Powder EB',
          isRequired: false,
        },
      ],

      AUTO_RESOLVER: [
        {
          targetName: 'date_time',
          sourceNames: ['Date/Time', 'Job Time'],
        },
        {
          targetName: 'wellhead_pressure',
          sourceNames: ['Surf Press', 'Surf Press [Tbg]'],
        },
        {
          targetName: 'backside_pressure',
          sourceNames: [],
        },
        {
          targetName: 'clean_flow_rate_in',
          sourceNames: ['BLENDER CLEAN FLOW', 'Clean Flow Rate'],
        },
        {
          targetName: 'total_clean_volume_in',
          sourceNames: ['BLENDER CLEAN TOTAL', 'Clean Flow Total'],
        },
        {
          targetName: 'slurry_flow_rate_in',
          sourceNames: ['PUMP STROKES RATE', 'Slurry Flow Rate'],
        },
        {
          targetName: 'total_slurry_volume_in',
          sourceNames: ['BLENDER SLURRY TOTAL', 'Slurry Flow Total'],
        },
        {
          targetName: 'total_pump_spm',
          sourceNames: ['PUMP STROKES RATE'],
        },
        {
          targetName: 'proppant_1_concentration',
          sourceNames: ['C/D CONCENTRATION', 'C/D Prop Con'],
        },
        {
          targetName: 'proppant_1_mass',
          sourceNames: ['C/D Prop Total'],
        },
        {
          targetName: 'proppant_2_concentration',
          sourceNames: ['TN PROP CON'],
        },
        {
          targetName: 'proppant_2_mass',
          sourceNames: ['TN Prop Total'],
        },
        {
          targetName: 'slurry_density',
          sourceNames: ['BLENDER DENSITOMETER'],
        },
        {
          targetName: 'enzyme_breaker',
          sourceNames: ['ENZYME LA 2 RATE'],
        },
        {
          targetName: 'scale_inhibitor',
          sourceNames: ['Blender 4 SCALE'],
        },
        {
          targetName: 'surfactant',
          sourceNames: ['Blender 2 SURF', 'Chem Van 5 SURF'],
        },
        {
          targetName: 'powder_breaker',
          sourceNames: ['Blender Dry Add 1'],
        },
        {
          targetName: 'friction_reducer',
          sourceNames: ['Chem Van 1 FR', 'Chem Van 2 FR', 'Chem Van 5 HIFLOW 5 FR'],
        },
        {
          targetName: 'cross_linker',
          sourceNames: ['Chem Van 1 XL', 'Chem Van 2 XL', 'Chem Van 4 CL-201 CROSSLINK'],
        },
        {
          targetName: 'acid',
          sourceNames: ['Chem Van 7 ACC'],
        },
        {
          targetName: 'gel',
          sourceNames: ['Hydration 1 Gel 1'],
        },
        {
          targetName: 'ph_adjusting_agent',
          sourceNames: ['Chem Van 9 BUFF'],
        },
        {
          targetName: 'accelerator',
          sourceNames: ['Chem Van 8 CL010'],
        },
        {
          targetName: 'fluid_loss',
          sourceNames: [],
        },
        {
          targetName: 'divertor',
          sourceNames: [],
        },
        {
          targetName: 'ploymer_plug',
          sourceNames: [],
        },
        {
          targetName: 'acid_inhibitor',
          sourceNames: [],
        },
        {
          targetName: 'acid_retarder',
          sourceNames: [],
        },
        {
          targetName: 'emulsifier',
          sourceNames: [],
        },
        {
          targetName: 'clay_stabilizer',
          sourceNames: [],
        },
        {
          targetName: 'non_emulsifier',
          sourceNames: [],
        },
        {
          targetName: 'fines_suspender',
          sourceNames: [],
        },
        {
          targetName: 'anti_sludge',
          sourceNames: [],
        },
        {
          targetName: 'iron_control',
          sourceNames: [],
        },
        {
          targetName: 'oxygen_scavenger',
          sourceNames: [],
        },
        {
          targetName: 'mutual_solvent',
          sourceNames: [],
        },
        {
          targetName: 'corrosion_inhibitor',
          sourceNames: [],
        },
        {
          targetName: 'paraffin_control',
          sourceNames: [],
        },
        {
          targetName: 'biocide',
          sourceNames: [],
        },
        {
          targetName: 'instant_crosslinker',
          sourceNames: [],
        },
        {
          targetName: 'delayed_crosslinker',
          sourceNames: [],
        },
        {
          targetName: 'liquid_breaker',
          sourceNames: [],
        },
        {
          targetName: 'powder_gel',
          sourceNames: [],
        },
        {
          targetName: 'powder_friction_reducer',
          sourceNames: [],
        },
        {
          targetName: 'powder_enzyme_breaker',
          sourceNames: [],
        },
        {
          targetName: 'friction_reducer_extra',
          sourceNames: [],
        },
      ],

      UNITS: [
        {
          type: 'pressure',
          value: {
            imperial: 'psi',
            metric: 'kPa',
          },
          targetNames: ['wellhead_pressure', 'backside_pressure'],
        },
        {
          type: 'chemVolumeConcentration',
          value: {
            imperial: 'gal/Mgal',
            metric: 'l/m3',
          },
          targetNames: [
            'enzyme_breaker',
            'scale_inhibitor',
            'surfactant',
            'friction_reducer',
            'cross_linker',
            'acid',
            'gel',
            'ph_adjusting_agent',
            'accelerator',
            'acid_inhibitor',
            'acid_retarder',
            'emulsifier',
            'clay_stabilizer',
            'non_emulsifier',
            'fines_suspender',
            'anti_sludge',
            'iron_control',
            'oxygen_scavenger',
            'mutual_solvent',
            'corrosion_inhibitor',
            'paraffin_control',
            'biocide',
            'instant_crosslinker',
            'delayed_crosslinker',
            'liquid_breaker',
            'friction_reducer_extra',
          ],
        },
        {
          type: 'oil',
          value: {
            imperial: 'bbl',
            metric: 'm3',
          },
          targetNames: ['total_clean_volume_in', 'total_slurry_volume_in'],
        },
        {
          type: 'oilFlowRate',
          value: {
            imperial: 'bbl/min',
            metric: 'm3/min',
          },
          targetNames: ['clean_flow_rate_in', 'slurry_flow_rate_in', 'total_pump_spm'],
        },
        {
          type: 'massConcentration',
          value: {
            imperial: 'lb/gal',
            metric: 'kg/m3',
          },
          targetNames: ['proppant_1_concentration', 'proppant_2_concentration', 'slurry_density'],
        },
        {
          type: 'mass',
          value: {
            imperial: 'lb',
            metric: 'kg',
          },
          targetNames: ['proppant_1_mass', 'proppant_2_mass'],
        },
        {
          type: 'chemMassConcentration',
          value: {
            imperial: 'lb/Mgal',
            metric: 'kg/m3',
          },
          targetNames: [
            'powder_breaker',
            'divertor',
            'powder_gel',
            'powder_friction_reducer',
            'powder_enzyme_breaker',
            'fluid_loss',
            'ploymer_plug',
          ],
        },
        {
          type: 'unitless',
          value: {
            imperial: 'unitless',
            metric: 'unitless',
          },
          targetNames: ['date_time'],
        },
      ],
    },
  },
};
