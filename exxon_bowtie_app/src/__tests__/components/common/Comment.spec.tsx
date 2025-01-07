import { render, fireEvent, waitFor } from '@testing-library/react';

import { Comment } from '@/components/common/Comment';

describe('Comment', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Comment
        isFilesLoading={false}
        setIsFilesLoading={jest.fn()}
        files={[]}
        setFiles={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={1}
        comment=""
        setText={jest.fn()}
      />
    );
    const commentTextField = getByTestId('commentTextField');
    expect(commentTextField).toBeInTheDocument();
  });

  it('updates comment when text is entered', () => {
    const setTextMock = jest.fn();
    const { getByTestId } = render(
      <Comment
        isFilesLoading={false}
        setIsFilesLoading={jest.fn()}
        files={[]}
        setFiles={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={1}
        comment=""
        setText={setTextMock}
      />
    );

    const commentTextField = getByTestId('_commentTextField_textarea');
    fireEvent.change(commentTextField, { target: { value: 'New comment' } });
    expect(setTextMock).toHaveBeenCalledWith('New comment');
  });

  it('when file uploads', async () => {
    const mockFn = jest.fn();
    const { getByTestId } = render(
      <Comment
        isFilesLoading={false}
        setIsFilesLoading={mockFn}
        files={[]}
        setFiles={jest.fn()}
        currentUser={{ company_id: 1 }}
        assetId={1}
        comment=""
        setText={jest.fn()}
      />
    );

    const fileInput = getByTestId('attachFileBtn_input');
    const file = new File([''], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(mockFn).toHaveBeenCalled());
  });
});
