import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import S3Upload from 'react-s3-uploader/s3upload';

import CircularProgress from '@material-ui/core/CircularProgress';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import PostPreviewDialog from '~components/PostPreviewDialog';
import AttachIcon from '~components/Icons/AttachIcon';
import IconButton from '~components/IconButton';

import { getS3SignedUrl, getS3DownloadLink } from '~/clients/jsonApi';
import { isNativeDetected } from '~/utils/mobileDetect';

const PAGE_NAME = 'fileUpload';
class FileUploadIconButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentUpload: null,

      s3FileUrl: null,
      s3FileName: null,
      s3FileSize: null,

      uploadingFileToS3: false,

      openFileUploadPreviewDialog: false,
    };

    this.fileInput = createRef();
  }

  onFinish = async () => {
    const s3DownloadLinkResponse = await getS3DownloadLink(this.state.s3FileName);
    this.setState(
      {
        currentUpload: null,
        uploadingFileToS3: false,
        openFileUploadPreviewDialog: this.props.openPreviewDialogOnUpload,
        s3FileUrl: s3DownloadLinkResponse.url,
      },
      () => {
        if (this.props.onFinish)
          this.props.onFinish(this.state.s3FileUrl, this.state.s3FileName, this.state.s3FileSize);
      }
    );
  };

  onError = fileUploadingError => {
    if (this.props.onError) this.props.onError(fileUploadingError);
    console.error(fileUploadingError);
  };

  getSignedUrl = async (file, callback) => {
    let data;
    try {
      data = await getS3SignedUrl(file.name, file.type);
    } catch (e) {
      this.setState(
        {
          uploadingFileToS3: null,
          currentUpload: null,
        },
        () => {
          this.onError(e.message);
        }
      );
      return;
    }

    this.setState({
      s3FileUrl: data.signed_url,
      s3FileName: data.file_name,
      s3FileSize: file.size,
    });

    // NOTE: Add node for 'signedUrl' which is the expected name by uploader component
    callback({
      ...data,
      signedUrl: data.signed_url,
    });
  };

  preprocess = (file, next) => {
    next(file);
  };

  uploadFile = event => {
    if (!event.target.files[0]) {
      return;
    }

    this.clearUpload();
    const uploader = new S3Upload({
      fileElement: this.fileInput.current,
      getSignedUrl: this.getSignedUrl,
      preprocess: this.preprocess,
      onProgress: () => {}, // NOTE: Prevents logging to console
      onFinishS3Put: this.onFinish,
      onError: this.onError,
    });

    this.setState({
      uploadingFileToS3: true,
      currentUpload: {
        uploader,
      },
    });
  };

  clearUpload() {
    const { currentUpload } = this.state;
    if (currentUpload && currentUpload.uploader) {
      currentUpload.uploader.abortUpload();
    }
  }

  handleCloseFileUploadPreviewDialog = () => {
    this.setState({ openFileUploadPreviewDialog: false });
  };

  handleShare = (comment, fileName, fileSize) => {
    this.setState({ openFileUploadPreviewDialog: false }, () => {
      if (this.props.handleShare) {
        this.props.handleShare(comment, fileName, fileSize);
      }
    });
  };

  renderUploadButton() {
    const Icon = isNativeDetected ? PhotoCameraIcon : AttachIcon;

    return (
      <label htmlFor={this.props.inputId}>
        <input
          ref={this.fileInput}
          id={this.props.inputId}
          type="file"
          disabled={this.props.disabled}
          onChange={this.uploadFile}
          style={{ display: 'none' }}
        />
        <IconButton
          data-testid={`${PAGE_NAME}_attachFileButton`}
          aria-label="File Upload"
          disabled={this.props.disabled}
          component={this.props.disabled ? 'button' : 'span'}
          className={this.props.fileUploadIconClassName}
          disableRipple={this.props.disableRipple}
          tooltipProps={this.props.tooltipProps}
        >
          <Icon />
        </IconButton>
      </label>
    );
  }

  render() {
    return (
      <>
        {this.state.uploadingFileToS3 ? (
          <CircularProgress data-testid="generic_uploadProgress" size={18} />
        ) : (
          this.renderUploadButton()
        )}

        {this.state.openFileUploadPreviewDialog && (
          <PostPreviewDialog
            open={this.state.openFileUploadPreviewDialog}
            fileUrl={this.state.s3FileUrl}
            fileName={this.state.s3FileName}
            fileSize={this.state.s3FileSize}
            handleShare={this.handleShare}
            handleClose={this.handleCloseFileUploadPreviewDialog}
            additionalFields={this.props.additionalFields}
            requiredFields={this.props.requiredFields}
            message={this.props.message}
          />
        )}
      </>
    );
  }
}

FileUploadIconButton.propTypes = {
  additionalFields: PropTypes.arrayOf(PropTypes.node),
  classes: PropTypes.shape({}).isRequired,
  tooltipProps: PropTypes.shape({}),
  disableRipple: PropTypes.bool,
  disabled: PropTypes.bool,
  fileUploadIconClassName: PropTypes.string,
  handleShare: PropTypes.func,
  inputId: PropTypes.string,
  message: PropTypes.string,
  onError: PropTypes.func,
  onFinish: PropTypes.func,
  openPreviewDialogOnUpload: PropTypes.bool,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
};

FileUploadIconButton.defaultProps = {
  additionalFields: [],
  disableRipple: false,
  disabled: false,
  fileUploadIconClassName: undefined,
  handleShare: undefined,
  inputId: 'icon-button-file',
  message: undefined,
  onError: undefined,
  onFinish: undefined,
  openPreviewDialogOnUpload: true,
  requiredFields: [],
  tooltipProps: { title: 'Attach File' },
};

export default FileUploadIconButton;
