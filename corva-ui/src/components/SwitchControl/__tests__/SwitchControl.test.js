import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SwitchControlComponent from '../';

describe('SwitchControlComponent', () => {
  it('renders without crashing', () => {
    render(<SwitchControlComponent />);
  });

  it('renders the title prop', () => {
    const { getByText } = render(<SwitchControlComponent title="Test Title" />);
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the leftLabel prop', () => {
    const { getByText } = render(<SwitchControlComponent leftLabel="Left Label" />);
    expect(getByText('Left Label')).toBeInTheDocument();
  });

  it('renders the rightLabel prop', () => {
    const { getByText } = render(<SwitchControlComponent rightLabel="Right Label" />);
    expect(getByText('Right Label')).toBeInTheDocument();
  });

  it('renders the switch with the correct checked state', () => {
    const { getByTestId } = render(<SwitchControlComponent checked />);
    expect(getByTestId('SwitchControlComponent_switch_true')).toBeInTheDocument();
  });

  it('calls the onChange prop when the switch is clicked', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <SwitchControlComponent onChange={handleChange} checked={false} />
    );
    fireEvent.click(getByTestId('SwitchControlComponent_switch_false'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables the switch when the disabled prop is true', () => {
    const { getByTestId } = render(<SwitchControlComponent disabled={true} checked={false} />);
    expect(getByTestId('SwitchControlComponent_switch_false')).toHaveClass('Mui-disabled');
  });
});
