import {
  DI_STATUS,
  getCurrentDIFromList,
  getDIStatus,
  generateDIChanges,
  sortDIByTime,
} from '../index';
import { mockedDiList, mockedSortedDiList } from '../../../mocks/di';
import { DEFAULT_DI_CHANGES } from '../../../constants';

describe('getCurrentDIFromList function', () => {
  it('should return first item from list', () => {
    expect(getCurrentDIFromList(mockedDiList)).toEqual(mockedDiList[0]);
  });
});

describe('sortDIByTime function', () => {
  it('should sort list of DI', () => {
    expect(sortDIByTime(mockedDiList)).toEqual(mockedSortedDiList);
  });
});

describe('getDIStatus function', () => {
  it('should return safe status', () => {
    expect(getDIStatus(0.5, 1, 3)).toEqual(DI_STATUS.SAFE);
  });

  it('should return warn status', () => {
    expect(getDIStatus(1.2, 1, 3)).toEqual(DI_STATUS.WARN);
  });

  it('should return danger status', () => {
    expect(getDIStatus(4.8, 1, 3)).toEqual(DI_STATUS.DANGER);
  });
});

describe('generateDIChanges function', () => {
  let di;

  beforeEach(() => {
    [di] = mockedDiList;
  });

  it('should return default list if there is no di', () => {
    expect(generateDIChanges(null, mockedDiList)).toEqual(DEFAULT_DI_CHANGES);
  });

  it('should return default list DI list is empty', () => {
    expect(generateDIChanges(di, [])).toEqual(DEFAULT_DI_CHANGES);
  });

  it('should generate di changes', () => {
    expect(generateDIChanges(di, mockedDiList)).toEqual([
      {
        ...DEFAULT_DI_CHANGES[0],
        value: 1.3,
      },
      {
        ...DEFAULT_DI_CHANGES[1],
        value: 0.2,
      },
      {
        ...DEFAULT_DI_CHANGES[2],
        value: 0.2,
      },
    ]);
  });
});
