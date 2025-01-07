import { render, fireEvent } from '@testing-library/react';

import { Chip } from '@/components/common/Chip';
import { Status } from '@/types/global.type';

describe('Chip component', () => {
  test('renders label correctly', () => {
    const label = 'Test Label';
    const { getByText } = render(<Chip label={label} />);
    expect(getByText(label)).toBeInTheDocument();
  });

  test('renders default icon correctly', () => {
    const label = 'Test Label';
    const { getByTestId } = render(<Chip label={label} />);
    const defaultIcon = getByTestId('default-icon');
    expect(defaultIcon).toBeInTheDocument();
  });

  test('renders status icon correctly', () => {
    const label = 'Test Label';
    const status = Status.Critical;
    const { getByTestId } = render(<Chip isStatusChip label={label} status={status} />);
    const statusIcon = getByTestId('status-icon');
    expect(statusIcon).toBeInTheDocument();
  });

  test('calls onClick callback when clicked', () => {
    const label = 'Test Label';
    const onClick = jest.fn();
    const { getByText } = render(<Chip label={label} onClick={onClick} />);
    fireEvent.click(getByText(label));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
