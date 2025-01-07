import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { components } from '@corva/ui';
import userEvent from '@testing-library/user-event';

describe('tests setup', () => {
  it('should use UTC timezone by default to not depend on the environment timezone', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe('UTC');
  });

  it('should use mock fetch implementation defined in setupTests.js', async () => {
    expect(
      await fetch('https://jsonplaceholder.typicode.com/posts/1').then(response => response.json())
    ).toBe('fetchJsonMock');
  });

  it('should use mock XMLHttpRequest implementation defined in setupTests.js', async () => {
    function getPosts() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
        xhr.onload = () => {
          if (xhr.status === 200) {
            const post = JSON.parse(xhr.responseText);
            resolve(post);
          } else {
            reject(new Error(`Request failed.  Returned status of ${xhr.status}`));
          }
        };
        xhr.send();
      });
    }

    expect(await getPosts()).toBe('mockResponseText');
  });

  describe('<Toggle /> with corva/ui button', () => {
    const Toggle = () => {
      const [isOn, setIsOn] = useState(false);

      return (
        <>
          {isOn ? 'ON' : 'OFF'}
          <components.Button onClick={() => setIsOn(value => !value)}>toggle</components.Button>
        </>
      );
    };

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
