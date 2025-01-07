import PropTypes from 'prop-types';

import { SaveAlt as DownloadIcon } from '@material-ui/icons';
import { makeStyles, Typography } from '@material-ui/core';

import utils from '@corva/ui/utils/main';
import { IconButton as IconButtonComponent } from '@corva/ui/components';
import { DocumentViewer } from '@corva/ui/components';

import FileTypeIcon from './FileTypeIcon';
import { forceFileDownload } from '@/components/FeedBar/utils/forceFileDownload';

const useStyles = makeStyles(theme => ({
  fileDownloadContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: props => (props.size === 'large' ? '0px' : '34px'),
  },
  fileDownloadWrapper: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10px 10px 10px 5px',
    border: `1px solid ${theme.palette.primary.text6}`,
    borderRadius: 3,
    maxWidth: 500, // NOTE: Corresponds to react-player max width
    width: '75%',
    '&:hover': {
      backgroundColor: theme.palette.background.b7,
    },
  },
  fileName: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: 'calc(100% - 60px)',
    marginLeft: '8px',
  },
}));

const FileAttachment = ({
  isOfficeFile,
  fileName,
  attachmentUrl,
  attachmentSize,
  isOpenPreview,
  setIsOpenPreview,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.fileDownloadContainer}>
      <div className={styles.fileDownloadWrapper} onClick={() => setIsOpenPreview(true)}>
        <FileTypeIcon fileName={attachmentUrl} size={25} />

        <div className={styles.fileName}>
          <Typography variant="subtitle2" noWrap>
            {utils.getFileNameWithExtensionFromPath(attachmentUrl)}
          </Typography>
        </div>
      </div>

      <IconButtonComponent
        tooltipProps={{ title: 'Download' }}
        onClick={() => forceFileDownload(fileName, attachmentUrl)}
      >
        <DownloadIcon />
      </IconButtonComponent>

      <DocumentViewer
        open={isOpenPreview}
        onClose={() => setIsOpenPreview(false)}
        fileUrl={attachmentUrl}
        fileName={utils.getFileNameWithExtensionFromPath(attachmentUrl)}
        fileSize={attachmentSize}
        webviewType={isOfficeFile ? 'office' : 'google'}
      />
    </div>
  );
};

FileAttachment.propTypes = {
  isOfficeFile: PropTypes.bool,
  fileName: PropTypes.string.isRequired,
  attachmentUrl: PropTypes.string.isRequired,
  attachmentSize: PropTypes.number.isRequired,
  isOpenPreview: PropTypes.bool,
  setIsOpenPreview: PropTypes.func.isRequired,
};

export default FileAttachment;
