import { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, Tooltip } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import { Fullscreen as FullSizeIcon, Image as ImageIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  imagePreviewWrapper: {
    borderRadius: '3px',
    overflow: 'hidden',
    textAlign: 'center',
    position: 'relative',
    '&:hover': {
      opacity: '0.7',
      '& #icon-preview': {
        visibility: 'visible',
      },
    },
    marginLeft: props => (props.size === 'large' ? '0px' : '34px'),
    width: props => (props.size === 'large' ? '100%' : '120px'),
  },
  previewImage: {
    verticalAlign: 'top',
    maxWidth: '100%',
  },
  icon: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    right: '5px',
    top: '5px',
    cursor: 'pointer',
    padding: '6px',
    visibility: 'hidden',
    borderRadius: '30px',
    backgroundColor: fade(theme.palette.primary.text9, 0.4),
  },
}));

const ImageAttachment = ({
  attachmentUrl,
  ImageViewerComponent,
  isOpenLightbox,
  setIsOpenLightbox,
}) => {
  const styles = useStyles();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      <div className={styles.imagePreviewWrapper}>
        <img
          className={styles.previewImage}
          src={attachmentUrl}
          alt="Attachment"
          onLoad={() => setIsImageLoaded(true)}
        />
        <Tooltip title="Preview" placement="bottom">
          <div id="icon-preview" className={styles.icon} onClick={() => setIsOpenLightbox(true)}>
            <FullSizeIcon />
          </div>
        </Tooltip>

        {!isImageLoaded && (
          <div>
            <ImageIcon fontSize="large" />
          </div>
        )}
      </div>

      {isOpenLightbox && ImageViewerComponent}
    </>
  );
};

ImageAttachment.propTypes = {
  isOpenLightbox: PropTypes.bool,
  setIsOpenLightbox: PropTypes.func.isRequired,
  attachmentUrl: PropTypes.string.isRequired,
  ImageViewerComponent: PropTypes.func.isRequired,
};

export default ImageAttachment;
