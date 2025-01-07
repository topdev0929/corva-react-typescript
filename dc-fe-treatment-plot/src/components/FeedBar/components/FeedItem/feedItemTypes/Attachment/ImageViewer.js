import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { LoadingIndicator, IconButton as IconButtonComponent } from '@corva/ui/components';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import BackIcon from '@material-ui/icons/ArrowBack';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { forceFileDownload } from '@/components/FeedBar/utils/forceFileDownload';

const useStyles = makeStyles(theme => ({
  toolbar: {
    top: '5px',
    left: '5px',
    color: theme.palette.common.white,
    position: 'fixed',
    zIndex: 9999999,
  },
  toolbarButton: {
    verticalAlign: 'middle',
    padding: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
    },
  },
  toolBarIcon: {
    width: '42px !important',
    height: '34px !important',
    padding: '4px 6px',
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  loader: {
    zIndex: 100000000,
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
  },
  downloadWrapper: {
    verticalAlign: 'middle',
    padding: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  ligtbox: {
    zIndex: 99999,
  },
}));

const Toolbar = props => {
  const styles = useStyles();

  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        aria-label="Close"
        className={styles.toolbarButton}
        onClick={props.onCloseRequest}
      >
        <BackIcon className={styles.toolBarIcon} htmlColor="#b3b3b3" />
      </button>
    </div>
  );
};

const ImageViewer = props => {
  const styles = useStyles();
  const [loading, setLoading] = useState(true);

  const ToolbarButtons = [
    <button key="button" type="button" aria-label="Download" className={styles.downloadWrapper}>
      <IconButtonComponent
        tooltipProps={{ title: 'Download' }}
        onClick={() => forceFileDownload(props.fileName, props.mainSrc)}
      >
        <DownloadIcon className={styles.toolBarIcon} htmlColor="#b3b3b3" />
      </IconButtonComponent>
    </button>,
  ];

  const lightboxStyle = {
    overlay: {
      zIndex: 99999,
    },
  };

  return (
    <div style={{ zIndex: 9999 }}>
      <Toolbar onCloseRequest={props.onCloseRequest} />
      <Lightbox
        mainSrc={props.mainSrc}
        imagePadding={props.imagePadding}
        toolbarButtons={ToolbarButtons}
        onAfterOpen={props.onAfterOpen}
        onCloseRequest={props.onCloseRequest}
        onImageLoad={() => setLoading(false)}
        onImageLoadError={() => setLoading(false)}
        reactModalStyle={lightboxStyle}
      />
      {loading && (
        <div className={styles.loader}>
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

ImageViewer.propTypes = {
  fileName: PropTypes.string.isRequired,
  mainSrc: PropTypes.string.isRequired,
  imagePadding: PropTypes.number,
  onAfterOpen: PropTypes.func,
  onCloseRequest: PropTypes.func,
};

Toolbar.propTypes = {
  onCloseRequest: PropTypes.func.isRequired,
};

ImageViewer.defaultProps = {
  imagePadding: 50,
  onAfterOpen: undefined,
  onCloseRequest: undefined,
};

export default ImageViewer;
