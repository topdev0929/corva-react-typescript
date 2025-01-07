import { FC, useState } from 'react';
import { Avatar } from '@corva/ui/components';
import { InputAdornment, TextField } from '@material-ui/core';

import { EmojiISelector } from '../EmojiSelector';
import { CommentInputActions } from './Actions';
import { useCommentInputStyles } from './styles';
import styles from './index.module.css';
import { useCommentInputHandlers } from '@/shared/components/CommentInput/useHandlers';

type Props = {
  onSend: (text: string) => void;
  user?: {
    profilePhoto: string;
    firstName: string;
    lastName: string;
  };
  defaultValue?: string;
  autoFocus?: boolean;
  testId?: string;
  onCancel?: () => void;
};

export const CommentInput: FC<Props> = ({
  onSend,
  user,
  onCancel,
  defaultValue,
  autoFocus,
  testId,
}) => {
  const classes = useCommentInputStyles();
  const [isFocused, setFocused] = useState<boolean>(false);

  const { text, handleSelectEmoji, handleSend, handleKeyDown, handleCancel, handleTextChange } =
    useCommentInputHandlers(defaultValue, onSend, onCancel);

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Avatar
        displayName={user ? `${user.firstName} ${user.lastName}` : ''}
        imgSrc={user?.profilePhoto}
        size={32}
      />
      <div className={styles.form}>
        <TextField
          data-testid={`${testId}_commentTextField`}
          InputProps={{
            inputProps: {
              'data-testid': `${testId}_commentTextField_input`,
            },
            classes: { root: classes.input },
            endAdornment: (
              <InputAdornment position="end">
                <EmojiISelector
                  testId={`${testId}_emojiSelector`}
                  handleSelectEmoji={handleSelectEmoji}
                  disableRipple
                  closeOnSelect
                />
              </InputAdornment>
            ),
          }}
          variant="filled"
          fullWidth
          value={text}
          onChange={handleTextChange}
          placeholder="Type here..."
          focused={isFocused}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <CommentInputActions isOpen={isFocused} onSend={handleSend} onCancel={handleCancel} />
      </div>
    </div>
  );
};
