import { render, fireEvent, screen } from '@testing-library/react';
import AxisDropdown from '../AxisDropdown';

const dataTestId = 'axis-dropdown';

describe('AxisDropdown', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  it('should render the dropdown', () => {
    const { getByTestId } = render(
      <AxisDropdown
        value="option1"
        onChange={jest.fn()}
        options={options}
        data-testid={dataTestId}
      />
    );

    const dropdown = getByTestId(dataTestId);
    expect(dropdown).toBeInTheDocument();
  });

  it('should call onChange with the selected value when an option is selected', () => {
    const handleChange = jest.fn();
    const { getByTestId, getByText } = render(
      <AxisDropdown value="" onChange={handleChange} options={options} data-testid={dataTestId} />
    );

    const dropdown = getByTestId(dataTestId);
    fireEvent.mouseDown(dropdown.firstChild);

    const option = getByText('Option 1');
    expect(option).toBeInTheDocument();

    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalled();
  });

  it('should render the unit when the unit prop is provided', () => {
    const { getByText } = render(
      <AxisDropdown value="option1" onChange={jest.fn()} unit="kg" options={options} />
    );

    const unitElement = getByText('(kg)');
    expect(unitElement).toBeInTheDocument();
  });

  it('should not render the unit when the unit prop is not provided', () => {
    const { queryByText } = render(
      <AxisDropdown value="option1" onChange={jest.fn()} options={options} />
    );

    const unitElement = queryByText('(kg)');
    expect(unitElement).toBeNull();
  });
});
