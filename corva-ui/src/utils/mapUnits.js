/**
 * Map titles(labels) with respective metrics
 * @param  {Object}  data - object with titles/labels and metrics: { footage: {
 *   label: 'Some text',
 *   metrics: 'length',
 * } }
 * @param  {Object} units  - object with metrics: { length: 'meters' }
 * @return {Object}        - Formatted object with titles(labels) and respective metrics
 */

const mapUnits = (data, units) =>
  Object.keys(data).reduce((acc, key) => {
    const field = data[key];
    acc[key] = field.label;

    if ('metrics' in field) {
      acc[key] += ` (${units[field.metrics]})`;
    }

    return acc;
  }, {});

export default mapUnits;
