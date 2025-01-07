import { render, fireEvent } from '@testing-library/react';
import MultipleAssetsToggle from '../MultipleAssetsToggle';

describe('MultipleAssetsToggle', () => {
  it('displays the provided title', () => {
    const title = 'Test Title';
    const { getByText } = render(<MultipleAssetsToggle title={title} />);

    expect(getByText(title)).toBeInTheDocument();
  });

  it('displays default title when not provided', () => {
    const defaultTitle = 'Multiple Assets';
    const { getByText } = render(<MultipleAssetsToggle />);

    expect(getByText(defaultTitle)).toBeInTheDocument();
  });

  it('calls the onChange prop when the switch is clicked', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <MultipleAssetsToggle onChange={handleChange} checked={false} />
    );
    fireEvent.click(getByTestId('SwitchControlComponent_switch_false'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables the switch when the disabled prop is true', () => {
    const { getByTestId } = render(<MultipleAssetsToggle disabled={true} checked={false} />);
    expect(getByTestId('SwitchControlComponent_switch_false')).toHaveClass('Mui-disabled');
  });
});
