import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Typography, withStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import grey from '@material-ui/core/colors/grey';
import utils from '~utils/main';

import { getIsImage } from '~/utils/fileExtension';

import FileTypeIcon from '~components/FileTypeIcon';
import IconButton from '~components/IconButton';

import styles from './styles.css';

const PAGE_NAME = 'filePreview';

const FilePreview = ({ fileName, fileUrl, handleFileDelete, classes }) => {
  const isImage = getIsImage(fileName);

  return (
    <div className={classNames(styles.cComponentFilePreview, classes.wrapper)}>
      {isImage ? (
        <div className={styles.cComponentFilePreviewImageFileWrapper}>
          <img
            data-testid={`${PAGE_NAME}_filePreview`}
            className={styles.cComponentFilePreviewImage}
            src={fileUrl}
            alt="Uploaded file"
          />
        </div>
      ) : (
        <div className={styles.cComponentFilePreviewWrapper}>
          <div
            className={styles.cComponentFilePreviewDownload}
            style={{
              border: `1px solid ${grey[400]}`,
            }}
          >
            <FileTypeIcon fileName={fileName} size={25} />
            <div className={styles.cComponentFilePreviewDownloadText}>
              <Typography data-testid={`${PAGE_NAME}_fileName`} variant="subtitle2" noWrap>
                {utils.getFileNameWithExtensionFromPath(fileName)}
              </Typography>
            </div>
          </div>
        </div>
      )}
      <IconButton
        title="Delete"
        onClick={handleFileDelete}
        className={classNames(styles.cComponentFilePreviewDeleteFile, {
          [styles.cComponentFilePreviewDeleteFileCentered]: !isImage,
        })}
        tooltipProps={{ title: 'Delete' }}
      >
        <DeleteIcon data-testid={`${PAGE_NAME}_deleteButton`} />
      </IconButton>
    </div>
  );
};

FilePreview.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileUrl: PropTypes.string.isRequired,
  handleFileDelete: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    deleteTooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles({
  deleteTooltip: {
    marginTop: '3px',
    backgroundColor: 'rgba(97, 97, 97, 0.4)',
  },
})(FilePreview);
