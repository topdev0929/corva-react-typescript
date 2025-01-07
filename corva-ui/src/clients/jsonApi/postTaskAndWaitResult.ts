import { get, post } from '../api/apiCore';
import { delay } from '~/utils/delay';

const MAX_ATTEMPTS_COUNT = 60;
const RETRY_DELAY_MS = 1000;

export type TaskRequest = {
  provider: string;
  app_key: string;
  asset_id: number;
  properties?: object;
};

export type TaskResult = {
  state: 'running' | 'succeeded' | 'failed';
  fail_reason?: string;
  payload?: any;
};


type TaskRequestOptions = {
  /**
   * defaults to 60
   */
  maxAttempts?: number;
  /**
   * delay before the next attempt in ms
   * defaults to 1000ms
   */
  retryDelay?: number;
  /**
   * When set to true, the function will throw an error when
   * the task fails or times out
   */
  throwOnError?: boolean;
};

const getTaskResult = async (
  taskId: string,
  options?: TaskRequestOptions
): Promise<TaskResult> => {
  const { maxAttempts = MAX_ATTEMPTS_COUNT, retryDelay = RETRY_DELAY_MS } = options || {};

  for (let attempt = 0; attempt < maxAttempts; attempt = attempt + 1) {
    const response: TaskResult = await get(`/v2/tasks/${taskId}`, {});
    if (response.state !== 'running') {
      return response;
    }
    await delay(retryDelay);
  }
  return {
    state: 'failed',
    fail_reason: 'Task timed out',
  };
};

export const postTaskAndWaitResult = async (task: TaskRequest, options?: TaskRequestOptions): Promise<TaskResult> => {
  let result: TaskResult;
  try {
    const { id } = await post('/v2/tasks', { task });
    result = await getTaskResult(id, options);
  } catch (err) {
    result = {
      state: 'failed',
      fail_reason: err,
    };
  }
  if (options?.throwOnError && result.state !== 'succeeded') {
    throw result.fail_reason;
  }
  return result;
};
