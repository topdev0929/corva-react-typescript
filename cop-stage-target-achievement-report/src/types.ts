import { DEFAULT_SUPPORTED_PAD_MODES } from '@corva/ui/constants/completion';

/* eslint-disable camelcase */
export type TimeRangeSetting = {
  mode: string;
  customTimeStart: number;
  customTimeEnd: number;
};

export type FracFleet = {
  type: string;
  id: string;
  name: string;
  current_pad_id: number;
  pad_frac_fleets: Record<string, any>[];
};

export type Well = {
  asset_id: number;
  name: string;
  status: string;
  id?: string;
  last_active_at?: string;
  last_wireline_at?: string;
  is_active?: boolean;
  rig?: string;
  companyId?: string;
};

export type StageScore = {
  asset_id: number;
  data: {
    stage_number: number;
    stage_start_time: number;
    stage_end_time: number;
    rate_start: number;
    breakdown_timestamp: number;
    isip_timestamp: number;
    design_rate_timestamp: number;
    time_to_rate: number;
    mean_pressure_breakdown_isip: number;
    mean_rate_breakdown_isip: number;
    total_volume_pumped: number;
    actual_time: number;
    designed_proppants: number;
    total_proppant_mass: number;
    percentage_proppant_placed: number;
    mean_friction_reducer: number;
  };
};

export type WellStageData = {
  lastActualStage: number;
  lastDesignStage: number;
  scores: StageScore[];
};

export type WellsStagesData = {
  [assetId: number]: WellStageData;
};

type PadModeKeys = (typeof DEFAULT_SUPPORTED_PAD_MODES)[number]['key'];

export type PadModeSetting = {
  [assetKey: string]: {
    mode: PadModeKeys;
    selectedAssets: number[];
  };
};

export type CommonAppProps = {
  app?: {
    app: { id: number };
  };
  onSettingChange: (key: string, value: any) => void;
  fracFleet: FracFleet;
  well: Well;
  padId: number;
  settingsByAsset: PadModeSetting;
};

export type PadOrderSetting = {
  [assetId: number]: number;
};

export interface AppSettings {
  designValues?: {
    designRate?: number;
    designPressure?: number;
  };
  padOrderSetting: PadOrderSetting;
  metricsFunction: 'avg' | 'sum';
  appHeaderProps: {
    [key: string]: any;
    app: any;
  };
  timeRangeSettings: TimeRangeSetting;
  wells: Well[];
  coordinates: { pixelWidth: number; pixelHeight: number };
  currentUser: Record<string, any>;
}

export type DesignValues = {
  designRate: number;
  designPressure: number;
};

export interface Theme {
  palette: {
    primary: {
      main: '#03BCD4';
      dark: '#008BA3';
      light: '#63EFFF';
      contrastText: '#FFFFFF';
      text1: '#FFFFFF';
      text6: '#BDBDBD';
      text7: '#9E9E9E';
      text8: '#808080';
      text9: '#616161';
    };
    background: {
      b1: 'black';
      b2: '#141414';
      b3: '#191919';
      b4: '#212121';
      b5: '#272727';
      b6: '#2C2C2C';
      b7: '#333333';
      b8: '#3B3B3B';
      b9: '#414141';
      b10: '#4E4E4E';
      b11: '#373737';
    };
    success: {
      main: '#4CAF50';
      dark: '#388E3C';
      light: '#81C784';
      bright: '#75DB29';
      contrastText: 'rgba(0, 0, 0, 0.87)';
    };
    warning: {
      main: '#FFC107';
      dark: '#C79100';
      light: '#FFF350';
      contrastText: 'rgba(0, 0, 0, 0.87)';
    };
    error: {
      main: '#F44336';
      dark: '#D32F2F';
      light: '#E57373';
      contrastText: '#fff';
    };
  };
}
export type Proppant = {
  amount: number;
  type: string;
  unit: string;
  unit_type: string;
};
export type ActualStageData = {
  asset_id: number;
  data: {
    stage_number: number;
    proppants: Proppant[];
  };
};
