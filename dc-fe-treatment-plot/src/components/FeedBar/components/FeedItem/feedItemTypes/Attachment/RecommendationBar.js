import PropTypes from 'prop-types';

import ReactPlayer from 'react-player';

import { makeStyles } from '@material-ui/core';

import { IconButton, DocumentViewer } from '@corva/ui/components';
import utils from '@corva/ui/utils/main';

import FileTypeIcon from './FileTypeIcon';

const useStyles = makeStyles(theme => ({
  attachmentSection: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '6px',
  },
  attachmentLabel: {
    color: theme.palette.primary.text6,
    fontSize: '12px',
    lineHeight: '12.89px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
}));

const RecommendationBar = ({
  isImage,
  isVideo,
  isOfficeFile,
  isOpenLightbox,
  isOpenPreview,
  attachmentUrl,
  setIsOpenLightbox,
  setIsOpenPreview,
  attachmentSize,
  ImageViewerComponent,
}) => {
  const styles = useStyles();

  const displayAttachmentModal = () => {
    if (isImage) setIsOpenLightbox(true);
    if (!isImage && !isVideo) setIsOpenPreview(true);
  };

  return (
    <div className={styles.attachmentSection}>
      <IconButton
        onClick={displayAttachmentModal}
        size="large"
        color="default"
        tooltipProps={{ title: 'Open' }}
      >
        <FileTypeIcon fileName={attachmentUrl} size={25} />
      </IconButton>
      <span onClick={displayAttachmentModal} className={styles.attachmentLabel}>
        Attachment
      </span>
      {isOpenLightbox && { ImageViewerComponent }}
      <DocumentViewer
        open={isOpenPreview}
        onClose={() => setIsOpenPreview(false)}
        fileUrl={attachmentUrl}
        fileName={utils.getFileNameWithExtensionFromPath(attachmentUrl)}
        attachmentSize={attachmentSize}
        webviewType={isOfficeFile ? 'office' : 'google'}
      />
      {isVideo && (
        <ReactPlayer
          url={attachmentUrl}
          config={{ file: { attributes: { preload: 'metadata' } } }}
          controls
          width={null}
        />
      )}
    </div>
  );
};

RecommendationBar.propTypes = {
  isImage: PropTypes.bool,
  isVideo: PropTypes.bool,
  isOfficeFile: PropTypes.bool,
  isOpenLightbox: PropTypes.bool,
  isOpenPreview: PropTypes.bool,
  attachmentUrl: PropTypes.string.isRequired,
  setIsOpenLightbox: PropTypes.func.isRequired,
  setIsOpenPreview: PropTypes.func.isRequired,
  attachmentSize: PropTypes.number.isRequired,
  ImageViewerComponent: PropTypes.func.isRequired,
};

export default RecommendationBar;
