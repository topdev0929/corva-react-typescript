// Handlers for notifying the native (iOS) app of some things when running in a WebView.
// The functions here do nothing when we are *not* in a native WebView environment.

function getHandler() {
  return window.webkit && window.webkit.messageHandlers
    ? window.webkit.messageHandlers.swiftHandler
    : null;
}

function notify(message) {
  const handler = getHandler();
  if (handler) {
    handler.postMessage(message);
  } else if (window.androidInterface != null) {
    window.androidInterface.notify(message);
  }
}

export function notifyDisablePullToRefresh() {
  notify('disablePullToRefresh');
}

export function notifyPageLoaded() {
  notify('pageLoaded');
}

export function notifyAppMaximized() {
  notify('appMaximized');
}

export function notifyAppRestored() {
  notify('appRestored');
}

export function notifyGoToAsset(assetId, slug) {
  notify(`goToAsset#${assetId}#${slug}`);
}

export function notifyGoToAlert(alertId) {
  notify(`goToAlert#${alertId}`);
}

export function notifyGoToAlertDefinitions() {
  notify('goToAlertDefinitions');
}

export function notifyGoToCreateAlertDefinition() {
  notify('goToCreateAlertDefinition');
}

export function notifyGoToAlertDefinition(alertDefinitionId) {
  notify(`goToAlertDefinition#${alertDefinitionId}`);
}

export function notifyLog(message) {
  notify(`nativeLog#${message}`);
}

export function notifyCommentPost(message) {
  notify(`commentPost#${message}`);
}

export function notifyCommentEdit(message) {
  notify(`commentEdit#${message}`);
}

export function notifyGoToFeedItem(feedItemId) {
  notify(`goToFeedItem#${feedItemId}`);
}

export function notifyOpenFeedCommentInput(feedItemId) {
  notify(`openFeedCommentInput${feedItemId}`);
}
