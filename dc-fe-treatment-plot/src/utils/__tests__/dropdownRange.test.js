/* eslint-disable no-undef */
import {
  normalizeDropdownRangeString,
  parseDropdownRangeArray,
  parseDropdownRangeString,
} from '../dropdownRange';

const stringTests = [
  ['1,2,3', [1, 2, 3]],
  ['1-5,2-3,4,7', [1, 2, 3, 4, 5, 7]],
];

const arrayTests = [
  [[1, 2, 3], '1-3'],
  [[1, 3, 4], '1,3-4'],
  [[1, 2, 5, 7, 8, 10], '1-2,5,7-8,10'],
  [[1, 2, 5, 6, 7, 8, 10], '1-2,5-8,10'],
  [[1, 2, 5, 6, 7, 8, 10, 12], '1-2,5-8,10,12'],
  [[1, 2, 5, 6, 7, 8, 10, 12, 14, 15], '1-2,5-8,10,12,14-15'],
];

describe('dropdownRange utils', () => {
  it('normalizeDropdownRangeString', () => {
    expect(normalizeDropdownRangeString('1-2,3;!@#$%^&*()[];\':"')).toEqual('1-2,3');
  });
  it('parseDropdownRangeString', () => {
    stringTests.forEach(([input, output]) => {
      expect(parseDropdownRangeString(input)).toEqual(output);
    });
  });
  it('parseDropdownRangeArray', () => {
    arrayTests.forEach(([input, output]) => {
      expect(parseDropdownRangeArray(input)).toEqual(output);
    });
  });
});
