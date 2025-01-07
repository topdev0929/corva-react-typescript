export const NAME = 'subscriptions';

export const SUBSCRIBE_APP_FOR_ASSET = 'SUBSCRIBE_APP_FOR_ASSET';
export const UNSUBSCRIBE_APP_FROM_ASSET = 'UNSUBSCRIBE_APP_FROM_ASSET';
export const RECEIVE_INITIAL_APP_ASSET_DATA = 'RECEIVE_INITIAL_APP_ASSET_DATA';
export const RECEIVE_APP_ASSET_DATA = 'RECEIVE_APP_ASSET_DATA';
export const SET_APP_ASSET_DATA_ERROR = 'SET_APP_ASSET_DATA_ERROR';

export const SUBSCRIBE_USER_FOR_DATA = 'SUBSCRIBE_USER_FOR_DATA';
export const UNSUBSCRIBE_USER_FROM_DATA = 'UNSUBSCRIBE_USER_FROM_DATA';
export const RECEIVE_USER_DATA = 'RECEIVE_USER_DATA';

export const DEFAULT_SUBSCRIPTION_META = {
  isRequired: true,
  allowEmpty: false,
  subscribeOnly: false,
  subscribeToLatestOnly: false,
  subscribeOnlyForInitialData: false,
  alwaysSubscribe: false,
  preventWarningsDisplay: false,
  preventErrorsDisplay: false,
};
