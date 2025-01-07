import { render, waitFor } from '@testing-library/react';

import { Toaster } from '../Toaster';

const onDismissMock = jest.fn();
const MESSAGE = 'Toaster message';

describe('Toaster', () => {
  describe('snapshots', () => {
    it('matches default snapshot', () => {
      const container = render(<Toaster message={MESSAGE} />).baseElement;
      expect(container).toMatchSnapshot();
    });
  });

  it('renders message', async () => {
    const { getByText } = render(<Toaster message={MESSAGE} onDismiss={onDismissMock} />);
    expect(getByText(MESSAGE)).toBeInTheDocument();
  });

  it('calls onDismiss', async () => {
    render(<Toaster message={MESSAGE} onDismiss={onDismissMock} />);

    await waitFor(() => expect(onDismissMock).toHaveBeenCalledTimes(1));
  });
});
