import { times } from 'lodash';

import { getPages, getAppType } from '../dashboardReports';

const NORMAL_APP = { coordinates: { w: 5, h: 5 } };
const WIDE_APP = { coordinates: { w: 10, h: 5 } };
const HALFSCREEN_APP = { coordinates: { w: 10, h: 30 } };
const FULLSCREEN_APP = { coordinates: { w: 10, h: 50 } };

describe('getPages', () => {
  describe('splitting', () => {
    it('splits 12 normal apps into 2 pages', () => {
      expect(getPages(times(12, () => NORMAL_APP)).length).toBe(2);
    });
    it('splits 2 fullscreen apps into 2 pages', () => {
      expect(getPages(times(2, () => FULLSCREEN_APP)).length).toBe(2);
    });
    it('splits 2 halfscreen apps into 2 pages', () => {
      expect(getPages(times(2, () => HALFSCREEN_APP)).length).toBe(2);
    });
    it('splits 6 wide apps into 2 pages', () => {
      expect(getPages(times(6, () => WIDE_APP)).length).toBe(2);
    });
  });

  describe('combining', () => {
    it('puts 1 wide and 1 halfscreen apps into same page', () => {
      expect(getPages([WIDE_APP, HALFSCREEN_APP]).length).toBe(1);
    });
    it('puts 2 wide and 2 normal apps into same page', () => {
      expect(getPages([WIDE_APP, WIDE_APP, NORMAL_APP, NORMAL_APP]).length).toBe(1);
    });
    it('puts 2 normal and 1 halfscreen apps into same page', () => {
      expect(getPages([NORMAL_APP, NORMAL_APP, HALFSCREEN_APP]).length).toBe(1);
    });
  });

  describe('enlarging', () => {
    it('enlarges normal app if next app takes two columns', () => {
      expect(getPages([NORMAL_APP, HALFSCREEN_APP]).length).toBe(1);
      expect(getPages([NORMAL_APP, HALFSCREEN_APP])[0][0].slots).toBe(2);
    });
  });

  it('returns pageApp entity with slots and reportAppSize', () => {
    const appType = getAppType(FULLSCREEN_APP);
    expect(getPages([FULLSCREEN_APP])[0][0]).toStrictEqual({
      app: FULLSCREEN_APP,
      slots: appType.slots,
      reportAppSize: appType,
    });
  });
});
