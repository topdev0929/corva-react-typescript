import { removeCurrentAsset } from '../index';

describe('removeCurrentAsset function', () => {
  it('should remove current asset from list', () => {
    expect(removeCurrentAsset([1, 2, 3], 2)).toEqual([1, 3]);
  });
});
