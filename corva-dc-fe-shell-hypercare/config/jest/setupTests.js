/* eslint-disable */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// eslint-disable-next-line
import '@testing-library/jest-dom/extend-expect';

jest.mock('@icon-park/react/es/all', () => ({ type, ...props }) => (
  <span data-testid={`mock-icon-${type}`} {...props} />
));

// Set UTC timezone for tests to not use the environment timezone
process.env.TZ = 'UTC';
