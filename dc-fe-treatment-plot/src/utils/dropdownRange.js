function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

const parseRange = (a, b) => {
  if (b - a < 1) {
    return [];
  }

  return range(b - a + 1, +a);
};

export const normalizeDropdownRangeString = str => str.replace(/[^0-9,-]/g, '');

export const parseDropdownRangeString = str => {
  const result = new Set();
  const values = str.split(',');

  values.forEach(val => {
    if (val.includes('-')) {
      const numbers = parseRange(...val.split('-'));
      numbers.forEach(n => {
        result.add(+n);
      });
    } else {
      result.add(+val);
    }
  });
  return Array.from(result).filter(n => n >= 1);
};

export const parseDropdownRangeArray = inputArray => {
  const arr = [...inputArray].sort((a, b) => a - b);
  let result = '';
  let prev = '';
  arr.forEach(n => {
    if (!prev) {
      result += n;
      prev = n;
      return;
    }

    if (prev === n - 1) {
      prev = n;
      return;
    }

    if (result.endsWith(prev.toString())) {
      result += ',' + n;
      prev = n;
      return;
    }

    result += '-' + prev + ',' + n;
    prev = n;
  });

  if (!result.endsWith(prev.toString())) {
    result += '-' + prev;
  }

  return result;
};
