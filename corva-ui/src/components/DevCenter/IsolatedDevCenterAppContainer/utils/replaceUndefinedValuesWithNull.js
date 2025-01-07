import { isPlainObject, reduce } from 'lodash';

export function replaceUndefinedValuesWithNull(object) {
  if (!isPlainObject(object)) {
    return object;
  }

  return reduce(
    object,
    (result, value, key) => {
      let mappedValue = value;

      if (isPlainObject(value)) {
        mappedValue = replaceUndefinedValuesWithNull(value);
      } else if (value === undefined) {
        mappedValue = null;
      }
      // eslint-disable-next-line no-param-reassign
      result[key] = mappedValue;

      return result;
    },
    {}
  );
}
