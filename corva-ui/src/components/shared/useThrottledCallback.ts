import { useEffect, useMemo, useRef } from 'react';

const scheduleTask = (task: (...params: any[]) => void, delay: number) => {
  if (Number.isFinite(delay)) {
    return { timeout: setTimeout(task, delay) };
  }
  return { raf: requestAnimationFrame(task) };
};

const cancelTask = taskHandle => {
  if (taskHandle?.timeout) {
    clearTimeout(taskHandle.timeout);
  }
  if (taskHandle?.raf) {
    cancelAnimationFrame(taskHandle.raf);
  }
};

/**
 * Accepts a callback function (usually an event handler) that triggers some
 * heavy rerendering and causes react to choke with render tasks.
 *
 * Ensures that only one task to run the callback is scheduled.
 * The latest version of the callback will be called with the latest params
 *
 * It is a good idea to wrap onMouseMove handlers as well as onMouseUp to prevent
 * mouseUp handler called before the last mouse move
 *
 * @param callback
 * @param delayMs delay in milliseconds
 */
export const useThrottledCallback = (callback: (...params: any[]) => void, delayMs = 0) => {
  const taskRef = useRef(null);
  const latestArgsRef = useRef([]);
  const callbackRef = useRef(callback);
  // store the original callback each time in case if it changes over time
  callbackRef.current = callback;

  const throttledCallback = useMemo(() => {
    // create function once
    const throttledCallback = (...params: any[]) => {
      // update params each time the callback is called to
      // call the original callback with the latest ones
      latestArgsRef.current = params;
      if (taskRef.current) {
        return;
      }
      taskRef.current = scheduleTask(() => {
        callbackRef.current(...latestArgsRef.current);
        taskRef.current = null;
      }, delayMs);
    };
    return throttledCallback;
  }, []);

  useEffect(() => {
    const cleanUp = () => cancelTask(taskRef.current);
    return cleanUp;
  }, []);

  return throttledCallback;
};
