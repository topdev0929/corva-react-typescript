import io from 'socket.io-client';
import * as queryString from 'query-string';
import noop from 'lodash/noop';

const SERVER_DISCONNECT_REASON = 'io server disconnect';
const REPORTS_ROUTE_REG_EXP = new RegExp('^/reports.*$');

const parameters = queryString.parse(window.location.search);
const socketUrl =
  parameters.subscriptions_url ||
  process.env.REACT_APP_SUBSCRIPTIONS_URL ||
  'https://subscriptions.qa.corva.ai';

function reportsDisableDecorator(func) {
  // NOTE: Disable subscription events on reports pages
  return REPORTS_ROUTE_REG_EXP.test(window.location.pathname) ? noop : func;
}

function getUserSubscriptionId(options, hookId) {
  return `${options.appInstanceId || hookId}:${options.companyId}:${options.userId}:${
    options.collection
  }`;
}

function getCompanySubscriptionId(options, hookId) {
  return `${options.appInstanceId || hookId}:${options.companyId}:${options.collection}`;
}

function getAssetSubscriptionId(options, hookId) {
  return options.event
    ? `${options.appInstanceId || hookId}:${options.provider}:${options.collection}:${
        options.assetId
      }:${options.event}`
    : `${options.appInstanceId || hookId}:${options.provider}:${options.collection}:${
        options.assetId
      }`;
}

export function getSubscriptionId(options, hookId = '') {
  if ('userId' in options) return getUserSubscriptionId(options, hookId);
  else if ('companyId' in options) return getCompanySubscriptionId(options, hookId);
  return getAssetSubscriptionId(options, hookId);
}

export function getSubscriptionsClient() {
  let socket;

  // NOTE: Is used in order to reset subscriptions in case of network failure
  const subscriptions = {};
  let isAuthenticated = false;

  const unsubscribe = reportsDisableDecorator(options => {
    if (!socket) {
      throw new Error('Not connected');
    }
    const subscriptionId = getSubscriptionId(options);

    if (subscriptionId in subscriptions) {
      delete subscriptions[subscriptionId];
      socket.emit('unsubscribe', options);
    }
  });

  const subscribe = reportsDisableDecorator(options => {
    if (!socket) {
      throw new Error('Not connected');
    }

    const subscriptionId = getSubscriptionId(options);
    subscriptions[subscriptionId] = options;

    // NOTE: Events could be:
    // 1) 'update' - fires in case of records are updated;
    // 2) 'destroy' - fires in case or records are destroyed;
    // 3) '' (empty) - fires in case of new records are created;
    if (isAuthenticated) {
      socket.emit('subscribe', options);
    }
  });

  const connect = reportsDisableDecorator(({ onDataReceive, onResubscribe }) => {
    let resubscribe = false;

    socket = io(socketUrl, { transports: ['websocket'] });
    socket.on('connect', () => {
      socket.emit('authenticate');

      if (resubscribe) {
        Object.values(subscriptions).forEach(subscription => {
          unsubscribe(subscription);
          subscribe(subscription);
          onResubscribe(subscription);
        });
        resubscribe = false;
      }
    });
    socket.on('authenticated', () => {
      isAuthenticated = true;
      Object.values(subscriptions).forEach(subscribe);
    });
    socket.on('data', onDataReceive);

    socket.on('disconnect', reason => {
      if (reason === SERVER_DISCONNECT_REASON) {
        resubscribe = true;
        socket.connect();
      }
    });
    socket.on('reconnect', () => {
      resubscribe = true;
    });

    return socket;
  });

  const disconnect = reportsDisableDecorator(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  });

  return { connect, disconnect, subscribe, unsubscribe };
}

export const initializeSocketClient = () => {
  const { connect, disconnect, subscribe, unsubscribe } = getSubscriptionsClient();
  const socket = connect({ onDataReceive: noop, onResubscribe: noop });
  window[Symbol.for('socket')] = {
    subscribe,
    unsubscribe,
    disconnect,
    socket,
  };
};
