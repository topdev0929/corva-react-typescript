export const STREAM_TYPES = { frac: 'Frac', wireline: 'WL' };
export type StreamType = 'Frac' | 'WL';

export type StreamTimestamp = {
  [assetId: number]: number;
};

export type StreamDataItem = {
  timestamp: number;
  stageNumber?: number;
  data?: {
    measured_depth?: number;
  };
};

export type StreamData = {
  [assetId: number]: StreamDataItem;
};

export type AssetStreamStatus = {
  wellId: number;
  streamType: StreamType;
  activityTimestamp: number;
  // we may have multiple same-type-streams on the pad, index is used to number same streams
  index: number;
};

export type Well = {
  asset_id: number;
  is_active: boolean;
};
