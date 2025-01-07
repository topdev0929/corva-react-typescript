import { v4 as uuidV4 } from 'uuid';
import { noop } from 'lodash';
import * as clientStorage from './clientStorage';
import * as jsonApi from './jsonApi';
import * as subscriptions from './subscriptions';
import { get, put, patch, post, del } from './api/apiCore';
import { CORVA_API_URLS } from './constants';

export { clientStorage, jsonApi, subscriptions };

export const corvaAPI = {
  get: (path, queryParams = {}, requestOptions = {}) => {
    return get(path, queryParams, requestOptions);
  },
  put: (path, content, queryParams = {}, requestOptions = {}) => {
    return put(path, content, queryParams, requestOptions);
  },
  patch: (path, content, queryParams = {}, requestOptions = {}) => {
    return patch(path, content, queryParams, requestOptions);
  },
  post: (path, entity, requestOptions = {}) => {
    return post(path, entity, requestOptions);
  },
  del: (path, queryParams = {}, requestOptions = {}) => {
    return del(path, queryParams, requestOptions);
  },
};

export const corvaDataAPI = {
  get: (path, queryParams = {}) => get(path, queryParams, { apiUrl: CORVA_API_URLS.DATA_API }),
  put: (path, content, queryParams = {}) =>
    put(path, content, queryParams, { apiUrl: CORVA_API_URLS.DATA_API }),
  patch: (path, content, queryParams = {}) =>
    patch(path, content, queryParams, { apiUrl: CORVA_API_URLS.DATA_API }),
  post: (path, entity) => post(path, entity, { apiUrl: CORVA_API_URLS.DATA_API }),
  del: (path, queryParams = {}) => del(path, queryParams, { apiUrl: CORVA_API_URLS.DATA_API }),
};

const SOCKET_NOT_INITIALIZED_ERROR = 'Socket is not initialized!';

export const socketClient = {
  subscribe: (subscription, { onDataReceive = noop } = {}) => {
    const { subscribe, unsubscribe, socket } = window[Symbol.for('socket')] || {};

    if (!socket) {
      console.error(SOCKET_NOT_INITIALIZED_ERROR);
      // In some environments, like PDF Dashboard Report, socket is not initialized
      // But socketClient should not throw errors to prevent apps crashing
      return noop;
    }

    const subId = uuidV4();
    const subscriptionWithId = {
      ...subscription,
      // NOTE: Add ability to pass dataset (because we don't use "collection" in new data api)
      collection: subscription.collection || subscription.dataset,
      // NOTE: Unique id is required for subscriptions server
      appInstanceId: subId,
    };

    subscribe(subscriptionWithId);
    socket.on('data', event => event.appInstanceId === subId && onDataReceive(event));

    // NOTE: Return unsubscribe
    return () => unsubscribe(subscriptionWithId);
  },
};
