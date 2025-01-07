import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import Dropzone from 'react-dropzone';
import { Button, TextField, withStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DownloadIcon from '@material-ui/icons/GetApp';
import { IconButton, Modal, Step, FilesLoader } from '@corva/ui/components';

import { SUPPORTED_FILE_MIME_TYPES, TASK_STATE } from '~/constants';
import { useUploadingFile } from '~/effects/useUploadingFile';
import { useDownholeTask } from '~/effects/useDownholeTask';
import FileIcon from './FileIcon';
import styles from './styles.css';

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);

function DownholeSensorUploader({ open, provider, assetId, setSensorDataChangeToggle, onClose }) {
  const [file, setFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [sensorName, setSensorName] = useState('');
  const [taskState, setTaskState] = useState(TASK_STATE.none);

  const subscribeData = useDownholeTask(
    provider,
    assetId,
    taskState === TASK_STATE.fileUploaded,
    uploadedFilename,
    sensorName.trim()
  );

  useEffect(() => {
    if (subscribeData) {
      setFile(null);
      setTaskState(TASK_STATE.none);
      setSensorDataChangeToggle(prev => !prev);
    }
  }, [subscribeData]);

  const onFinish = result => {
    setUploadedFilename(result?.data?.file_name);
    setTaskState(TASK_STATE.fileUploaded);
  };

  const [filesUploadParams, filesUploadedSize] = useUploadingFile(
    taskState === TASK_STATE.fileUploading,
    file,
    onFinish
  );

  const handleSelectFile = file => {
    setFile(file);
    setTaskState(TASK_STATE.fileSelected);
    setSensorName('');
  };

  const handleNextClick = () => {
    setTaskState(TASK_STATE.fileUploading);
  };

  const handleUploadCancel = name => {
    filesUploadParams.forEach(item => item.name === name && item.abortRequest());
    setTaskState(TASK_STATE.fileSelected);
  };

  const handelRemoveFile = () => {
    setFile(null);
    setTaskState(TASK_STATE.none);
  };

  const handleSensorNameChange = e => {
    setSensorName(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Import Pressure Gradient"
      onClose={handleClose}
      contentClassName={styles.uploadDialogContent}
      actions={
        <>
          <StyledButton
            color="primary"
            className={styles.downloadButton}
            startIcon={<DownloadIcon />}
          >
            Download Template
          </StyledButton>
          <ClearAllButton color="primary" onClick={handleClose}>
            Cancel
          </ClearAllButton>
          <StyledButton
            variant="contained"
            color="primary"
            disabled={!(taskState === TASK_STATE.fileSelected && sensorName)}
            endIcon={<ArrowForwardIcon />}
            onClick={handleNextClick}
          >
            Next
          </StyledButton>
        </>
      }
    >
      <div>
        <div className={styles.stepperWrapper}>
          {[{ value: 1, label: 'Select File' }].map(step => (
            <Step
              key={step.value}
              value={step.value}
              active
              label={step.label}
              className={styles.stepper}
            />
          ))}
        </div>

        {taskState === TASK_STATE.none && (
          <Dropzone
            onDrop={files => handleSelectFile(files[0])}
            className={styles.dropzone}
            activeClassName={styles.activeDropzone}
            accept={SUPPORTED_FILE_MIME_TYPES.join(', ')}
          >
            <CloudUploadIcon className={styles.uploadIcon} />
            <div className={styles.selectFileWrapper}>
              <Button component="label" key="import" className={styles.selectFile}>
                Select File
              </Button>
              <div className={styles.dropLabel}>or drag and drop here</div>
            </div>
            <input
              className={styles.fileInput}
              type="file"
              accept={SUPPORTED_FILE_MIME_TYPES.join(', ')}
              onChange={e => handleSelectFile(e.target.files[0])}
            />
          </Dropzone>
        )}

        {file &&
          (taskState === TASK_STATE.fileSelected || taskState === TASK_STATE.fileUploaded) && (
            <>
              <div className={styles.fileList}>
                <div className={styles.fileNameWrapper}>
                  <FileIcon fileName={file.name} />
                  <span>{file.name}</span>
                </div>
                {taskState === TASK_STATE.fileSelected ? (
                  <IconButton
                    tooltipProps={{ title: 'Remove File' }}
                    className={styles.deleteButton}
                    onClick={handelRemoveFile}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <FileIcon waiting />
                )}
              </div>
              <TextField
                label="Input Sensor Name"
                value={sensorName}
                onChange={handleSensorNameChange}
                fullWidth
              />
            </>
          )}

        {taskState === TASK_STATE.fileUploading &&
          filesUploadParams.map(({ name, size, error }) => (
            <div className={styles.loaderItemRoot} key={name}>
              <FilesLoader
                loadedBytes={filesUploadedSize[name]}
                name={name}
                sizeBytes={size}
                handleCancel={handleUploadCancel}
                error={error}
              />
            </div>
          ))}

        {(taskState === TASK_STATE.failed ||
          taskState === TASK_STATE.fileUploadError ||
          taskState === TASK_STATE.fileUploaded) && (
          <div className={classnames(styles.fileList, styles.errorWrapper)}>
            <div className={styles.fileNameWrapper}>
              {taskState !== TASK_STATE.fileUploaded && <FileIcon error />}
              {taskState === TASK_STATE.failed && (
                <span className={styles.uploadError}>Task Error.</span>
              )}
              {taskState === TASK_STATE.fileUploadError && (
                <span className={styles.uploadError}>File Upload Error.</span>
              )}
              {taskState === TASK_STATE.fileUploaded && (
                <span className={styles.infoMessage}>It may take 2-30 min.</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

DownholeSensorUploader.propTypes = {
  open: PropTypes.bool.isRequired,
  provider: PropTypes.string.isRequired,
  assetId: PropTypes.number.isRequired,
  setSensorDataChangeToggle: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(DownholeSensorUploader);
