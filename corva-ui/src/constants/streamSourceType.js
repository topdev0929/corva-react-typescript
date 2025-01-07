import { SEGMENTS } from './segment';

export const STREAM_SOURCE_TYPES = {
  DRILLING: 'drilling',
  FRAC: 'frac',
  WIRELINE: 'wireline',
  DRILLOUT: 'drillout',
};

export const STREAM_ADD_OPTIONS = {
  FROM_WITSML: 'FROM_WITSML',
  STREAM_CONNECTOR: 'STREAM_CONNECTOR',
  FROM_HISTORICAL_UPLOAD: 'FROM_HISTORICAL_UPLOAD',
  FROM_BLANK: 'FROM_BLANK',
};

// NOTE: Stream connector for wireline and frac will be supported soon
export const STREAM_SOURCE_TYPE_DICT = {
  [SEGMENTS.DRILLING]: [
    {
      type: STREAM_SOURCE_TYPES.DRILLING,
      title: 'Drilling',
      canAddWith: [
        STREAM_ADD_OPTIONS.FROM_WITSML,
        STREAM_ADD_OPTIONS.STREAM_CONNECTOR,
        STREAM_ADD_OPTIONS.FROM_HISTORICAL_UPLOAD,
        STREAM_ADD_OPTIONS.FROM_BLANK,
      ],
    },
  ],
  [SEGMENTS.COMPLETION]: [
    {
      type: STREAM_SOURCE_TYPES.FRAC,
      title: 'Frac',
      canAddWith: [
        // STREAM_ADD_OPTIONS.STREAM_CONNECTOR,
        STREAM_ADD_OPTIONS.FROM_HISTORICAL_UPLOAD,
        STREAM_ADD_OPTIONS.FROM_BLANK,
      ],
    },
    {
      type: STREAM_SOURCE_TYPES.WIRELINE,
      title: 'Wireline',
      canAddWith: [
        // STREAM_ADD_OPTIONS.STREAM_CONNECTOR,
        STREAM_ADD_OPTIONS.FROM_BLANK,
      ],
    },
    {
      type: STREAM_SOURCE_TYPES.DRILLOUT,
      title: 'Drillout',
      canAddWith: [
        STREAM_ADD_OPTIONS.FROM_WITSML,
        STREAM_ADD_OPTIONS.STREAM_CONNECTOR,
        STREAM_ADD_OPTIONS.FROM_HISTORICAL_UPLOAD,
        STREAM_ADD_OPTIONS.FROM_BLANK,
      ],
    },
  ],
};
