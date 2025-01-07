import { render, waitFor } from '@testing-library/react';

import { AsyncPhoto } from '@/components/common/AsyncPhoto';

const mockOnUpload = jest.fn(() => Promise.resolve('https://example.com/photo.jpg'));

describe('AsyncPhoto Component', () => {
  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('renders loading indicator while uploading', async () => {
    const { getByTestId } = render(<AsyncPhoto onUpload={mockOnUpload} testId="photo" />);
    await waitFor(() => expect(mockOnUpload).toHaveBeenCalledTimes(1));
    expect(getByTestId('photo')).toBeInTheDocument();
  });

  it('renders photo after uploading', async () => {
    const { getByAltText } = render(<AsyncPhoto onUpload={mockOnUpload} />);
    await waitFor(() => expect(mockOnUpload).toHaveBeenCalledTimes(1));
    expect(getByAltText('Attached photo')).toBeInTheDocument();
  });

  it('passes testId to the loading indicator', async () => {
    const testId = 'asyncPhotoTestId';
    const { getByTestId } = render(<AsyncPhoto onUpload={mockOnUpload} testId={testId} />);
    expect(getByTestId(`${testId}_loader`)).toBeInTheDocument();
    await waitFor(() => expect(mockOnUpload).toHaveBeenCalledTimes(1));
  });

  it('passes testId to the img element', async () => {
    const testId = 'asyncPhotoTestId';
    const { getByTestId } = render(<AsyncPhoto onUpload={mockOnUpload} testId={testId} />);
    await waitFor(() => expect(mockOnUpload).toHaveBeenCalledTimes(1));
    expect(getByTestId(testId)).toBeInTheDocument();
  });

  it('calls onUpload function once on mount', async () => {
    render(<AsyncPhoto onUpload={mockOnUpload} />);
    await waitFor(() => expect(mockOnUpload).toHaveBeenCalledTimes(1));
  });
});
