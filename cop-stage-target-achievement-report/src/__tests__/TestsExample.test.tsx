import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { components } from '@corva/ui';
import userEvent from '@testing-library/user-event';

const Toggle = () => {
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <>
      {isOn ? 'ON' : 'OFF'}
      <components.Button onClick={() => setIsOn(value => !value)}>toggle</components.Button>
    </>
  );
};

describe('Tests examples', () => {
  it('should use UTC timezone by default to not depend on the environment timezone', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('UTC');
  });

  describe('<Toggle />', () => {
    it('should be OFF by default', () => {
      render(<Toggle />);

      expect(screen.getByText('OFF')).toBeInTheDocument();
    });

    it('should switch to ON after a single press', async () => {
      render(<Toggle />);

      userEvent.click(screen.getByText('toggle'));

      await waitFor(() => screen.getByText('ON'));
    });
  });
});
