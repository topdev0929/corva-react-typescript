import { render, screen, fireEvent } from '@testing-library/react';
import { AppSettingsPopover } from '../AppSettingsPopover';

jest.mock('~/utils/mobileDetect', () => ({ isMobileDetected: true }));

describe('AppSettingsPopover', () => {
  it('renders default trigger button', () => {
    render(<AppSettingsPopover />);

    const triggerButton = screen.getByRole('button');
    expect(triggerButton).toBeInTheDocument();
  });

  it('opens the popover when trigger button is clicked', () => {
    render(<AppSettingsPopover />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    const popoverHeader = screen.getByText('Settings');
    expect(popoverHeader).toBeInTheDocument();
  });

  it('renders custom header text', () => {
    render(<AppSettingsPopover header="Custom header text" />);

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);

    const popoverHeader = screen.getByText('Custom header text');
    expect(popoverHeader).toBeInTheDocument();
  });

  it('should call the `onClose` function when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <AppSettingsPopover
        onClose={handleClose}
        modalActions={
          <div>
            <button onClick={handleClose}>close settings</button>
          </div>
        }
      />
    );

    const triggerButton = screen.getByRole('button');
    fireEvent.click(triggerButton);
    fireEvent.click(screen.getByText('close settings'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
