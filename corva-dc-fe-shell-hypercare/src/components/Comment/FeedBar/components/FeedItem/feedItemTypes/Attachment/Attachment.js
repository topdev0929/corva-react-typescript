/* eslint-disable import/no-extraneous-dependencies */
/* Core */
import { useState } from 'react';
import PropTypes from 'prop-types';
import fileExtension from 'file-extension';
import imageExtensions from 'image-extensions';
import videoExtensions from 'video-extensions';
import ReactPlayer from 'react-player';

import { makeStyles } from '@material-ui/core';

/* Instruments */
import utils from '@corva/ui/utils/main';

/* Components */
import RecommendationBar from './RecommendationBar';
import ImageAttachment from './ImageAttachment';
import ImageViewer from './ImageViewer';
import FileAttachment from './FileAttachment';

const OFFICE_FILE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

/* Styles */
const useStyles = makeStyles({
  container: {
    borderRadius: '5px',
    marginTop: '10px',
    marginBottom: '10px',
  },
});

const Attachment = props => {
  const { attachmentUrl, fileName, attachmentSize, isRecommendationBar } = props;

  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const fileExt = fileExtension(attachmentUrl.split('?')[0]);
  const isImage = imageExtensions.includes(fileExt);
  const isVideo = videoExtensions.includes(fileExt);

  const isOfficeFile = OFFICE_FILE_EXTENSIONS.includes(fileExt); // NOTE: Office web viewer

  const styles = useStyles(props);

  const handleLightboxOpen = () => {
    document.documentElement.addEventListener('touchmove', e => e.preventDefault(), {
      passive: false,
    });
  };

  const handleLightboxClose = () => {
    document.documentElement.removeEventListener('touchmove', e => e.preventDefault());
    setIsOpenLightbox(false);
  };

  if (isRecommendationBar)
    return (
      <RecommendationBar
        isImage={isImage}
        isVideo={isVideo}
        isOfficeFile={isOfficeFile}
        isOpenLightbox={isOpenLightbox}
        isOpenPreview={isOpenPreview}
        attachmentUrl={attachmentUrl}
        setIsOpenLightbox={setIsOpenLightbox}
        setIsOpenPreview={setIsOpenPreview}
        attachmentSize={attachmentSize}
        ImageViewerComponent={
          <ImageViewer
            mainSrc={attachmentUrl}
            fileName={utils.getFileNameWithExtensionFromPath(attachmentUrl)}
            imagePadding={50}
            onAfterOpen={handleLightboxOpen}
            onCloseRequest={handleLightboxClose}
          />
        }
      />
    );

  return (
    <div className={styles.container}>
      {isImage && (
        <ImageAttachment
          attachmentUrl={attachmentUrl}
          isOpenLightbox={isOpenLightbox}
          setIsOpenLightbox={setIsOpenLightbox}
          ImageViewerComponent={
            <ImageViewer
              mainSrc={attachmentUrl}
              fileName={utils.getFileNameWithExtensionFromPath(attachmentUrl)}
              imagePadding={50}
              onAfterOpen={handleLightboxOpen}
              onCloseRequest={handleLightboxClose}
            />
          }
        />
      )}
      {isVideo && (
        <ReactPlayer
          url={attachmentUrl}
          config={{ file: { attributes: { preload: 'metadata' } } }}
          controls
          width={null}
        />
      )}
      {!isImage && !isVideo && (
        <FileAttachment
          isOfficeFile={isOfficeFile}
          fileName={fileName}
          attachmentUrl={attachmentUrl}
          attachmentSize={attachmentSize}
          isOpenPreview={isOpenPreview}
          setIsOpenPreview={setIsOpenPreview}
        />
      )}
    </div>
  );
};

Attachment.propTypes = {
  attachmentUrl: PropTypes.string.isRequired,
  attachmentSize: PropTypes.number,
  fileName: PropTypes.string,
  isRecommendationBar: PropTypes.bool,
};

Attachment.defaultProps = {
  fileName: null,
  attachmentSize: undefined,
  isRecommendationBar: false,
};

export default Attachment;
