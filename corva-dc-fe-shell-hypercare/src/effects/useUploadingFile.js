import { useEffect, useState } from 'react';
import { getS3SignedUrl } from '@corva/ui/clients/jsonApi';
import { ABORT_PROMISE_MESSSAGE, putFile } from '~/utils/requestToS3';

export const useUploadingFile = (start, file, onFinish, getSignedUrl = getS3SignedUrl) => {
  const [filesUploadedSize, setFilesUploadedSize] = useState({});
  const [filesUploadParams, setFilesUploadParams] = useState([]);
  const [filesUploadingFinished, setFilesUploadingFinished] = useState({});

  const handleError = (message, fileName) => {
    console.error(message);
    if (message === ABORT_PROMISE_MESSSAGE) {
      return setFilesUploadParams(prev => prev.filter(params => params.name !== fileName));
    }
    return setFilesUploadParams(prev =>
      prev.map(params => (params.name === fileName ? { ...params, error: true } : params))
    );
  };

  const uploadOneFile = async fileItem => {
    try {
      const { name, type, size } = fileItem;
      const { signed_url, display_name, file_name } = await getSignedUrl(name, type);
      const config = {
        abortController: abortRequest =>
          setFilesUploadParams(prev => [...prev, { name, size, abortRequest, error: false }]),
        onUploadProgress: (loaded, total) => {
          setFilesUploadedSize(prev => ({ ...prev, [name]: loaded }));
          if (loaded === total) {
            setFilesUploadingFinished(prev => ({ ...prev, [name]: true }));
          }
        },
        headers: {
          'Content-Type': type,
        },
      };
      await putFile(fileItem, signed_url, config);
      await onFinish({
        data: {
          file_name,
          display_name,
        },
      });
    } catch (err) {
      handleError(err, fileItem.name);
    }
  };

  const handleReset = () => {
    setFilesUploadParams([]);
    setFilesUploadedSize({});
  };

  const startLoading = async () => {
    handleReset();
    await uploadOneFile(file);
  };

  useEffect(() => {
    if (start && file) {
      startLoading();
    }
  }, [file, start]);

  useEffect(() => {
    Object.keys(filesUploadingFinished).forEach(fileName => {
      setTimeout(() => {
        setFilesUploadParams(prev => prev.filter(item => item.name !== fileName));
      }, 3000);
    });
  }, [filesUploadingFinished]);

  return [filesUploadParams, filesUploadedSize, handleReset];
};
