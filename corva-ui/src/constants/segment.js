import { ASSET_TYPES } from './assetTypes';

export const NAME = 'segment';

export const SEGMENTS = {
  DRILLING: 'drilling',
  COMPLETION: 'completion',
};

export const FRAC_FLEET_GROUP = {
  id: 'fracFleet',
  name: 'Frac Fleet',
  type: 'frac_fleet',
};

export const PAD_GROUP = {
  name: 'Pad',
  type: 'pad',
  id: 'padId',
};

export const SEGMENT_TO_ASSET_TYPE = {
  [SEGMENTS.DRILLING]: {
    primaryAsset: {
      assetType: ASSET_TYPES.rig,
    },
    secondaryAsset: {
      assetType: ASSET_TYPES.well,
    },
  },
  [SEGMENTS.COMPLETION]: {
    primaryAsset: {
      assetType: ASSET_TYPES.frac_fleet,
      groups: [PAD_GROUP, FRAC_FLEET_GROUP],
    },
    secondaryAsset: {
      assetType: ASSET_TYPES.pad,
    },
  },
};

export const SEGMENT_DICT = [
  {
    name: SEGMENTS.DRILLING,
    title: 'Drilling',
  },
  {
    name: SEGMENTS.COMPLETION,
    title: 'Completion',
  },
];

export const SEGMENT_LIST = SEGMENT_DICT.map(segment => segment.name);

export const DEFAULT_SEGMENT = SEGMENTS.DRILLING;
