import { FC, useRef, useState } from 'react';
import { Picker } from 'emoji-mart';
import Popover from '@material-ui/core/Popover';
import { IconButton } from '@corva/ui/components';
import { SmilingFaceIcon } from '@corva/ui/icons';

type Props = {
  handleSelectEmoji: (emoji: any) => void;
  closeOnSelect?: boolean;
  disableRipple?: boolean;
};

export const EmojiISelector: FC<Props> = ({ handleSelectEmoji, closeOnSelect, disableRipple }) => {
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [isOpenEmojiPicker, setOpenEmojiPicker] = useState(false);

  const openEmojiPicker = () => setOpenEmojiPicker(true);

  const closeEmojiPicker = () => setOpenEmojiPicker(false);

  const onSelect = emoji => {
    handleSelectEmoji(emoji);
    if (closeOnSelect) {
      closeEmojiPicker();
    }
  };

  return (
    <>
      <IconButton
        data-testid="emojiSelector"
        buttonRef={anchorEl}
        aria-label="Emoji"
        size="small"
        onClick={openEmojiPicker}
        disableRipple={disableRipple}
        tooltipProps={{ title: 'Add Emoji' }}
      >
        <SmilingFaceIcon />
      </IconButton>
      <Popover
        data-testid="emojiPicker"
        open={isOpenEmojiPicker}
        anchorEl={anchorEl.current}
        onClose={closeEmojiPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Picker onSelect={onSelect} theme="dark" />
      </Popover>
    </>
  );
};
