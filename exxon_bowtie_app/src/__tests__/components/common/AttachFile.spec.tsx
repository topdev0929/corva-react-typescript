import { render, fireEvent, waitFor } from '@testing-library/react';

import { AttachFile } from '@/components/common/AttachFile';

describe('AttachFile Component', () => {
  it('renders without crashing', () => {
    render(<AttachFile onUpload={jest.fn()} />);
  });

  it('displays CircularProgress when isLoading is true', () => {
    const { getByTestId } = render(<AttachFile isLoading onUpload={jest.fn()} testId="testId" />);
    expect(getByTestId('testId_loader')).toBeInTheDocument();
  });

  it('renders IconButton when isLoading is false', () => {
    const { getByTestId } = render(
      <AttachFile isLoading={false} onUpload={jest.fn()} testId="testId" />
    );
    expect(getByTestId('testId')).toBeInTheDocument();
  });

  it('calls onUpload when files are selected', async () => {
    const onUploadMock = jest.fn();
    const { getByTestId } = render(<AttachFile onUpload={onUploadMock} testId="testId" />);
    const fileInput = getByTestId('testId_input');
    const file = new File([''], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(onUploadMock).toHaveBeenCalledWith([file]));
  });
});
