import { render, fireEvent } from '@testing-library/react';

import { FilePreview } from '@/components/common/FilePreview';

describe('FilePreview Component', () => {
  const mockChildren = <div data-testid="mock-children">Mock Children</div>;
  const mockOnDelete = jest.fn();

  it('renders without crashing', () => {
    render(<FilePreview onDelete={mockOnDelete}>{mockChildren}</FilePreview>);
  });

  it('renders children correctly', () => {
    const { getByTestId } = render(
      <FilePreview onDelete={mockOnDelete}>{mockChildren}</FilePreview>
    );
    expect(getByTestId('mock-children')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const { getByTestId } = render(
      <FilePreview onDelete={mockOnDelete} testId="testId">
        {mockChildren}
      </FilePreview>
    );
    fireEvent.click(getByTestId('testId_deleteBtn'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
