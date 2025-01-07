import set from 'lodash/set';
import get from 'lodash/get';
import unset from 'lodash/unset';
import moment from 'moment';

// NOTE: Here implemented wrappers for localstorage methods
// to set, get or delete values in localstorage's nested objects
// using path.
// For example: setValue(['rootElement', 'prop1', 'prop2'], 'exampleValue');

const getItemValue = item => (item.expiry ? item.value : item);

export function deleteValue(path) {
  if (typeof path === 'string') {
    localStorage.removeItem(path);
  } else if (Array.isArray(path) && path.length) {
    const storageItem = JSON.parse(localStorage.getItem(path[0]));
    unset(storageItem, path.slice(1));

    localStorage.setItem(path[0], JSON.stringify(storageItem));
  }
}

export function setValue(path, value, expiry = null, callback) {
  let storageItem;

  const updatedValue =
    expiry && expiry.length
      ? {
          value,
          expiry: moment().add(expiry[0], expiry[1]),
        }
      : value;

  if (typeof path === 'string') {
    storageItem = updatedValue;

    localStorage.setItem(path, JSON.stringify(storageItem));
  } else if (Array.isArray(path) && path.length) {
    storageItem = JSON.parse(localStorage.getItem(path[0])) || {};

    set(storageItem, path.slice(1), updatedValue);
    localStorage.setItem(path[0], JSON.stringify(storageItem));
  }

  if (storageItem && typeof callback === 'function') {
    const callbackValue = getItemValue(storageItem);
    callback(callbackValue);
  }
}

const filterExpiredValues = (value, path) => {
  let result = value;
  if (Array.isArray(value)) {
    result = value.filter(item => !item.expiry || moment().diff(item.expiry) < 0);

    setValue(path, result);
    return result.map(item => item.value);
  } else if (value && value.expiry && moment().diff(value.expiry) > 0) {
    deleteValue(path);
    result = undefined;
  }

  return result;
};

export function getValue(path, defaultValue = null) {
  let value;
  if (typeof path === 'string') {
    value = JSON.parse(localStorage.getItem(path));
  } else if (Array.isArray(path) && path.length) {
    const storageItem = JSON.parse(localStorage.getItem(path[0]));

    value = get(storageItem, path.slice(1));
  }

  const result = filterExpiredValues(value, path);
  return result !== undefined ? result : defaultValue;
}

export function pushValue(path, value, expiry = null, callback) {
  let storageItem;
  let updatedValues;

  const newValue =
    expiry && expiry.length
      ? {
          value,
          expiry: moment().add(expiry[0], expiry[1]),
        }
      : value;

  if (typeof path === 'string') {
    updatedValues = JSON.parse(localStorage.getItem(path)) || [];

    updatedValues.push(newValue);
    localStorage.setItem(path, updatedValues);
  } else if (Array.isArray(path) && path.length) {
    storageItem = JSON.parse(localStorage.getItem(path[0])) || {};

    updatedValues = get(storageItem, path.slice(1), []);
    updatedValues.push(newValue);
    set(storageItem, path.slice(1), updatedValues);
    localStorage.setItem(path[0], JSON.stringify(storageItem));
  }

  if (updatedValues && typeof callback === 'function') {
    const callbackValue = updatedValues.map(item => getItemValue(item));
    callback(callbackValue);
  }
}
