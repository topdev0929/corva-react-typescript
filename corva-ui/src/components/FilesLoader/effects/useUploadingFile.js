import { useMemo, useEffect, useState } from 'react';
import { round } from 'lodash';

import { BYTES_IN, SIZE_UNIT } from '../constants';

export const useUploadingFile = (file, onLoad) => {
  const [loadedSize, setLoadedSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);

  const onFileLoadStart = () => {
    setIsLoading(true);
  };

  const onFileLoadProgress = (event) => {
    setLoadedSize(event.loaded);
  };

  const onFileLoad = (event) => {
    setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
      setTimeout(() => setIsDeletable(true), 1000);

      onLoad(event.target.result);
    }, 400);
  };

  const onFileLoadError = () => {};

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.addEventListener('loadstart', onFileLoadStart);
      fileReader.addEventListener('progress', onFileLoadProgress);
      fileReader.addEventListener('load', onFileLoad);
      fileReader.addEventListener('error', onFileLoadError);
      fileReader.readAsText(file);
    }
  }, [file]);

  const getProgressPercent = () => {
    return (loadedSize * 100) / (file.size || 1);
  };

  const getFormattedSize = (size) => {
    if (size > BYTES_IN.MB) {
      return round(size / BYTES_IN.MB, 1);
    } else if (size > BYTES_IN.KB) {
      return round(size / BYTES_IN.KB, 1);
    }

    return size;
  };

  const getSizeUnit = (size) => {
    if (size > 1048576) {
      return SIZE_UNIT.MB;
    } else if (size > 1024) {
      return SIZE_UNIT.KB;
    }

    return SIZE_UNIT.B;
  };

  return useMemo(() => {
    return {
      getProgressPercent,
      getFormattedSize,
      getSizeUnit,
      isLoading,
      isLoaded,
      isDeletable,
      loadedSize,
      size: file.size,
      name: file.name,
    };
  }, [
    file,
    loadedSize,
    isLoading,
    isLoaded,
    isDeletable,
  ]);
}