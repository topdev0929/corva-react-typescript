import {
  formatNumberPrecision,
  formatNumber,
  formatDate,
  formatShortDate,
  roundValue,
  setAlphaInRGBA,
  debounce,
} from '../index';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');

it('should set alpha in rgba color', () => {
  expect(setAlphaInRGBA('rgba(0, 0, 0, 1)', 0.5)).toEqual('rgba(0, 0, 0, 0.5)');
});

it('should round value with default precision', () => {
  expect(roundValue(1.01556)).toEqual(1.02);
});

it('should round value with precision', () => {
  expect(roundValue(1.01556, 3)).toEqual(1.016);
});

it('should format date', () => {
  expect(formatDate(3251345315835)).toEqual('01/11/2073 07:28');
});

it('should convert date to short format', () => {
  expect(formatShortDate(3251345315835)).toEqual('01/11/73');
});

it('should format number', () => {
  expect(formatNumber(100000)).toEqual('100,000');
});

it('should format number with default precision', () => {
  expect(formatNumberPrecision(100000.15665)).toEqual('100,000.16');
});

it('should format number with precision', () => {
  expect(formatNumberPrecision(100000.15665, 3)).toEqual('100,000.157');
});

it('should delay callback calling', () => {
  const callback: jest.Mock = jest.fn();
  const wait = 1000;
  debounce(callback, wait)();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), wait);
});
