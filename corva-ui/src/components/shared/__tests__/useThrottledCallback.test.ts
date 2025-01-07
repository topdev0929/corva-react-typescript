import { useThrottledCallback } from '../useThrottledCallback';
import { createTestHook } from './createTestHook';

describe('useThrottledCallback', () => {
  it('should create a function from the provided one. The original function should be called. When throttled version is called.', () => {
    const fun = jest.fn();
    const useHook = createTestHook(useThrottledCallback);
    const throttledFun = useHook(fun);
    throttledFun(10);
    jest.runAllTimers();
    expect(fun).toBeCalledWith(10);
  });

  it('should return the very same function each call', () => {
    const useHook = createTestHook(useThrottledCallback);
    const first = useHook(() => {});
    const second = useHook(() => {});

    expect(first).toBe(second);
  });

  it('should call the throttled function with the very last args', () => {
    const fun = jest.fn();
    const useHook = createTestHook(useThrottledCallback);
    const throttled = useHook(fun);

    throttled(10);
    throttled(20);
    throttled(30);

    jest.runAllTimers();

    expect(fun).toBeCalledTimes(1);
    expect(fun).toBeCalledWith(30);
  });

  it('should call the LAST version of callback with the very last args', () => {
    const stale = jest.fn();
    const latest = jest.fn();
    const useHook = createTestHook(useThrottledCallback);
    const throttledA = useHook(stale);

    throttledA(10);
    throttledA(20);
    throttledA(30);

    // "rerender" with another callback
    const throttledB = useHook(latest);

    jest.runAllTimers();

    expect(stale).not.toBeCalled();
    expect(latest).toBeCalledTimes(1);
    expect(latest).toBeCalledWith(30);
  });
});
