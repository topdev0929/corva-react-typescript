/**
 * Returns a promise that will be resolved after delay with an optional result
 * @param {number} delayMs
 * @param {any} [result]
 * @returns {Promise<any>}
 */
export function delay(delayMs, result) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result);
    }, delayMs);
  });
}
