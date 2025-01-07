import { render, fireEvent, waitFor } from '@testing-library/react';

import { DeleteDialog } from '@/components/common/DeleteDialog';

describe('EmojiISelector', () => {
  it('should render without errors', () => {
    render(<DeleteDialog open onCancel={jest.fn()} type="" onDelete={jest.fn()} />);
  });

  it('when click cancel button', async () => {
    const mockOnCancel = jest.fn();
    const { getByTestId } = render(
      <DeleteDialog open onCancel={mockOnCancel} type="" onDelete={jest.fn()} />
    );
    const cancelBtn = getByTestId('deleteDialog_deleteCancelBtn');
    fireEvent.click(cancelBtn);
    await waitFor(() => expect(mockOnCancel).toHaveBeenCalled());
  });

  it('when click delete button', async () => {
    const mockOnDelete = jest.fn();
    const { getByTestId } = render(
      <DeleteDialog open onCancel={jest.fn()} type="" onDelete={mockOnDelete} />
    );
    const deleteBtn = getByTestId('deleteDialog_deleteBtn');
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(mockOnDelete).toHaveBeenCalled());
  });
});
