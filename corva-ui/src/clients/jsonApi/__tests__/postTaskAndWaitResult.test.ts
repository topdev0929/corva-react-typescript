import { get, post } from '../../api/apiCore';
import { postTaskAndWaitResult } from '../postTaskAndWaitResult';

export const flushPromises = () => {
  return new Promise(jest.requireActual('timers').setImmediate);
};

jest.mock('../../api/apiCore', () => ({
  get: jest.fn().mockReturnValue({ state: 'succeeded', payload: {} }),
  post: jest.fn().mockReturnValue('x'),
}));

describe('postTaskAndWaitResult', () => {
  it('should be resolved with task result', async () => {
    const result = await postTaskAndWaitResult({} as any);
    expect(result).toEqual({
      state: 'succeeded',
      payload: {},
    });
  });

  it('should not be resolved with task result before the result is "succeeded"', async () => {
    // @ts-ignore
    get.mockReturnValue({ state: 'running', payload: {} });
    const returnedResult = jest.fn();
    postTaskAndWaitResult({} as any).then(returnedResult);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(returnedResult).not.toBeCalled();

    // @ts-ignore
    get.mockReturnValue({ state: 'succeeded', payload: { done: true } });
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(returnedResult).toBeCalledWith({
      state: 'succeeded',
      payload: { done: true },
    });
  });

  it('should return "failed" task result if task waiting time ran out', async () => {
    // @ts-ignore
    get.mockReturnValue(Promise.resolve({ state: 'running', payload: {} }));

    const returnedResult = jest.fn();
    postTaskAndWaitResult({} as any, { maxAttempts: 3 }).then(returnedResult);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(returnedResult).toBeCalledWith({
      state: 'failed',
      fail_reason: 'Task timed out',
    });
  });

  it('should be rejected with the fail reason when "throwOnError" set to true', async () => {
    // @ts-ignore
    get.mockReturnValue(Promise.resolve({ state: 'failed', fail_reason: 'because' }));

    const resolve = jest.fn();
    const reject = jest.fn();

    postTaskAndWaitResult({} as any, { throwOnError: true })
      .then(resolve)
      .catch(reject);

    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(reject).toBeCalledWith('because');
  });

  it('should be rejected with "Timed out" when timed out and "throwOnError" is true', async () => {
    // @ts-ignore
    get.mockReturnValue(Promise.resolve({ state: 'running', payload: {} }));

    const resolve = jest.fn();
    const reject = jest.fn();

    postTaskAndWaitResult({} as any, { maxAttempts: 1, throwOnError: true })
      .then(resolve)
      .catch(reject);

    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(reject).toBeCalledWith('Task timed out');
  });
});
