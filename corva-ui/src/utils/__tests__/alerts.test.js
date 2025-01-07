import { getStartTimeByRelativeRange } from '../alerts';

const range = {
  all: { label: 'All', value: 'all' },
  last12hours: { label: 'Last 12 hours', value: 'last12hours' },
  last24hours: { label: 'Last 24 hours', value: 'last24hours' },
  last7days: { label: 'Last 7 days', value: 'last7days' },
  lastMonth: { label: 'Last month', value: 'lastMonth' },
  custom: { label: 'Custom', value: 'custom' },
};

describe('Util', () => {
  describe('alerts', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 0);

    describe('getStartTimeByRelativeRange', () => {
      describe('unix format', () => {
        it(range.all.value, () => {
          expect(getStartTimeByRelativeRange(range.all.value)).toBe(null);
        });
        it(range.last12hours.value, () => {
          expect(getStartTimeByRelativeRange(range.last12hours.value)).toBe(-43200);
        });
        it(range.last24hours.value, () => {
          expect(getStartTimeByRelativeRange(range.last24hours.value)).toBe(-86400);
        });
        it(range.last7days.value, () => {
          expect(getStartTimeByRelativeRange(range.last7days.value)).toBe(-604800);
        });
        it(range.lastMonth.value, () => {
          expect(getStartTimeByRelativeRange(range.lastMonth.value)).toBe(-2678400);
        });
        it(range.custom.value, () => {
          expect(getStartTimeByRelativeRange(range.custom.value)).toBe(null);
        });
      });

      describe('milliseconds format', () => {
        it(range.all.value, () => {
          expect(getStartTimeByRelativeRange(range.all.value, true)).toBe(null);
        });
        it(range.last12hours.value, () => {
          expect(getStartTimeByRelativeRange(range.last12hours.value, true)).toBe(-43200000);
        });
        it(range.last24hours.value, () => {
          expect(getStartTimeByRelativeRange(range.last24hours.value, true)).toBe(-86400000);
        });
        it(range.last7days.value, () => {
          expect(getStartTimeByRelativeRange(range.last7days.value, true)).toBe(-604800000);
        });
        it(range.lastMonth.value, () => {
          expect(getStartTimeByRelativeRange(range.lastMonth.value, true)).toBe(-2678400000);
        });
        it(range.custom.value, () => {
          expect(getStartTimeByRelativeRange(range.custom.value, true)).toBe(null);
        });
      });
    });
  });
});
