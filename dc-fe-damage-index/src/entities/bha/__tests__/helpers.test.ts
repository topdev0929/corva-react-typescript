import { convertBHAListToMap, sortBHAs, toBHAsOptions } from '../index';
import { mockedBHAOptions, mockedBHAs, mockedSortedBHAs } from '../../../mocks/bha';

describe('toBHAsOptions function', () => {
  it('should convert list of BHAs to options for selector', () => {
    expect(toBHAsOptions(mockedBHAs)).toEqual(mockedBHAOptions);
  });
});

describe('sortBHAs function', () => {
  it('should sort BHAs', () => {
    expect(sortBHAs(mockedBHAs)).toEqual(mockedSortedBHAs);
  });
});

describe('convertBHAListToMap function', () => {
  it('should convert list of BHAs to Map', () => {
    const map = new Map();
    map.set(mockedBHAs[0].id, true);
    map.set(mockedBHAs[1].id, true);
    map.set(mockedBHAs[2].id, true);
    expect(convertBHAListToMap(mockedBHAs)).toEqual(map);
  });
});
