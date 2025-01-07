import { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { useThrottledValue } from '@/effects/useThrottledValue';

const TestComponent = ({ delay }: { delay: number }) => {
  const [inputValue, setInputValue] = useState('');
  const throttledInputValue = useThrottledValue(inputValue, delay);

  return (
    <div>
      <input
        data-testId="mock-input"
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <p data-testId="mock-value">Throttled Value: {throttledInputValue}</p>
    </div>
  );
};

jest.useFakeTimers();

describe('useThrottledValue', () => {
  it('updates the throttled value after the delay', async () => {
    render(<TestComponent delay={500} />);

    const input = screen.getByTestId('mock-input');
    fireEvent.change(input, { target: { value: 'Hello' } });
    jest.advanceTimersByTime(499);

    expect(screen.getByTestId('mock-value')).toHaveTextContent('Throttled Value:');

    jest.advanceTimersByTime(1);

    expect(screen.getByText('Throttled Value: Hello')).toBeInTheDocument();
  });

  it('updates the throttled value only once if multiple changes occur within the delay', async () => {
    render(<TestComponent delay={500} />);

    const input = screen.getByTestId('mock-input');

    fireEvent.change(input, { target: { value: 'First change' } });
    fireEvent.change(input, { target: { value: 'Second change' } });
    fireEvent.change(input, { target: { value: 'Third change' } });

    jest.advanceTimersByTime(500);

    expect(screen.getByText('Throttled Value: Third change')).toBeInTheDocument();
  });
});
