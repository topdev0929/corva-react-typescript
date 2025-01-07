/**
 * This is a real example of the props that'll come
 * to the AppSettings component. You'll need to manually update it
 * if in the future some new properties are added
 */

export const mockAppSettingsProps = {
  onSettingChange: jest.fn(),
  onSettingsChange: jest.fn(),
  app: {
    id: -1,
    app: {
      app_key: 'company.app_key.ui',
      platform: 'dev_center',
    },
    settings: {
      package: '0.1.0',
      rigId: 1,
      wellId: 2,
      isExampleCheckboxChecked: true,
    },
    package: {
      manifest: {
        format: 1,
        license: {
          type: 'MIT',
          url: 'https://www.oandgexample.com/license/',
        },
        developer: {
          name: 'Company Name',
          identifier: 'companyIdentifier',
          authors: [],
        },
        application: {
          type: 'ui',
          key: 'company.app_key.ui',
          visibility: 'private',
          name: 'dev center app name',
          description: 'This is the description of my app. You can do great things with it!',
          summary: 'More information about this app goes here',
          category: 'analytics',
          website: 'https://www.oandgexample.com/my-app/',
          segments: ['drilling', 'completion'],
          ui: {
            initial_size: {
              w: 4,
              h: 10,
            },
          },
        },
        settings: {
          entrypoint: {
            file: 'src/index.js',
            function: 'handler',
          },
          environment: {},
          runtime: 'ui',
          app: {
            scheduler_type: 1,
            cron_string: '*/5 * * * *',
          },
        },
        datasets: {},
      },
      build: 'company.app_key.ui-0.1.0',
      version: '0.1.0',
    },
  },
  appData: {
    id: -1,
    rig: {
      name: 'Test Rig Name',
      id: '1',
      asset_id: 3,
    },
    well: {
      name: 'Test Well Name',
      settings: {
        basin: 'Test Basin Name',
        county: 'Pecos',
        timezone: 'America/Chicago',
        top_hole: {
          raw: '50.123456,-102.865431',
          coordinates: [50.123456, -102.865431],
        },
        api_number: '12-345-67689',
        bottom_hole: {},
        mud_company: 'Mud Company Name',
        spud_release: [
          {
            id: '1111111111-2222-3a3a-4b4b-afc5c7c8f245',
            spud: '01/08/2023 00:46',
            rig_up: '01/08/2023 00:10',
            release: '',
          },
        ],
        string_design: '5',
        contractor_name: 'Test Contractor Name',
        target_formation: 'Test Traget Formation',
        last_mongo_refresh: '2023-02-24T16:16:06.383Z',
        rig_classification: 'land',
        directional_driller: 'Test Directional Driller',
        drilling_afe_number: 'AB12356',
        day_shift_start_time: '06:00',
        off_bottom_tolerance: 1,
        target_formation_standard: 'Test Traget Formation',
        completion_day_shift_start_time: '06:00',
        associations_last_active_at_updated_at: '2023-02-24T16:15:40.000Z',
      },
      asset_id: 4,
      last_active_at: '2023-02-24T16:20:29.000Z',
      id: '2',
      companyId: '6',
    },
    fracFleet: null,
    isLoading: false,
    appHash: '-1-2-1-NaN-NaN-NaN',
  },
  settings: {
    package: '0.1.0',
    rigId: 1,
    wellId: 2,
    isExampleCheckboxChecked: true,
  },
  layoutEnvironment: {
    type: 'general',
    pdfReportMode: false,
  },
  currentUser: {
    id: 1,
    company_id: 3,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.ai',
    mobile: '',
    created_at: '2020-11-03T08:42:53.161Z',
    terms_acceptance_at: '2021-10-20T13:28:6.385Z',
    profile_photo: null,
    recently_viewed_asset_ids: [64],
    unit_system: null,
    role: 'user',
    title: null,
    group: null,
    favorite_asset_id: null,
    current_segment: null,
    theme: 'dark',
    messaging_id: '1',
    restricted_assets: [],
    restricted_programs: [],
    settings: {
      favorites: {},
      sms_blacklisted: false,
      restricted_assets: [],
      restricted_programs: [],
      participates_in_beta_apps: false,
      last_new_dashboard_shares_check: '2021-11-24T18:57:13.679Z',
    },
    last_sign_in_at: '2023-02-23T10:19:06.349Z',
    locked_access: false,
    unit_ids: [],
    intercom_admin_id: null,
    resource: [],
    intercom_user_hash: 'intercom_user_hash',
    profile_groups: [],
    preference: {
      id: 6,
      user: {
        id: 1,
        company_id: 3,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.ai',
        role: 'user',
        created_at: '2020-11-03T08:42:53.161Z',
        updated_at: '2023-02-23T12:26:46.835Z',
        recently_viewed_asset_ids: [64],
        unit_system: null,
        mobile: '',
        terms_acceptance_at: '2021-10-20T13:28:6.385Z',
        messaging_id: '1',
        settings: {
          favorites: {},
          sms_blacklisted: false,
          restricted_assets: [],
          restricted_programs: [],
          participates_in_beta_apps: false,
          last_new_dashboard_shares_check: '2021-11-24T18:57:13.679Z',
        },
        theme: 'dark',
        title: null,
        group: null,
        profile_photo: null,
        favorite_asset_id: null,
        current_segment: null,
        state: 'active',
        created_by: null,
        provisioner: 'internal',
        intercom_admin_id: null,
        resource: [],
      },
      push_notifications_enabled: true,
      emails_enabled: true,
      sms_enabled: true,
      alert_levels: ['info', 'warning', 'critical'],
      play_alerts_sound: true,
      show_intercom_icon: true,
      segment: ['drilling', 'completion'],
      disable_create_dashboard: false,
      disable_costs: false,
      disable_documents: false,
      realtime_operation_mode: false,
      disable_file_upload: false,
      stay_on_app_store: false,
    },
    company: {
      id: 3,
      name: 'Test Company Name',
      time_zone: 'America/Chicago',
      language: 'en',
      provider: 'company',
      unit_system: {
        yp: 'hsf',
        oil: 'bbl',
        area: 'ft2',
        mass: 'lb',
        time: 'min',
        angle: 'deg',
        force: 'klbf',
        power: 'hp',
        speed: 'ft/min',
        length: 'm',
        system: 'imperial',
        torque: 'ft-klbf',
        volume: 'gal',
        current: 'mA',
        density: 'ppg',
        gravity: 'g',
        voltage: 'mV',
        porosity: 'pu',
        pressure: 'psi',
        velocity: 'ft/min',
        gasVolume: 'Mscf',
        gravityRMS: 'gRMS',
        msePressure: 'ksi',
        oilFlowRate: 'bbl/min',
        resistivity: 'ohmm',
        shortLength: 'in',
        temperature: 'F',
        massFlowRate: 'lb/min',
        permiability: 'md',
        concentration: 'ppm',
        fluidVelocity: 'ft/min',
        massPerLength: 'lb-ft',
        anglePerLength: 'dp100f',
        lengthPerAngle: 'in/rev',
        volumeFlowRate: 'gal/min',
        angularVelocity: 'rpm',
        inversePressure: 'i-psi',
        acousticSlowness: 'us/ft',
        formationDensity: 'g/l',
        gasConcentration: 'Units (0-5000u)',
        pressureGradient: 'psi/ft',
        massConcentration: 'lb/gal',
        revolutionPerVolume: 'rpg',
        spontaneousPotential: 'mV',
        chemMassConcentration: 'lb/Mgal',
        chemVolumeConcentration: 'gal/Mgal',
      },
      dev_center_enabled: true,
      workflows_enabled: true,
      with_subscription: false,
      competitor_analysis_enabled: true,
    },
    groups: [
      {
        id: 5,
        name: 'user',
        company_id: 3,
      },
      {
        id: 9,
        name: 'customGroup',
        company_id: 3,
      },
    ],
  },
  user: {},
  company: {},
};
