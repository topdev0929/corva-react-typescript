import { getLocalStorageItem, updateLocalStorageItem } from './localStorage';

const SHARED_DC_STORES_ROOT_FIELD = 'SHARED_DC_STORES';
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateSharedDcStoreKey(storeKey) {
  if (!UUID_REGEXP.test(storeKey)) {
    throw new Error('shared DC store key should be a valid UUID string');
  }
}

function getBroadcastChannelNameFromKey(storeKey) {
  return `${SHARED_DC_STORES_ROOT_FIELD}:${storeKey}:update`;
}

function getSharedDCStore(storeKey) {
  const sharedDcStores = getLocalStorageItem(SHARED_DC_STORES_ROOT_FIELD);

  return sharedDcStores[storeKey];
}

function setSharedDCStore(storeKey, setterFunction) {
  validateSharedDcStoreKey(storeKey);

  const currentStoreValue = getSharedDCStore(storeKey);

  const newStoreValue = setterFunction(currentStoreValue);

  updateLocalStorageItem(SHARED_DC_STORES_ROOT_FIELD, {
    [storeKey]: newStoreValue,
  });

  const storeUpdatesChannel = new BroadcastChannel(getBroadcastChannelNameFromKey(storeKey));
  storeUpdatesChannel.postMessage(JSON.stringify(getSharedDCStore(storeKey)));
  storeUpdatesChannel.close();
}

function subscribeForSharedDCStore(storeKey, subscribeFn) {
  validateSharedDcStoreKey(storeKey);

  const currentStoreValue = getSharedDCStore(storeKey);

  // immediate call to share the current value
  subscribeFn(currentStoreValue);

  const storeUpdatesChannel = new BroadcastChannel(getBroadcastChannelNameFromKey(storeKey));

  storeUpdatesChannel.onmessage = event => {
    subscribeFn(JSON.parse(event.data));
  };

  return () => {
    storeUpdatesChannel.close();
  };
}

// Internal function used by the platform to remove the stores on user logout

// eslint-disable-next-line no-underscore-dangle
function __removeSharedDCStores() {
  localStorage.removeItem(SHARED_DC_STORES_ROOT_FIELD);
}

export const sharedDCStore = {
  setSharedDCStore,
  getSharedDCStore,
  subscribeForSharedDCStore,
  __removeSharedDCStores,
};
