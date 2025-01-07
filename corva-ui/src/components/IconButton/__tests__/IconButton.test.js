import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import IconButton from '../';

describe('IconButton', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<IconButton />);
    expect(getByTestId('IconButton')).toBeInTheDocument();
  });

  test('renders with tooltip', () => {
    const { getByTitle } = render(<IconButton tooltipProps={{ title: 'Test Tooltip' }} />);
    expect(getByTitle('Test Tooltip')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<IconButton onClick={onClick} />);
    fireEvent.click(getByTestId('IconButton'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('changes tooltip visibility on hover', () => {
    const { getByTestId } = render(<IconButton tooltipProps={{ title: 'Test Tooltip' }} />);
    const button = getByTestId('IconButton');
    fireEvent.mouseOver(button);
    expect(button).toHaveAttribute('aria-describedby');
    fireEvent.mouseOut(button);
    expect(button).not.toHaveAttribute('aria-describedby');
  });

  test('applies active class when isActive is true', () => {
    const { getByTestId } = render(<IconButton isActive />);
    const classList = Array.from(getByTestId('IconButton').classList).join();
    expect(classList).toContain('active');
  });
});
