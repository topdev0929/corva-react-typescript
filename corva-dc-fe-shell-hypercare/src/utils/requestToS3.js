export const ABORT_PROMISE_MESSSAGE = 'cancelled manually';

export const putFile = async (
  file,
  url,
  { onUploadProgress, headers = {}, abortController } = {}
) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url);
    const requestHeaders = { ...headers, 'x-amz-acl': 'public-read' };
    Object.keys(requestHeaders).forEach(headerName => {
      request.setRequestHeader(headerName, requestHeaders[headerName]);
    });
    if (abortController) {
      abortController(request.abort.bind(request));
    }
    if (onUploadProgress) {
      request.upload.addEventListener('progress', ({ loaded, total }) =>
        onUploadProgress(loaded, total)
      );
    }
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response);
      } else {
        reject(request.status);
      }
    };
    request.onerror = () => {
      reject(request.status);
    };
    request.onabort = () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(ABORT_PROMISE_MESSSAGE);
    };
    request.send(file);
  });
};
