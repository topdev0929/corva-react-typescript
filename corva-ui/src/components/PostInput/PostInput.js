import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import classNames from 'classnames';
import { noop } from 'lodash';
import FilePreview from '~/components/FilePreview';
import FailedFileUploading from '~/components/FailedFileUploading';
import UserMention from '~/components/UserMention';
import FileUploadIconButton from '~/components/FileUploadIconButton';
import EmojiIconButton from '~/components/EmojiIconButton';

import styles from './PostInput.css';

const PAGE_NAME = 'PostInput';

const PostInput = ({
  className,
  userCompanyId,
  onChange,
  onKeyDown,
  initialValue,
  filePreviewWrapperClass,
  smallerView,
  suggestionsPortalHost,
  allowSuggestionsAboveCursor,
}) => {
  const [body, setBody] = useState(initialValue.body);
  const [attachment, setAttachment] = useState(initialValue.attachment);
  const [attachmentLoadingError, setAttachmentLoadingError] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.value.length;
    }
  }, []);
  useEffect(() => {
    onChange({
      body,
      attachment,
    });
  }, [body, attachment]);

  return (
    <div className={classNames(styles.input, className)}>
      <TextField
        data-testid={`${PAGE_NAME}_input`}
        className={classNames(styles.inputTextField, {
          [styles.inputTextFieldSmaller]: smallerView,
        })}
        placeholder="Add Comment..."
        FormHelperTextProps={{
          component: 'div',
          margin: 'dense',
        }}
        inputRef={inputRef}
        InputProps={{
          inputComponent: UserMention,
          inputProps: {
            onChange: setBody,
            value: body,
            withLightTheme: false,
            companyId: userCompanyId,
            autoFocus: true,
            className: styles.inputInput,
            placeholder: 'Type here...',
            suggestionsPortalHost,
            allowSuggestionsAboveCursor,
          },
          endAdornment: (
            <InputAdornment
              position="end"
              className={classNames(styles.inputAdornment, {
                [styles.inputAdornmentSmaller]: smallerView,
              })}
            >
              {!attachment && (
                <div>
                  <FileUploadIconButton
                    openPreviewDialogOnUpload={false}
                    onFinish={(url, name, size) => {
                      setAttachment({
                        url,
                        name,
                        size,
                      });
                    }}
                    onError={setAttachmentLoadingError}
                  />
                </div>
              )}
              <div>
                <EmojiIconButton
                  data-testid={`${PAGE_NAME}_emoji`}
                  handleSelectEmoji={emoji => setBody(prevText => `${prevText}${emoji.native}`)}
                />
              </div>
            </InputAdornment>
          ),
          disableUnderline: true,
          classes: {},
        }}
        onKeyDown={onKeyDown}
      />
      {attachment && (
        <FilePreview
          fileName={attachment.name}
          fileUrl={attachment.url}
          handleFileDelete={() => setAttachment(null)}
          classes={{ wrapper: filePreviewWrapperClass }}
        />
      )}
      {attachmentLoadingError && <FailedFileUploading errorMessage={attachmentLoadingError} />}
    </div>
  );
};

PostInput.propTypes = {
  userCompanyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  initialValue: PropTypes.shape({
    body: PropTypes.string,
    attachment: PropTypes.shape({}),
  }),
  filePreviewWrapperClass: PropTypes.string,
  suggestionsPortalHost: PropTypes.node,
  allowSuggestionsAboveCursor: PropTypes.bool,
  smallerView: PropTypes.bool,
};

PostInput.defaultProps = {
  className: null,
  initialValue: {
    body: '',
    attachment: null,
  },
  filePreviewWrapperClass: null,
  onKeyDown: noop,
  onChange: noop,
  smallerView: false,
  suggestionsPortalHost: undefined,
  allowSuggestionsAboveCursor: false,
};

export default PostInput;
