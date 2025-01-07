import { transform, snakeCase, camelCase } from 'lodash';

export const getConvertKeys = converterFn => {
  const convertKeys = obj => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(convertKeys);
    }

    return transform(
      obj,
      (result, value, key) => {
        // eslint-disable-next-line no-param-reassign
        result[converterFn(key)] = convertKeys(value);
      },
      {}
    );
  };

  return convertKeys;
};

export const convertKeysToSnakeCase = getConvertKeys(snakeCase);

export const convertKeysToCamelCase = getConvertKeys(camelCase);
