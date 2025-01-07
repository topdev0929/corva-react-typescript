import { useState } from 'react';

enum KEY_CODE {
  ENTER = 'Enter',
  ESC = 'Escape',
}

export const useCommentInputHandlers = (
  defaultValue: string | undefined,
  onSend: (text: string) => void,
  onCancel?: () => void
) => {
  const [text, setText] = useState<string>(defaultValue || '');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSelectEmoji = emoji => setText(value => `${value}${emoji.native}`);

  const handleCancel = () => {
    setText('');
    if (onCancel) onCancel();
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      handleCancel();
    }
  };

  const handleKeyDown = event => {
    const { key } = event;
    if (key === KEY_CODE.ESC && onCancel) onCancel();
    if (key === KEY_CODE.ENTER) {
      event.preventDefault();
      handleSend();
    }
  };

  return {
    text,
    handleTextChange,
    handleSelectEmoji,
    handleCancel,
    handleSend,
    handleKeyDown,
  };
};
