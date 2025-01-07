export enum StreamType {
  Frac = 'Frac',
  Wireline = 'WL',
};

export enum AssetStatus {
  active = 'active',
};

export enum PadMode {
  custom = 'custom',
}

export type AssetStreamStatus = {
  wellId?: number;
  streamType?: StreamType;
};

export type StreamDataItem = {
  timestamp: number;
  stageNumber?: number;
  data?: {
    measured_depth?: number;
  };
};
