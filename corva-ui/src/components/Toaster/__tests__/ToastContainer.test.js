import { render, waitFor, act } from '@testing-library/react';

import { ToastContainer, DEVCENTER_TOASTS_SYMBOL } from '../ToastContainer';

const MESSAGE = 'Toaster message';

describe('ToastContainer', () => {
  it('renders withour errors', async () => {
    const { container } = render(<ToastContainer />);
    expect(container).toBeInTheDocument();
  });

  it('should set devcenterToasts methods to window', () => {
    render(<ToastContainer />);
    const { createToast, removeToast, showToast } = window[DEVCENTER_TOASTS_SYMBOL];

    expect(typeof createToast).toBe('function');
    expect(typeof removeToast).toBe('function');
    expect(typeof showToast).toBe('function');
  });

  it('renders toast message created with createToast method', () => {
    const { getByText } = render(<ToastContainer />);
    const { createToast } = window[DEVCENTER_TOASTS_SYMBOL];
    act(() => {
      createToast(MESSAGE);
    });
    expect(getByText(MESSAGE)).toBeInTheDocument();
  });

  it('does not render message after the timeout', async () => {
    const { queryByText } = render(<ToastContainer />);
    const { createToast } = window[DEVCENTER_TOASTS_SYMBOL];
    act(() => {
      createToast(MESSAGE, 0);
    });
    expect(queryByText(MESSAGE)).toBeInTheDocument();
    await waitFor(() => expect(queryByText(MESSAGE)).not.toBeInTheDocument());
  });
});
