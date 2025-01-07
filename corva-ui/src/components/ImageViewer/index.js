import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';

import DownloadIcon from '@material-ui/icons/SaveAlt';
import BackIcon from '@material-ui/icons/ArrowBack';

import { useIsInsideDcApp } from '../DevCenter/DevCenterAppContainer/components';

import styles from './styles.css';

const PAGE_NAME = 'ImageViewer';

const Toolbar = props => (
  <div className={styles.cImageViewerToolbar}>
    <button
      type="button"
      aria-label="Close"
      className={styles.cImageViewerToolbarButton}
      onClick={props.onCloseRequest}
    >
      <BackIcon className={styles.cImageViewerToolbarIcon} htmlColor="#fff" />
    </button>
  </div>
);

const ImageViewer = props => {
  const isInsideDcApp = useIsInsideDcApp();

  const renderToolbarButtons = () => [
    <button
      data-testid={`${PAGE_NAME}_download`}
      type="button"
      aria-label="Download"
      className={styles.cImageViewerToolbarButton}
    >
      <a href={props.mainSrc} download="image" target="_blank" rel="noopener noreferrer">
        <DownloadIcon className={styles.cImageViewerToolbarIcon} htmlColor="#fff" />
      </a>
    </button>,
  ];

  return (
    <div className={styles.cImageViewer}>
      <Lightbox
        mainSrc={props.mainSrc}
        imagePadding={props.imagePadding}
        toolbarButtons={renderToolbarButtons()}
        onAfterOpen={props.onAfterOpen}
        onCloseRequest={props.onCloseRequest}
        reactModalStyle={{ overlay: { zIndex: 1500 } }}
        reactModalProps={{
          // eslint-disable-next-line no-restricted-globals
          parentSelector: () => (isInsideDcApp ? parent.document.body : document.body),
          overlayElement: (props, contentElement) => (
            <div {...props}>
              <Toolbar onCloseRequest={props.onCloseRequest} />
              {contentElement}
            </div>
          ),
        }}
        wrapperClassName={styles.cImageViewerWrapper}
      />
    </div>
  );
};

ImageViewer.propTypes = {
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
