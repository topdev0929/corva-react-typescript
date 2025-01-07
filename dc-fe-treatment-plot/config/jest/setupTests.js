/* eslint-disable */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// eslint-disable-next-line
import '@testing-library/jest-dom/extend-expect';
import { setImmediate } from 'timers';
import './consoleCleanup';

// adds setImmediate to jest to not throw errors
global.setImmediate = setImmediate;

// adds ResizeObserver to jest to not throw errors
// Install and add a polyfill here if this mock is not enough
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// To prevent accidental real requests in your tests & tests crash.
// Replace this with more advanced solutions if this is not enough.
global.XMLHttpRequest = jest.fn(() => ({
  readyState: 4,
  timeout: 0,
  responseType: 'json',
  response: '"mockResponse"',
  responseText: '"mockResponseText"',
  status: 200,
  statusText: 'OK',
  upload: {},
  withCredentials: false,
  send: jest.fn(function () {
    this.onload();
  }),
  open: jest.fn(),
  abort: jest.fn(),
  getAllResponseHeaders: jest.fn(),
  getResponseHeader: jest.fn(),
  addEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  overrideMimeType: jest.fn(),
  onreadystatechange: jest.fn(),
  removeEventListener: jest.fn(),
  setRequestHeader: jest.fn(),
}));

// To prevent accidental real requests in your tests & tests crash.
// The mock is not complete, update it if you need.
// Replace this with more advanced solutions if this is not enough.
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: '',
    json: jest.fn(async => 'fetchJsonMock'),
    text: jest.fn(async => 'fetchTextMock'),
    blob: jest.fn(async => 'fetchBlobMock'),
  })
);
