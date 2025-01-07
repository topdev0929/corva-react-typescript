import { get } from 'lodash';

import { convertValue } from '~/utils/convert';

export const convertData = ({ mapping, data, indexesKeys }) => {
  return mapping.reduce((acc, { key, unit, unitType, collection }) => {
    const dataKey = `${collection}.${key}`;
    const index = indexesKeys[collection];
    let min = Infinity;
    let max = -Infinity;

    acc[dataKey] = {};

    if (data[collection]) {
      acc[dataKey].data = data[collection].map(item => {
        const val = convertValue(get(item, key), unitType, unit);
        if (Number.isFinite(val)) {
          if (val > max) {
            max = val;
          }
          if (val < min) {
            min = val;
          }
        }
        return [convertValue(get(item, index.key), index.unitType, index.unit), val];
      });

      acc[dataKey].min = min;
      acc[dataKey].max = max;
    }

    return acc;
  }, {});
};
