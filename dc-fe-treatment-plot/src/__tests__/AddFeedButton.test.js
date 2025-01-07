import { render } from '@testing-library/react';
import AddFeedButton from '@/components/FeedBar/components/AddFeedButton/AddFeedButton';

describe('AddFeedButton', () => {
  it('renders when isAddingInProgress is false', () => {
    render(<AddFeedButton isAddingInProgress={false} />);
  });

  it('renders when isAddingInProgress is true', () => {
    render(<AddFeedButton isAddingInProgress={true} />);
  });

  it('calls onAddFeedClick when add comment button is clicked and isAddingInProgress is false', () => {
    const mockOnAddFeedClick = jest.fn();
    render(<AddFeedButton isAddingInProgress={false} onAddFeedClick={mockOnAddFeedClick} />);
  });

  it('calls onCancelClick when cancel button is clicked and isAddingInProgress is true', () => {
    const mockOnCancelClick = jest.fn();
    render(<AddFeedButton isAddingInProgress={true} onCancelClick={mockOnCancelClick} />);
  });
});
