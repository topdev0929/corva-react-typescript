import {
  addDays,
  isSameDay,
  getStartOfDay,
  getEndOfDay,
  getEndOfCalendarMonth,
  getStartOfCalendarMonth,
  getDaysInRange,
  isDayInRange,
  isToday,
  getDaysForCalendarMonth,
  formatDate,
  getFileExtension,
  getSecTimestamp,
  getTwoListsDifference,
  isSameYear,
  isSameMonth,
  splitDateRangeInTwoByYears,
  removeOpacityFromRGB,
  getUserFullName,
  getUserShortName,
} from '../index';

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('utils', () => {
  describe('formatDate', () => {
    it('should return formatted date', () => {
      const date = new Date('2020-01-01');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('01/01/2020');
    });
  });

  describe('getSecTimestamp', () => {
    it('should return timestamp in seconds', () => {
      expect(getSecTimestamp()).toBe(1577836800);
    });
  });

  describe('getTwoListsDifference', () => {
    it('should return difference between two lists', () => {
      const list1 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const list2 = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(getTwoListsDifference(list1, list2)).toEqual([{ id: 4 }]);
    });

    it('should return empty array if lists are equal', () => {
      const list1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const list2 = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(getTwoListsDifference(list1, list2)).toEqual([]);
    });

    it('should return empty array if lists are empty', () => {
      const list1 = [];
      const list2 = [];
      expect(getTwoListsDifference(list1, list2)).toEqual([]);
    });

    it('should return full array if second list are empty', () => {
      const list1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const list2 = [];
      expect(getTwoListsDifference(list1, list2)).toEqual(list1);
    });

    it('should return empty array if first list are empty', () => {
      const list1 = [];
      const list2 = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(getTwoListsDifference(list1, list2)).toEqual([]);
    });
  });

  describe('isSameDay', () => {
    it('should return true if dates are the same', () => {
      const date1 = new Date('2020-01-01 16:00:00');
      const date2 = new Date('2020-01-01 15:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false if dates are not the same', () => {
      const date1 = new Date('2020-01-01 16:00:00');
      const date2 = new Date('2020-01-02 15:00:00');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isDayInRange', () => {
    it('should return true if date is in range', () => {
      const date = new Date('2020-01-01 16:00:00');
      const start = new Date('2020-01-01 15:00:00');
      const end = new Date('2020-01-02 15:00:00');
      expect(isDayInRange(date, start, end)).toBe(true);
    });

    it('should return false if date is not in range', () => {
      const date = new Date('2020-01-03 16:00:00');
      const start = new Date('2020-01-01 15:00:00');
      const end = new Date('2020-01-02 15:00:00');
      expect(isDayInRange(date, start, end)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true if date is today', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(isToday(date)).toBe(true);
    });

    it('should return false if date is not today', () => {
      const date = new Date('2020-01-02 16:00:00');
      expect(isToday(date)).toBe(false);
    });
  });

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(getStartOfDay(date)).toEqual(new Date('2020-01-01 00:00:00'));
    });
  });

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(getEndOfDay(date)).toEqual(new Date('2020-01-01 23:59:59'));
    });
  });

  describe('getStartOfCalendarMonth', () => {
    it('should return start of calendar month', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(getStartOfCalendarMonth(date)).toEqual(new Date('2019-12-29 00:00:00'));
    });
  });

  describe('getEndOfCalendarMonth', () => {
    it('should return end of calendar month', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(getEndOfCalendarMonth(date)).toEqual(new Date('2020-02-01 23:59:59'));
    });
  });

  describe('getDaysInRange', () => {
    it('should return days in range', () => {
      const start = new Date('2020-01-01 16:00:00');
      const end = new Date('2020-01-03 16:00:00');
      expect(getDaysInRange(start, end)).toEqual([
        new Date('2020-01-01 16:00:00'),
        new Date('2020-01-02 16:00:00'),
        new Date('2020-01-03 16:00:00'),
      ]);
    });
  });

  describe('getDaysForCalendarMonth', () => {
    it('should return days in calendar month', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(getDaysForCalendarMonth(date)).toEqual([
        new Date('2019-12-29 00:00:00'),
        new Date('2019-12-30 00:00:00'),
        new Date('2019-12-31 00:00:00'),
        new Date('2020-01-01 00:00:00'),
        new Date('2020-01-02 00:00:00'),
        new Date('2020-01-03 00:00:00'),
        new Date('2020-01-04 00:00:00'),
        new Date('2020-01-05 00:00:00'),
        new Date('2020-01-06 00:00:00'),
        new Date('2020-01-07 00:00:00'),
        new Date('2020-01-08 00:00:00'),
        new Date('2020-01-09 00:00:00'),
        new Date('2020-01-10 00:00:00'),
        new Date('2020-01-11 00:00:00'),
        new Date('2020-01-12 00:00:00'),
        new Date('2020-01-13 00:00:00'),
        new Date('2020-01-14 00:00:00'),
        new Date('2020-01-15 00:00:00'),
        new Date('2020-01-16 00:00:00'),
        new Date('2020-01-17 00:00:00'),
        new Date('2020-01-18 00:00:00'),
        new Date('2020-01-19 00:00:00'),
        new Date('2020-01-20 00:00:00'),
        new Date('2020-01-21 00:00:00'),
        new Date('2020-01-22 00:00:00'),
        new Date('2020-01-23 00:00:00'),
        new Date('2020-01-24 00:00:00'),
        new Date('2020-01-25 00:00:00'),
        new Date('2020-01-26 00:00:00'),
        new Date('2020-01-27 00:00:00'),
        new Date('2020-01-28 00:00:00'),
        new Date('2020-01-29 00:00:00'),
        new Date('2020-01-30 00:00:00'),
        new Date('2020-01-31 00:00:00'),
        new Date('2020-02-01 00:00:00'),
      ]);
    });
  });

  describe('addDays', () => {
    it('should add 1 day', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(addDays(date, 1)).toEqual(new Date('2020-01-02 16:00:00'));
    });

    it('should not add days', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(addDays(date, 0)).toEqual(new Date('2020-01-01 16:00:00'));
    });

    it('should add 2 days', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(addDays(date, 2)).toEqual(new Date('2020-01-03 16:00:00'));
    });

    it('should not subtract 1 day', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(addDays(date, -1)).toEqual(new Date('2020-01-01 16:00:00'));
    });

    it('should not subtract 2 days', () => {
      const date = new Date('2020-01-01 16:00:00');
      expect(addDays(date, -2)).toEqual(new Date('2020-01-01 16:00:00'));
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      expect(getFileExtension('test.txt')).toEqual('txt');
    });

    it('should return empty file extension if there is no extension', () => {
      expect(getFileExtension('test')).toEqual('');
    });

    it('should return empty file extension if there is no file name', () => {
      expect(getFileExtension('')).toEqual('');
    });
  });

  describe('isSameYear', () => {
    it('should return true if years are the same', () => {
      expect(isSameYear(new Date('2020-01-01'), new Date('2020-12-31'))).toEqual(true);
    });

    it('should return false if years are not the same', () => {
      expect(isSameYear(new Date('2020-01-01'), new Date('2019-12-31'))).toEqual(false);
    });
  });

  describe('isSameMonth', () => {
    it('should return true if months are the same', () => {
      expect(isSameMonth(new Date('2020-01-01'), new Date('2020-01-31'))).toEqual(true);
    });

    it('should return false if months are not the same', () => {
      expect(isSameMonth(new Date('2020-01-01'), new Date('2020-02-01'))).toEqual(false);
    });
  });

  describe('splitDateRangeInTwoByYears', () => {
    it('should return one year', () => {
      const range = { start: new Date('2020-01-01'), end: new Date('2020-12-31') };
      expect(splitDateRangeInTwoByYears(range)).toEqual([
        { start: new Date('2020-01-01'), end: new Date('2020-12-31') },
      ]);
    });

    it('should return two years', () => {
      const range = { start: new Date('2020-01-01'), end: new Date('2021-12-31') };
      expect(splitDateRangeInTwoByYears(range)).toEqual([
        { start: new Date('2020-01-01'), end: new Date('2020-12-31T23:59:59.000Z') },
        { start: new Date('2021-01-01'), end: new Date('2021-12-31') },
      ]);
    });

    it('should return two years for range more then 2 years', () => {
      const range = { start: new Date('2020-01-01'), end: new Date('2022-12-31') };
      expect(splitDateRangeInTwoByYears(range)).toEqual([
        { start: new Date('2020-01-01'), end: new Date('2020-12-31T23:59:59.000Z') },
        { start: new Date('2021-01-01'), end: new Date('2022-12-31') },
      ]);
    });
  });

  describe('removeOpacityFromRGB', () => {
    it('should remove opacity from rgb', () => {
      expect(removeOpacityFromRGB('rgba(0, 0, 0, 0.5)')).toEqual('rgb(0, 0, 0)');
    });

    it('should change color if opacity is not set', () => {
      expect(removeOpacityFromRGB('rgb(0, 0, 0)')).toEqual('rgb(0, 0, 0)');
    });
  });

  describe('getUserFullName', () => {
    it('should return full name', () => {
      const user = { firstName: 'John', lastName: 'Doe' };
      expect(getUserFullName(user)).toEqual('John Doe');
    });

    it('should return unknown user if user is empty', () => {
      expect(getUserFullName({ firstName: '', lastName: '' })).toEqual('Unknown User');
    });

    it('should return first name if last name is empty', () => {
      const user = { firstName: 'John', lastName: '' };
      expect(getUserFullName(user)).toEqual('John');
    });

    it('should return last name if first name is empty', () => {
      const user = { firstName: '', lastName: 'Doe' };
      expect(getUserFullName(user)).toEqual('Doe');
    });
  });

  describe('getUserShortName', () => {
    it('should return short name', () => {
      const user = { firstName: 'John', lastName: 'Doe' };
      expect(getUserShortName(user)).toEqual('J.Doe');
    });

    it('should return empty string if user is empty', () => {
      expect(getUserShortName({ firstName: '', lastName: '' })).toEqual('Unknown User');
    });

    it('should return first name if last name is empty', () => {
      const user = { firstName: 'John', lastName: '' };
      expect(getUserShortName(user)).toEqual('John');
    });

    it('should return last name if first name is empty', () => {
      const user = { firstName: '', lastName: 'Doe' };
      expect(getUserShortName(user)).toEqual('Doe');
    });
  });
});
