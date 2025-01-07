import * as queryString from 'query-string';

import { getAppKeyFromStackTrace, attachHTTPHeaders } from '../utils';

import { DISPLAY_HTTP_MESSAGES } from './httpMessages';

const HTTP_ERROR_MESSAGES = {
  400: 'Request Failed',
  403: 'No Permission',
  404: 'Not Found',
};

const TOS_ERROR_MESSAGE = 'Please accept the latest terms of service';

const HTTP_METHODS_TO_SHOW_ERROR_NOTIFICATIONS = [
  // NOTE: Do not show error notifications for GET method. Because users may request a deleted item
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
];

export class APIException {
  constructor(response, json) {
    this.status = response.status;
    this.statusText = response.statusText;
    this.message = json.message || 'No Message';
  }

  isAuthenticationProblem() {
    return this.status === 401;
  }

  isTermsProblem() {
    // FIXME: this.message === TOS_ERROR_MESSAGE is a hack. Back-end team should come
    // with another solution.
    return this.status === 401 && this.message === TOS_ERROR_MESSAGE;
  }

  isLoginProblem() {
    return this.status === 401 && this.errorBody?.errors?.login;
  }
}

const parameters = queryString.parse(window.location.search);
export const baseUrl =
  parameters.api_url || process.env.REACT_APP_API_URL || 'https://api.qa.corva.ai';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function handleAuthenticationProblem(e) {
  if (
    e.isAuthenticationProblem &&
    e.isAuthenticationProblem() &&
    !e.isTermsProblem() &&
    !e.isLoginProblem()
  ) {
    console.error('Problem with user');
    // NOTE: Redirect to login page
    if (window.location.pathname !== '/login') window.location.href = '/login';
  }
}

function errorHandlerDecorator(requestCoreFunc) {
  return async function errorHandler(path, config, overrides) {
    const response = await requestCoreFunc(path, config, overrides);

    const { status } = response;

    if (response.ok) {
      return status === 204 // NOTE: No content
        ? null
        : response;
    }

    // NOTE: Handle Error response logic
    let json;
    try {
      json = await response.json();
    } catch (e) {
      json = {};
    }

    const requestMethod = config.method;
    const isMethodToShowNotification = HTTP_METHODS_TO_SHOW_ERROR_NOTIFICATIONS.includes(
      requestMethod
    );

    const httpErrorMessage = DISPLAY_HTTP_MESSAGES[json.message] || HTTP_ERROR_MESSAGES[status];

    if (isMethodToShowNotification && httpErrorMessage) {
      console.error('ERROR');
    }

    const exception = new APIException(response, json);
    handleAuthenticationProblem(exception);

    throw exception;
  };
}

const V1_ASSETS_REGEXP = /^\/v1\/assets.*/;

async function requestCore(path, config = {}, overrides = {}) {
  const { apiUrl = baseUrl, appKey } = overrides;
  // temporary enable cache for the heaviest request
  if (V1_ASSETS_REGEXP.test(path)) {
    config.cache = 'reload'; // eslint-disable-line no-param-reassign
  }

  config.credentials = 'include'; // eslint-disable-line no-param-reassign

  return fetch(`${apiUrl}${path}`, attachHTTPHeaders({ config, appKey }));
}

const request = errorHandlerDecorator(requestCore);

/**
 * The post method is most-often utilized to **create** new resources.
 * @async
 * @param {string} path - path to resource.
 * @param {Object=} entity - API entity to create
 * @returns {Promise<*>}
 */
export async function post(path, entity, requestOptions = {}) {
  const { apiUrl } = requestOptions;
  const response = await request(
    path,
    {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(entity),
    },
    { apiUrl, appKey: getAppKeyFromStackTrace() }
  );

  return response && response.json();
}

export async function getWithHeaders(path, queryParams = {}, requestOptions = {}) {
  const { apiUrl, appKey, signal } = requestOptions;
  const qry = queryString.stringify(queryParams, { arrayFormat: 'bracket' });
  const response = await request(
    `${path}${qry ? '?' : ''}${qry}`,
    {
      method: 'GET',
      signal,
    },
    { apiUrl, appKey: appKey || getAppKeyFromStackTrace() }
  );

  return {
    data: response && (await response.json()),
    headers: response && response.headers,
  };
}

/**
 * The get method is used to **read** (or retrieve) a representation of a resource
 * @async
 * @param {string} path - path to resource.
 * @param {Object=} queryParams - Object with query params such as per_page, sort, asset_id, etc.
 * @param {Object=} requestOptions - Additional options for request. For example: apiUrl, signal etc.
 * @returns {Promise<*>}
 */
export async function get(path, queryParams = {}, requestOptions = {}) {
  const dataAndHeaders = await getWithHeaders(path, queryParams, {
    ...requestOptions,
    appKey: requestOptions.appKey || getAppKeyFromStackTrace(),
  });
  return dataAndHeaders.data;
}

export async function getFile(path, queryParams = {}) {
  const qry = queryString.stringify(queryParams);
  const response = await request(
    `${path}${qry ? '?' : ''}${qry}`,
    { method: 'GET' },
    { appKey: getAppKeyFromStackTrace() }
  );

  return response && response.blob();
}

export async function put(path, content, queryParams = {}, requestOptions = {}) {
  const { apiUrl } = requestOptions;
  const qry = queryString.stringify(queryParams);
  const response = await request(
    `${path}${qry ? '?' : ''}${qry}`,
    {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(content),
    },
    { apiUrl, appKey: getAppKeyFromStackTrace() }
  );

  return response && response.json();
}

export async function patch(path, content, queryParams = {}, requestOptions = {}) {
  const { apiUrl } = requestOptions;
  const qry = queryString.stringify(queryParams);

  const response = await request(
    `${path}${qry ? '?' : ''}${qry}`,
    {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify(content),
    },
    {
      apiUrl,
      appKey: getAppKeyFromStackTrace(),
    }
  );

  return response && response.json();
}

export async function del(path, queryParams = {}, requestOptions = {}) {
  const { apiUrl } = requestOptions;
  const query = queryString.stringify(queryParams);
  const response = await request(
    query ? `${path}?${query}` : path,
    {
      method: 'DELETE',
      headers: JSON_HEADERS,
    },
    {
      apiUrl,
      appKey: getAppKeyFromStackTrace(),
    }
  );

  return response && response.json();
}

export async function sendFormData(path, data, queryParams = {}, requestOptions = {}) {
  const query = queryString.stringify(queryParams);
  const { method = 'POST' } = requestOptions;
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(arrayValueEntity => {
        formData.append(key, arrayValueEntity);
      });
    } else {
      formData.append(key, value);
    }
  });

  const response = await request(
    query ? `${path}?${query}` : path,
    {
      method,
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    },
    { appKey: getAppKeyFromStackTrace() }
  );

  return response && response.json();
}
