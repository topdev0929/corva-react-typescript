import { FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import { LoadingIndicator } from '@corva/ui/components';

import { getFileFromUrl, getFileViewerLink } from '@/shared/utils';

import styles from './index.module.css';

const REQUEST_TIMEOUT = 10000;
const BYTES_IN_MEGABYTE = 1048576;

type Props = {
  fileUrl: string;
  fileName: string;
  'data-testid'?: string;
};

export const DocViewer: FC<Props> = ({ fileUrl, fileName, 'data-testid': dataTestId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const iframeLink = useMemo(() => getFileViewerLink(fileName, fileUrl), [fileUrl, fileName]);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const reloadFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeLink;
      iframeRef.current.contentWindow?.location.reload();
    }
  };

  const handleFrameLoad = () => {
    clearTimer();
    setIsLoading(false);
  };

  const handleFrameError = () => {
    handleFrameLoad();
    setIsLoadingFailed(true);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsLoadingFailed(false);

    getFileFromUrl(fileUrl).then(file => {
      const timeOut =
        file.size >= BYTES_IN_MEGABYTE
          ? (file.size / BYTES_IN_MEGABYTE) * REQUEST_TIMEOUT
          : REQUEST_TIMEOUT;
      timeoutRef.current = setInterval(reloadFrame, timeOut);
    });

    return () => {
      clearTimer();
    };
  }, [fileUrl]);

  if (isLoadingFailed) {
    return (
      <div className={styles.container}>
        <Typography variant="body2" className={styles.failed}>
          Loading failed
        </Typography>
      </div>
    );
  }

  return (
    <>
      {isLoading && <LoadingIndicator white className={styles.loader} />}
      <iframe
        data-testid={`${dataTestId}_frame`}
        className={classNames(styles.container, { [styles.hidden]: isLoading })}
        title={fileUrl}
        src={iframeLink}
        onLoad={handleFrameLoad}
        onError={handleFrameError}
        ref={iframeRef}
      />
    </>
  );
};
