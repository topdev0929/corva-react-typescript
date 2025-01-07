import { useState } from 'react';
import moment from 'moment';
import { string, bool, shape, func, number } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Input,
  Tooltip,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import grey from '@material-ui/core/colors/grey';

import UserMention from '~components/UserMention';
import EmojiIconButton from '~components/EmojiIconButton';
import FileUploadIconButton from '~components/FileUploadIconButton';
import FailedFileUploading from '~components/FailedFileUploading';
import FilePreview from '~components/FilePreview';

import { isSuggestionsListOpened } from '~components/UserMention/utils';

import useEscPress from '~/effects/useEscPress';

import { ANNOTATION_ACTIVE_PERIODS } from '../../../../constants';

import StyledSelect from './StyledSelect';
import styles from './style.css';

const PAGE_NAME = 'AppAnnotationsPo';

const ANNOTATION_ACTIVE_PERIODS_KEYS = Object.keys(ANNOTATION_ACTIVE_PERIODS);
const ANNOTATION_PLACEHOLDER = 'Type annotation here';

const muiStyles = theme => ({
  inputLabel: {
    color: theme.palette.grey[700],
    fontWeight: 200,
    width: '100%',
  },
  inputRoot: {
    lineHeight: 15,
  },
  sendLabel: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 200,
    color: theme.palette.grey[700],
    marginRight: 22,
    fontSize: 10,
  },
  sendButton: {
    padding: 5,
  },
  labelHighlighter: {
    fontWeight: 200,
    fontSize: 10,
  },
  selectLabel: {
    fontSize: 10,
    lineHeight: '14px',
    color: theme.palette.grey[500],
  },
  uploadingError: {
    paddingTop: '10px',
  },
});

const getAnnotationActiveUntil = (value, initialPeriod) => {
  if (value === 'forever') return null;

  const period = ANNOTATION_ACTIVE_PERIODS[value];
  return moment(initialPeriod).add(period.time.amount, period.time.key).format();
};

const AnnotationInput = ({
  initialText,
  initialPeriod,
  onSend,
  onClose,
  closeOnEsc,
  classes,
  initialAttachment,
  assetCompanyId,
  currentUser,
}) => {
  const [annotationText, setAnnotationText] = useState(initialText);
  const [attachment, setAttachment] = useState(() =>
    initialAttachment
      ? {
          attachmentName: initialAttachment.file_name,
          attachmentUrl: initialAttachment.signed_url || initialAttachment.s3_link,
        }
      : null
  );
  const [uploadError, setUploadError] = useState(null);
  const [isShiftKeyDown, setIsShiftKeyDown] = useState(false);
  const [period, setPeriod] = useState(ANNOTATION_ACTIVE_PERIODS_KEYS[0]);

  useEscPress(() => {
    if (closeOnEsc) onClose();
  });

  const handleSend = () => {
    if (annotationText) {
      const formattedPeriod = getAnnotationActiveUntil(period, initialPeriod);
      onSend(annotationText, formattedPeriod, attachment);
    }
  };

  const handlePeriodChange = e => setPeriod(e.target.value);

  const handleKeyDown = e => {
    if (e.key === 'Shift') setIsShiftKeyDown(true);

    if (e.key === 'Enter' && !isShiftKeyDown && !isSuggestionsListOpened()) {
      e.preventDefault(); // NOTE: Don't add linebreak to the post
      handleSend();
    }
  };

  const handleKeyUp = e => {
    if (e.key === 'Shift') setIsShiftKeyDown(false);
  };

  const handleSelectEmoji = emoji => setAnnotationText(`${annotationText}${emoji.native}`);

  const handleAnnotationTextChange = text => setAnnotationText(text);

  const onFileUploaded = (attachmentUrl, attachmentName, attachmentSize) => {
    setAttachment({ attachmentUrl, attachmentName, attachmentSize });
    setUploadError(null);
  };

  const onUploadingError = error => {
    setAttachment(null);
    setUploadError(error);
  };

  const onAttachmentDelete = () => {
    setAttachment(null);
    setUploadError(null);
  };

  return (
    <div className={styles.cAnnotationInput}>
      <Paper className={styles.cAnnotationInputContent}>
        <Input
          data-testid={`${PAGE_NAME}_annotationsInput`}
          inputComponent={UserMention}
          inputProps={{
            withLightTheme: false,
            onChange: handleAnnotationTextChange,
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            companyId: assetCompanyId,
            currentUser,
          }}
          placeholder={ANNOTATION_PLACEHOLDER}
          fullWidth
          disableUnderline
          multiline
          rows="3"
          className={classes.inputRoot}
          value={annotationText}
        />
        <div className={styles.cAnnotationInputContentActions}>
          <Tooltip title="Attach File" placement="bottom">
            <div className={styles.cAnnotationInputContentActionsButton}>
              <FileUploadIconButton
                data-testid={`${PAGE_NAME}_attachFileButton`}
                openPreviewDialogOnUpload={false}
                disableRipple
                onFinish={onFileUploaded}
                onError={onUploadingError}
                htmlColor="action"
              />
            </div>
          </Tooltip>
          <Tooltip title="Add Emoji" placement="bottom">
            <div className={styles.cAnnotationInputContentActionsButton}>
              <EmojiIconButton
                data-testid={`${PAGE_NAME}_emojiButton`}
                htmlColor={grey[400]}
                handleSelectEmoji={handleSelectEmoji}
              />
            </div>
          </Tooltip>
        </div>
      </Paper>
      {uploadError && (
        <FailedFileUploading className={classes.uploadingError} errorMessage={uploadError} />
      )}
      {attachment && attachment.attachmentUrl && (
        <FilePreview
          fileName={attachment.attachmentName}
          fileUrl={attachment.attachmentUrl}
          handleFileDelete={onAttachmentDelete}
        />
      )}
      <div className={styles.cAnnotationInputActions}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id="periods-label-label" className={classes.selectLabel}>
            Active
          </InputLabel>
          <StyledSelect
            data-testid={`${PAGE_NAME}_periodDropdown`}
            labelId="periods-label-label"
            id="periods-label"
            value={period}
            disableUnderline
            onChange={handlePeriodChange}
          >
            {ANNOTATION_ACTIVE_PERIODS_KEYS.map(key => (
              <MenuItem
                data-testid={`${PAGE_NAME}_period_${ANNOTATION_ACTIVE_PERIODS[key].label}MenuItem`}
                key={key}
                value={key}
              >
                {ANNOTATION_ACTIVE_PERIODS[key].label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <div className={styles.cAnnotationInputActionsSend}>
          <Typography variant="caption" className={classes.sendLabel}>
            Press&nbsp;
            <Typography
              variant="caption"
              color="primary"
              component="span"
              className={classes.labelHighlighter}
            >
              Enter&nbsp;
            </Typography>
            to send&nbsp;
          </Typography>
          <Tooltip title="Send" placement="bottom">
            <div>
              {/* div to display label since button is disabled */}
              <IconButton
                data-testid={`${PAGE_NAME}_sendButton`}
                className={classes.sendButton}
                onClick={handleSend}
                disabled={!annotationText}
              >
                <SendIcon color="primary" />
              </IconButton>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

AnnotationInput.propTypes = {
  initialText: string,
  initialPeriod: string,
  initialAttachment: shape({
    file_name: string,
    s3_link: string,
  }),
  onSend: func,
  onClose: func,
  closeOnEsc: bool,
  assetCompanyId: number.isRequired,
  currentUser: shape().isRequired,

  classes: shape().isRequired,
};

AnnotationInput.defaultProps = {
  initialText: '',
  initialPeriod: undefined,
  initialAttachment: null,
  onSend: () => undefined,
  onClose: () => undefined,
  closeOnEsc: false,
};

export default withStyles(muiStyles)(AnnotationInput);
