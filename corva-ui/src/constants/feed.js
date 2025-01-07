import palette from '~/config/theme/palette.mjs';

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

export const FEED_ITEM_TYPES = {
  TRACES_MEMO: 'traces_memo',
  POST: 'post',
  DEPTH_COMMENTS: 'depth_comments',
};

export const FEED_ITEM_CONFIGS = [
  {
    label: 'Post',
    category: 'post',
    type: FEED_ITEM_TYPES.POST,
    segment: ['drilling', 'completion'],
  },

  { label: 'Alert', category: 'post', type: 'alert', segment: ['drilling', 'completion'] },
  { label: 'Operational Note', category: 'post', type: 'operational_note', segment: ['drilling'] },
  {
    label: 'Operation Summary',
    category: 'post',
    type: 'operation_summary',
    segment: ['drilling'],
  },
  { label: 'Daily Cost', category: 'post', type: 'daily_cost', segment: ['drilling'] },
  { label: 'Document', category: 'post', type: 'document', segment: ['drilling'] },
  { label: 'Fluid Report', category: 'post', type: 'fluid_report', segment: ['drilling'] },
  { label: 'BHA', category: 'post', type: 'bha', segment: ['drilling'] },
  { label: 'Survey Station', category: 'post', type: 'survey_station', segment: ['drilling'] },
  // NOTE: Temporarily hidden on prod
  ...(process.env.REACT_APP_ENVIRONMENT !== 'production'
    ? [{ label: 'Well Plan', category: 'post', type: 'well_plan', segment: ['drilling'] }]
    : []),
  { label: 'Driller Memo', category: 'post', type: 'driller_memo', segment: ['drilling'] },
  { label: 'NPT', category: 'post', type: 'npt_event', segment: ['drilling'] },
  { label: 'Lessons Learned', category: 'post', type: 'lessons_learned', segment: ['drilling'] },

  {
    label: 'Operational Note',
    category: 'post',
    type: 'completion_operational_note',
    segment: ['completion'],
  },
  {
    label: 'Operation Summary',
    category: 'post',
    type: 'completion_operation_summary',
    segment: ['completion'],
  },
  { label: 'Daily Cost', category: 'post', type: 'completion_daily_cost', segment: ['completion'] },
  { label: 'Document', category: 'post', type: 'completion_document', segment: ['completion'] },
  {
    label: 'Stage Overview',
    category: 'post',
    type: 'completion_actual_stage',
    segment: ['completion'],
  },
  // NOTE: Implement after Mo's explanation
  // { label: 'Stage Predictions', type: '???', segment: ['completion'] },
  { label: 'NPT', category: 'post', type: 'completion_npt_event', segment: ['completion'] },

  {
    label: 'App Annotation',
    category: 'post',
    type: 'app_annotation',
    segment: ['drilling', 'completion'],
  },
  {
    label: 'Traces Memo',
    category: 'post',
    type: FEED_ITEM_TYPES.TRACES_MEMO,
    segment: ['drilling', 'completion'],
  },
  {
    label: 'Geosteering Recommendations',
    category: 'post',
    type: 'geosteering_comments',
    segment: ['drilling', 'completion'],
  },
  {
    label: 'Depth Comments',
    category: 'comment',
    type: FEED_ITEM_TYPES.DEPTH_COMMENTS,
    segment: ['drilling', 'completion'],
  },
  {
    label: 'Hookload Point Annotations',
    category: 'comment',
    type: 'hookload_broomstick_comment',
    showCreatorToLabel: true,
    segment: ['drilling'],
  },
  {
    label: 'DvD Comment',
    category: 'comment',
    type: 'dvd_comment',
    showCreatorToLabel: true,
    segment: ['drilling'],
  },
  {
    label: 'Parameter Comparison',
    category: 'comment',
    type: 'pc_comment',
    showCreatorToLabel: true,
    segment: ['drilling', 'completion'],
  },
  {
    label: 'Drilling Dysfunction',
    category: 'post',
    type: 'drilling_dysfunction_event',
    showCreatorToLabel: true,
    segment: ['drilling'],
  },
  {
    label: 'Npt Lessons Comment',
    category: 'comment',
    type: 'npt_lessons_comment',
    showCreatorToLabel: true,
    segment: ['drilling'],
  },
];

export const FEED_ITEM_TYPES_BY_KEY = FEED_ITEM_CONFIGS.reduce(
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
    // { label: 'All', value: 'all' },
    { label: 'Last 24 hours', value: 'last24hours' },
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Custom', value: 'custom' },
  ],

  CONTENT_TYPE_FILTERS: FEED_ITEM_CONFIGS.map(feedItemType => ({
    label: feedItemType.label,
    value: feedItemType.type,
    segment: feedItemType.segment,
  })),

  USER_FILTERS: [
    { label: 'All', value: 'all' },
    { label: 'Filter by user', value: 'filterByUser' },
  ],
};

export const DEFAULT_CONTENT_TYPES_FILTER = FEED_ITEM_CONFIGS.reduce(
  (result, { type }) => [...result, type],
  []
);

export const IS_FEED_SHOWN = true;

export const MENTION_STYLE = {
  suggestions: {
    list: {
      background: palette.background.b9,
    },
    item: {
      color: 'white',
      height: 30,
      '&focused': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
};
