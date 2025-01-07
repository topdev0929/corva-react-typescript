export const COMMENT_GROUP_ICON_SIZE = 24; // px
export const COMMENT_CREATE_ICON_SIZE = 32; // px

export const COMMENT_BADGE_SIZES = {
  height: COMMENT_GROUP_ICON_SIZE,
  width: COMMENT_GROUP_ICON_SIZE,
};

export const NAME = 'feed';

export const ADD_NEW_FEED_ITEMS = 'ADD_NEW_FEED_ITEMS';
export const DELETE_NEW_FEED_ITEM = 'DELETE_NEW_FEED_ITEM';
export const CLEAR_NEW_FEED_ITEMS = 'CLEAR_NEW_FEED_ITEMS';
export const ADD_FEED_ITEM_TO_UPDATE_LIST = 'ADD_FEED_ITEM_TO_UPDATE_LIST';
export const DELETE_FEED_ITEM_FROM_UPDATE_LIST = 'DELETE_FEED_ITEM_FROM_UPDATE_LIST';
export const ADD_FEED_ITEM_TO_DELETE_LIST = 'ADD_FEED_ITEM_TO_DELETE_LIST';
export const DELETE_FEED_ITEM_FROM_DELETE_LIST = 'DELETE_FEED_ITEM_FROM_DELETE_LIST';

export const FEED = {
  SUBSCRIPTIONS: [
    {
      collection: 'feed',
    },
  ],
};

export const FEED_ITEM_TYPES = [
  { label: 'Post', type: 'post', segment: ['drilling', 'completion'] },

  { label: 'Alert', type: 'alert', segment: ['drilling', 'completion'] },
  { label: 'Operational Note', type: 'operational_note', segment: ['drilling'] },
  { label: 'Operation Summary', type: 'operation_summary', segment: ['drilling'] },
  { label: 'Daily Cost', type: 'daily_cost', segment: ['drilling'] },
  { label: 'Document', type: 'document', segment: ['drilling'] },
  { label: 'Fluid Report', type: 'fluid_report', segment: ['drilling'] },
  { label: 'BHA', type: 'bha', segment: ['drilling'] },
  { label: 'Survey Station', type: 'survey_station', segment: ['drilling'] },
  // NOTE: Temporarily hidden on prod
  ...(process.env.REACT_APP_ENVIRONMENT !== 'production'
    ? [{ label: 'Well Plan', type: 'well_plan', segment: ['drilling'] }]
    : []),
  { label: 'Driller Memo', type: 'driller_memo', segment: ['drilling'] },
  { label: 'NPT', type: 'npt_event', segment: ['drilling'] },

  { label: 'Operational Note', type: 'completion_operational_note', segment: ['completion'] },
  { label: 'Operation Summary', type: 'completion_operation_summary', segment: ['completion'] },
  { label: 'Daily Cost', type: 'completion_daily_cost', segment: ['completion'] },
  { label: 'Document', type: 'completion_document', segment: ['completion'] },
  { label: 'Stage Overview', type: 'completion_actual_stage', segment: ['completion'] },
  // NOTE: Implement after Mo's explanation
  // { label: 'Stage Predictions', type: '???', segment: ['completion'] },
  { label: 'NPT', type: 'completion_npt_event', segment: ['completion'] },

  { label: 'App Annotation', type: 'app_annotation', segment: ['drilling', 'completion'] },
];

export const FEED_ITEM_TYPES_BY_KEY = FEED_ITEM_TYPES.reduce(
  (result, feedItemType) => ({ ...result, [feedItemType.type]: feedItemType }),
  {}
);

export const SIDEBAR_FILTERS = {
  RIG_FILTERS: [
    { label: 'All', value: 'all' },
    { label: 'Filter by asset', value: 'filterByAsset' },
  ],

  DATE_RANGE_FILTERS: [
    // NOTE: Order matters in handleChangeDateRangeFilter and renderDateRangeFilters
    { label: 'All', value: 'all' },
    { label: 'Last 24 hours', value: 'last24hours' },
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Custom', value: 'custom' },
  ],

  CONTENT_TYPE_FILTERS: FEED_ITEM_TYPES.map(feedItemType => ({
    label: feedItemType.label,
    value: feedItemType.type,
    segment: feedItemType.segment,
  })),

  USER_FILTERS: [
    { label: 'All', value: 'all' },
    { label: 'Filter by user', value: 'filterByUser' },
  ],
};

export const DEFAULT_CONTENT_TYPES_FILTER = FEED_ITEM_TYPES.reduce(
  (result, { type }) => [...result, type],
  []
);

export const IS_FEED_SHOWN = true;
