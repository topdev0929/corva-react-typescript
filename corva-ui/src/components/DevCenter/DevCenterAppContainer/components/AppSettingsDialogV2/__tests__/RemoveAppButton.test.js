import RemoveAppButton, { PAGE_NAME } from '../RemoveAppButton';

import { render, fireEvent, waitFor } from '@testing-library/react';

const props = {
  appName: 'app-name',
  onAppRemove: jest.fn(),
};

describe('RemoveAppButton', () => {
  it('renders without errors', () => {
    const { container } = render(<RemoveAppButton {...props} />);
    expect(container).toBeInTheDocument();
  });

  it('opens confirmation modal on RemoveAppButton click', () => {
    const { queryByTestId, getByTestId, getByText } = render(<RemoveAppButton {...props} />);
    expect(queryByTestId(`${PAGE_NAME}_title`)).not.toBeInTheDocument();
    fireEvent.click(getByTestId(`${PAGE_NAME}_button`));
    expect(getByTestId(`${PAGE_NAME}_title`)).toBeInTheDocument();
    expect(getByText(`Remove ${props.appName}`)).toBeInTheDocument();
  });

  it('closes confirmation modal on Cancel button click', async () => {
    const { queryByTestId, getByTestId } = render(<RemoveAppButton {...props} />);
    fireEvent.click(getByTestId(`${PAGE_NAME}_button`));
    fireEvent.click(getByTestId(`${PAGE_NAME}_cancel`));
    await waitFor(() => expect(queryByTestId(`${PAGE_NAME}_title`)).not.toBeInTheDocument());
  });

  it('calls onAppRemove on Confirmbutton click', async () => {
    const { queryByTestId, getByTestId } = render(<RemoveAppButton {...props} />);
    fireEvent.click(getByTestId(`${PAGE_NAME}_button`));
    fireEvent.click(getByTestId(`${PAGE_NAME}_confirm`));
    await waitFor(() => expect(props.onAppRemove).toHaveBeenCalled());
  });
});
