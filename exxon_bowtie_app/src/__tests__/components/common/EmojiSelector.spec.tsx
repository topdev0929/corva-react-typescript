import { render, fireEvent } from '@testing-library/react';

import { EmojiISelector } from '@/components/common/EmojiSelector';

describe('EmojiISelector', () => {
  it('should render without errors', () => {
    const handleSelectEmoji = jest.fn();
    const { getByTestId } = render(<EmojiISelector handleSelectEmoji={handleSelectEmoji} />);
    const emojiButton = getByTestId('emojiSelector');
    expect(emojiButton).toBeInTheDocument();
  });

  it('should open emoji picker when button is clicked', () => {
    const handleSelectEmoji = jest.fn();
    const { getByTestId } = render(<EmojiISelector handleSelectEmoji={handleSelectEmoji} />);
    const emojiButton = getByTestId('emojiSelector');
    fireEvent.click(emojiButton);
    const emojiPicker = getByTestId('emojiPicker');
    expect(emojiPicker).toBeInTheDocument();
  });
});
