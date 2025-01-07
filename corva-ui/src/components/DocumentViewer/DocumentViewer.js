import { createRef, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, Modal, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import { LoadingIndicator } from '~/components';

import { useStyles } from './styles.js';

const REQUEST_TIMEOUT = 10000;
const BYTES_IN_MEGABYTE = 1048576;

const DocumentViewer = ({ open, fileUrl, fileSize, fileName, webviewType, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const timeoutRef = createRef(null);
  const iframeRef = createRef(null);
  const styles = useStyles();

  const getIframeLink = useCallback(() => {
    return webviewType === 'office'
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${window.encodeURIComponent(fileUrl)}`
      : `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }, [fileUrl]);

  const reloadFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = getIframeLink();
      iframeRef.current.contentWindow.location.reload();
    }
  };

  const handleFrameLoad = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    setIsLoading(false);
  };

  const handleFrameError = () => {
    handleFrameLoad();
    setIsLoadingFailed(true);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsLoadingFailed(false);
    const timeOut =
      fileSize && fileSize >= BYTES_IN_MEGABYTE
        ? (fileSize / BYTES_IN_MEGABYTE) * REQUEST_TIMEOUT
        : REQUEST_TIMEOUT;

    if (timeoutRef && open) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = setInterval(reloadFrame, timeOut);
    }

    return () => {
      clearInterval(timeoutRef.current);
    };
  }, [fileUrl, open]);

  return (
    <Modal open={open} onClose={onClose} onContextMenu={e => e.stopPropagation()}>
      <div className={styles.cDocsViewer}>
        <div className={styles.cDocsViewerToolbar}>
          <Typography>{fileName}</Typography>
          <div>
            <IconButton size="small" className={styles.cDocsViewerToolbarIconButton}>
              <a download href={fileUrl} target="_blank" rel="noopener noreferrer">
                <GetAppIcon fontSize="small" />
              </a>
            </IconButton>
            <IconButton
              size="small"
              onClick={onClose}
              className={styles.cDocsViewerToolbarIconButton}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        {isLoading && (
          <div className={styles.cDocsViewerFrame}>
            <LoadingIndicator white={false} />
          </div>
        )}
        {isLoadingFailed ? (
          <div className={styles.cDocsViewerFrame}>
            <Typography variant="body2" className={styles.cDocsViewerFrameFailed}>
              Loading failed
            </Typography>
          </div>
        ) : (
          <iframe
            className={classNames(styles.cDocsViewerFrame, {
              [styles.cDocsViewerFrameHidden]: isLoading,
            })}
            title={fileUrl}
            src={getIframeLink()}
            onLoad={handleFrameLoad}
            onError={handleFrameError}
            ref={iframeRef}
          />
        )}
      </div>
    </Modal>
  );
};

DocumentViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  fileUrl: PropTypes.string.isRequired,
  webviewType: PropTypes.oneOf(['google', 'office']),
  fileName: PropTypes.string,
  fileSize: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

DocumentViewer.defaultProps = {
  fileName: undefined,
  fileSize: undefined,
  webviewType: 'google',
};

export default DocumentViewer;
