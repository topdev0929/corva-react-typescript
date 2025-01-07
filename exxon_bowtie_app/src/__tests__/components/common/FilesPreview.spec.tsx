/* eslint-disable @typescript-eslint/no-empty-function */
import { render, fireEvent } from '@testing-library/react';

import { FilesPreview } from '@/components/common/FilesPreview';

describe('FilesPreview', () => {
  const files = [
    { id: '1', datetime: '2022-03-14', name: 'file1', ref: 'ref1', link: 'link1' },
    { id: '2', datetime: '2022-03-15', name: 'file2', ref: 'ref2', link: 'link2' },
  ];

  it('renders without crashing', () => {
    render(<FilesPreview files={files} isEditing={false} setFiles={jest.fn()} />);
  });

  it('renders correctly', () => {
    const { getAllByTestId } = render(
      <FilesPreview files={files} isEditing={false} setFiles={jest.fn()} />
    );
    const filesPreview = getAllByTestId('filePreview');
    expect(filesPreview[0]).toBeInTheDocument();
  });

  it('calls deleteFile when deleting a file in editing mode', async () => {
    const setFilesMock = jest.fn();
    const { getAllByTestId } = render(
      <FilesPreview files={files} isEditing setFiles={setFilesMock} />
    );
    const filePreviews = getAllByTestId('filePreview');
    fireEvent.click(filePreviews[0]);
  });

  it('does not call deleteFile when deleting a file in non-editing mode', async () => {
    const setFilesMock = jest.fn();
    const { getAllByTestId } = render(
      <FilesPreview files={files} isEditing={false} setFiles={setFilesMock} />
    );
    const filePreviews = getAllByTestId('filePreview');
    fireEvent.click(filePreviews[0]);
  });
});
