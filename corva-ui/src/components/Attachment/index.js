import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import { Dialog } from '@material-ui/core';

import ImageIcon from '@material-ui/icons/Image';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import FullSizeIcon from '@material-ui/icons/Fullscreen';

import grey from '@material-ui/core/colors/grey';

import FileTypeIcon from '~components/FileTypeIcon';
import ImageViewer from '~components/ImageViewer';
import GoogleDocsViewer from '~components/GoogleDocsViewer';
import IconButton from '~components/IconButton';

import { isNativeDetected } from '~/utils/mobileDetect';
import { getIsVideo, getIsImage } from '~/utils/fileExtension';
import { useSignedURL } from '~/effects';
import utils from '~utils/main'; // question here
import styles from './styles.css';

const PAGE_NAME = 'Attachment';

const grey200 = grey[200];
const grey400 = grey[400];

const SIZES = {
  small: { label: 'small', value: 135 },
  medium: { label: 'medium', value: 300 },
};

const style = {
  fileImage: (imageIsLoaded, size) => ({
    maxWidth: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    // NOTE: Makes one-line comment with image fits into comments container. Equals to
    // imagePlaceholder height
    maxHeight: size === SIZES.small.label ? SIZES.small.value : SIZES.medium.value,
    display: imageIsLoaded ? 'initial' : 'none',
    cursor: 'pointer',
  }),
  fileDownloadWrapper: {
    padding: '10px 10px 10px 5px',
    border: `1px solid #616161`,
    borderRadius: 3,
    maxWidth: 500, // NOTE: Corresponds to react-player max width
    width: '75%',
  },
  imagePlaceholder: {
    position: 'relative',
    backgroundColor: grey200,
    borderRadius: 3,
    marginTop: 10,
    height: 135,
    width: 135,
  },
};

const muiStyles = theme => ({
  imageIconRoot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  dialog: {
    width: '95%',
    height: '95%',
    maxWidth: '100%',
    position: 'relative',
  },
  nativeDialog: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 0,
  },
  dialogRoot: {
    // NOTE: Make background color similar to lightbox
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  fileName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: 400,
  },
  downloadIcon: {
    color: theme.palette.primary.text3,
  },
});

/* eslint-disable react/prop-types */
const ImageAttachment = props => {
  const downloadLink = useSignedURL(props.attachmentFileName) || props.attachmentUrl;
  return (
    <>
      <div onClick={props.openLightbox} className={styles.cAttachmentImg}>
        <img
          data-testid={`${PAGE_NAME}_image`}
          src={downloadLink}
          style={style.fileImage(props.imageIsLoaded, props.size)}
          alt="Attachment"
          onLoad={props.setImageIsLoaded}
        />
        <div data-testid={`${PAGE_NAME}_button`} className={styles.cAttachmentImgPreviwBtn}>
          <FullSizeIcon />
        </div>
      </div>

      {!props.imageIsLoaded && (
        <div style={style.imagePlaceholder}>
          <ImageIcon
            data-testid={`${PAGE_NAME}_placeholder`}
            className={props.classes.imageIconRoot}
            htmlColor={grey400}
            fontSize="large"
          />
        </div>
      )}

      {props.lightboxIsOpen && (
        <ImageViewer
          mainSrc={downloadLink}
          imagePadding={50}
          onAfterOpen={props.handleLightboxOpen}
          onCloseRequest={props.handleLightboxClose}
        />
      )}
    </>
  );
};

const FileAttachment = props => {
  const downloadLink = useSignedURL(props.attachmentFileName);
  return (
    <div className={styles.cAttachmentFileWrapper}>
      <div
        className={styles.cAttachmentFileDownloadWrapper}
        style={style.fileDownloadWrapper}
        onClick={props.openPreview}
      >
        <FileTypeIcon
          fileName={props.displayName || props.attachmentUrl}
          className={styles.cAttachmentFileDownloadWrapperFileIcon}
          size={props.small ? 25 : 50}
        />

        <div
          data-testid={`${PAGE_NAME}_name`}
          className={styles.cAttachmentFileDownloadWrapperFileName}
        >
          <Typography variant="subtitle2" noWrap className={props.classes.fileName}>
            {utils.getFileNameWithExtensionFromPath(props.displayName || props.attachmentUrl)}
          </Typography>
        </div>

        <Dialog
          open={props.previewIsOpen}
          onClose={props.closePreview}
          classes={{
            root: props.classes.dialogRoot,
            paper: isNativeDetected ? props.classes.nativeDialog : props.classes.dialog,
          }}
          onClick={props.closePreview}
        >
          <GoogleDocsViewer
            fileUrl={downloadLink}
            fileName={utils.getFileNameWithExtensionFromPath(
              props.displayName || props.attachmentUrl
            )}
            fileSize={props.attachmentSize}
            onClose={props.closePreview}
            width="100%"
            height="100%"
          />
        </Dialog>
      </div>

      <a
        download={props.displayName}
        href={downloadLink}
        className={styles.cAttachmentFileDownloadWrapperForm}
      >
        <IconButton
          data-testid={`${PAGE_NAME}_downloadButton`}
          className={props.classes.downloadIcon}
          type="submit"
        >
          <DownloadIcon className={props.classes.downloadIcon} />
        </IconButton>
      </a>
    </div>
  );
};

/* eslint-enable react/prop-types */

function Attachment(props) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileName = props.displayName || props.attachmentUrl || props.fileName;
  const isImage = getIsImage(fileName);
  const isVideo = getIsVideo(fileName);

  // Don't fetch download link if attachmentUrl is provided
  const downloadLink = useSignedURL(!props.attachmentUrl && props.fileName);
  const attachmentUrl = props.attachmentUrl || downloadLink;
  const preventIOSScroll = useCallback(e => e.preventDefault(), []);

  // NOTE: iOS WebView has a bug when background content of React Modal is scrollable
  // Source: https://github.com/reactjs/react-modal/issues/369
  const handleLightboxOpen = () => {
    if (isNativeDetected) {
      // document.documentElement.style.overflowY = 'hidden';
      document.documentElement.addEventListener('touchmove', preventIOSScroll, {
        passive: false,
      });
    }
  };

  const handleLightboxClose = () => {
    if (isNativeDetected) {
      // document.documentElement.style.overflowY = 'visible';
      document.documentElement.removeEventListener('touchmove', preventIOSScroll);
    }
    setIsLightboxOpen(false);
  };

  const openLightbox = () => setIsLightboxOpen(true);
  const setImageLoaded = () => setIsImageLoaded(true);
  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = e => {
    e.stopPropagation();
    setIsPreviewOpen(false);
  };

  if (isImage)
    return (
      <div className={styles.cAttachment}>
        <ImageAttachment
          size={props.size}
          openLightbox={openLightbox}
          attachmentFileName={props.fileName}
          attachmentUrl={props.attachmentUrl}
          setImageIsLoaded={setImageLoaded}
          imageIsLoaded={isImageLoaded}
          lightboxIsOpen={isLightboxOpen}
          handleLightboxOpen={handleLightboxOpen}
          handleLightboxClose={handleLightboxClose}
          classes={props.classes}
        />
      </div>
    );

  if (isVideo && ReactPlayer.canPlay(attachmentUrl))
    return (
      <div className={styles.cAttachment}>
        <ReactPlayer
          data-testid={`${PAGE_NAME}_player`}
          className={styles.cAttachmentReactPlayer}
          url={attachmentUrl}
          config={{ file: { attributes: { preload: 'metadata' } } }}
          controls
          height={props.size === SIZES.small.label ? SIZES.small.value : SIZES.medium.value}
          width={null}
        />
      </div>
    );

  return (
    <div className={styles.cAttachment}>
      <FileAttachment
        attachmentUrl={attachmentUrl}
        attachmentFileName={props.fileName}
        attachmentSize={props.attachmentSize}
        displayName={props.displayName}
        openPreview={openPreview}
        closePreview={closePreview}
        previewIsOpen={isPreviewOpen}
        classes={props.classes}
        small={props.small}
      />
    </div>
  );
}

Attachment.propTypes = {
  attachmentUrl: PropTypes.string.isRequired,
  attachmentSize: PropTypes.number,
  displayName: PropTypes.string,
  fileName: PropTypes.string,
  size: PropTypes.oneOf([SIZES.small.label, SIZES.medium.label]),
  classes: PropTypes.shape({}).isRequired,
  small: PropTypes.bool,
};

Attachment.defaultProps = {
  displayName: null,
  fileName: null,
  attachmentSize: undefined,
  size: SIZES.medium.label,
  small: false,
};

export default withStyles(muiStyles)(Attachment);
