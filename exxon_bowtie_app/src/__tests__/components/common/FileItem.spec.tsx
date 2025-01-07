import { render, fireEvent } from '@testing-library/react';

import { FileItem } from '@/components/common/FileItem';

describe('FileItem Component', () => {
  const mockItem = {
    name: 'Test File',
    datetime: '2024-03-13T10:30:00',
    id: 'testId',
    ref: 'txt',
  };

  it('renders without crashing', () => {
    render(<FileItem item={mockItem} />);
  });

  it('displays file name and date', () => {
    const { getByText } = render(<FileItem item={mockItem} />);
    expect(getByText('Test File')).toBeInTheDocument();
    expect(getByText('13/03/24, 10:30')).toBeInTheDocument();
  });

  it('renders correct icon based on file type', () => {
    const { getByAltText } = render(<FileItem item={{ ...mockItem, ref: '.pdf' }} />);
    expect(getByAltText('File icon')).toHaveAttribute('src', 'pdf.svg');
  });

  it('calls onClick handler when clicked', () => {
    const onClickMock = jest.fn();
    const { getByTestId } = render(
      <FileItem item={mockItem} onClick={onClickMock} testId="testId" />
    );
    fireEvent.click(getByTestId('testId'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
