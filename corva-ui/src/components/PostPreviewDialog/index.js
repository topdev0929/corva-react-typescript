import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import RootRef from '@material-ui/core/RootRef';
import grey from '@material-ui/core/colors/grey';

import DeleteIcon from '@material-ui/icons/Delete';
import { Dialog } from '@material-ui/core';

import FileTypeIcon from '~/components/FileTypeIcon';
import EmojiIconButton from '~/components/EmojiIconButton';
import FileUploadIconButton from '~/components/FileUploadIconButton';
import FailedFileUploading from '~/components/FailedFileUploading';
import UserMention from '~/components/UserMention';

import { isNativeDetected } from '~/utils/mobileDetect';

import styles from './styles.css';
import { getIsImage } from '../../utils/fileExtension';

const PAGE_NAME = 'PostPreviewDialog';

const grey200 = grey[200];
const grey400 = grey[400];

const muiStyles = theme => ({
  dialogContentRoot: { minWidth: 500 },
  textFieldRoot: { marginBottom: 20 },
  textInput: { paddingTop: 2 },
  messageWrapper: {
    padding: '18.5px 14px',
    border: `solid 1px ${theme.palette.primary.main}`,
    boxShadow: 'none',
  },
  dialogActions: {
    padding: '24px 24px',
    margin: 0,
  },
  deleteButton: {
    color: '#DADADA',
    cursor: 'pointer',
  },
  fileUploadingError: {
    marginTop: 10,
  },
});

/* eslint-disable react/prop-types */
const Message = props => (
  <Paper className={props.classes.messageWrapper}>
    <Input
      data-testid={`${PAGE_NAME}_messageInput`}
      inputRef={props.inputEl}
      inputComponent={UserMention}
      inputProps={{
        withLightTheme: false,
        onChange: props.handleMessageChange,
        companyId: props.companyId,
        suggestionsPortalHost: props.rootRef.current,
      }}
      placeholder="Add a message about the file..."
      fullWidth
      disableUnderline
      multiline
      rows="3"
      className={props.classes.textFieldRoot}
      value={props.comment}
      onKeyDown={props.handleKeyDown}
    />
    <div className={styles.cPostPreviewDialogMessageAdditionalFieldsWrapper}>
      <div>{props.additionalFields}</div>
      <div className={styles.cPostPreviewDialogMessageActionFields}>
        {!props.fileUrl && (
          <FileUploadIconButton
            htmlColor={grey[400]}
            openPreviewDialogOnUpload={false}
            disableRipple
            onFinish={props.handleFileUpload}
            onError={props.handleFileUploadingError}
            inputId="preview-dialog-file-upload"
          />
        )}
        <EmojiIconButton
          handleSelectEmoji={props.handleSelectEmoji}
          emojiIconClassName={props.classes.additionalActionButton}
          htmlColor={grey[400]}
          disableRipple
        />
      </div>
    </div>
  </Paper>
);

const File = props => {
  const isImage = getIsImage(props.fileName);

  return isImage ? (
    <div>
      <div className={styles.cPostPreviewDialogFileName}>
        <Typography data-testid={`${PAGE_NAME}_fileName`} variant="subtitle2" noWrap gutterBottom>
          {props.fileName}
        </Typography>
        <DeleteIcon
          data-testid={`${PAGE_NAME}_deleteButton`}
          color="action"
          onClick={props.handleFileDelete}
          className={props.classes.deleteButton}
        />
      </div>
      <div className={styles.cPostPreviewDialogFileImageFileWrapper}>
        <img
          data-testid={`${PAGE_NAME}_previewImage`}
          className={styles.cPostPreviewDialogFileImage}
          src={props.fileUrl}
          alt="Uploaded file"
        />
      </div>
    </div>
  ) : (
    <div
      className={styles.cPostPreviewDialogFileDownload}
      style={{
        backgroundColor: grey200,
        border: `1px solid ${grey400}`,
      }}
    >
      <FileTypeIcon fileName={props.fileName} />
      <div className={styles.cPostPreviewDialogFileDownloadText}>
        <Typography data-testid={`${PAGE_NAME}_fileName`} variant="subtitle2" noWrap>
          {props.fileName}
        </Typography>
        <DeleteIcon
          data-testid={`${PAGE_NAME}_deleteButton`}
          color="action"
          onClick={props.handleFileDelete}
          className={props.classes.deleteButton}
        />
      </div>
    </div>
  );
};
/* eslint-enable react/prop-types */

class FileUploadPreviewDialog extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      comment: props.message,
      fileUrl: props.fileUrl,
      fileSize: props.fileSize,
      fileName: props.fileName,
      fileUploadingError: null,
    };

    this.inputEl = createRef();
    this.rootRef = createRef();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open && !this.state.comment && this.props.message) {
      this.setState({ comment: this.props.message });
    }

    if (
      this.props.fileUrl !== prevProps.fileUrl ||
      this.props.fileSize !== prevProps.fileSize ||
      this.props.fileName !== prevProps.fileName
    ) {
      this.setState({
        fileUrl: this.props.fileUrl,
        fileSize: this.props.fileSize,
        fileName: this.props.fileName,
      });
    }
  }

  focusOnInput = () => this.inputEl.current.focus();

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.handleShare();
    }
  };

  handleMessageChange = comment => this.setState({ comment });

  handleSelectEmoji = emoji =>
    this.setState(({ comment }) => ({ comment: `${comment}${emoji.native}` }));

  handleShare = () => {
    this.props.handleShare(
      this.state.comment,
      this.state.fileUrl,
      this.state.fileSize,
      this.state.fileName
    );
  };

  handleFileDelete = () => {
    this.setState({ fileUrl: '', fileSize: null, fileName: '' });
  };

  handleFileUpload = (fileUrl, fileName, fileSize) => {
    this.setState({
      fileUrl,
      fileName,
      fileSize,
      fileUploadingError: null,
    });
  };

  handleFileUploadingError = fileUploadingError => {
    this.setState({
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileUploadingError,
    });
  };

  render() {
    return (
      <RootRef rootRef={this.rootRef}>
        <Dialog
          fullScreen={isNativeDetected}
          open={this.props.open}
          onClose={this.props.handleClose}
          onBackdropClick={this.props.handleClose}
          onEntered={this.focusOnInput}
        >
          <DialogTitle>{this.props.title}</DialogTitle>

          <DialogContent
            classes={{ root: !isNativeDetected && this.props.classes.dialogContentRoot }}
          >
            <Message
              inputEl={this.inputEl}
              comment={this.state.comment}
              handleMessageChange={this.handleMessageChange}
              handleKeyDown={this.handleKeyDown}
              handleFileUpload={this.handleFileUpload}
              handleSelectEmoji={this.handleSelectEmoji}
              handleFileUploadingError={this.handleFileUploadingError}
              additionalFields={this.props.additionalFields}
              fileUrl={this.state.fileUrl}
              classes={this.props.classes}
              companyId={this.props.companyId}
              rootRef={this.rootRef}
            />

            {this.state.fileUploadingError && (
              <FailedFileUploading
                errorMessage={this.state.fileUploadingError}
                className={this.props.classes.fileUploadingError}
              />
            )}

            {this.state.fileUrl && (
              <File
                fileName={this.state.fileName}
                fileUrl={this.state.fileUrl}
                handleFileDelete={this.handleFileDelete}
                handleFileUploadingError={this.handleFileUploadingError}
                classes={this.props.classes}
              />
            )}
          </DialogContent>

          <DialogActions className={this.props.classes.dialogActions}>
            <Button
              data-testid={`${PAGE_NAME}_cancelButton`}
              color="primary"
              onClick={this.props.handleClose}
            >
              {this.props.cancelButtonText}
            </Button>

            <Button
              data-testid={`${PAGE_NAME}_okButton`}
              color="primary"
              variant="contained"
              disabled={
                (!this.state.fileUrl && !this.state.comment) ||
                !this.props.requiredFields.every(Boolean)
              }
              onClick={this.handleShare}
            >
              {this.props.okButtonText}
            </Button>
          </DialogActions>
        </Dialog>
      </RootRef>
    );
  }
}

FileUploadPreviewDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  fileUrl: PropTypes.string,
  fileName: PropTypes.string,
  fileSize: PropTypes.number,
  handleShare: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,

  classes: PropTypes.shape({}).isRequired,

  additionalFields: PropTypes.arrayOf(PropTypes.node),
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string,
  companyId: PropTypes.number,

  okButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
};

FileUploadPreviewDialog.defaultProps = {
  title: 'Share a file',
  fileUrl: '',
  fileName: '',
  fileSize: null,
  additionalFields: [],
  requiredFields: [],
  message: '',
  companyId: null,

  okButtonText: 'Post',
  cancelButtonText: 'Cancel',
};

export default withStyles(muiStyles)(FileUploadPreviewDialog);
