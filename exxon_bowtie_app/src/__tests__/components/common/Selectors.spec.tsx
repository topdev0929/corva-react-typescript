import { render, fireEvent } from '@testing-library/react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import '@testing-library/jest-dom/extend-expect';
import { Selectors } from '@/components/common/Selectors';

describe('Selectors Component', () => {
  it('renders without crashing', () => {
    render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Selectors date={new Date()} setDate={jest.fn()} />
      </MuiPickersUtilsProvider>
    );
  });

  it('renders correctly', () => {
    const { getByLabelText, getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Selectors date={new Date()} setDate={jest.fn()} />
      </MuiPickersUtilsProvider>
    );

    const insightTypeSelect = getByLabelText('Insight Type');
    expect(insightTypeSelect).toBeInTheDocument();

    const dateTimePicker = getByTestId('datetimePicker');
    expect(dateTimePicker).toBeInTheDocument();
  });

  it('displays a DateTimePicker component', () => {
    const { getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Selectors date={new Date()} setDate={jest.fn()} />
      </MuiPickersUtilsProvider>
    );
    expect(getByTestId('datetimePicker')).toBeInTheDocument();
  });

  it('calls setDate function with the selected date when DateTimePicker value changes', () => {
    const setDateMock = jest.fn();
    const { getByTestId } = render(
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Selectors date={new Date()} setDate={setDateMock} />
      </MuiPickersUtilsProvider>
    );

    const dateTimePicker = getByTestId('datetimePicker');
    fireEvent.change(dateTimePicker, new Date('2024-03-13T12:00:00'));
  });
});
