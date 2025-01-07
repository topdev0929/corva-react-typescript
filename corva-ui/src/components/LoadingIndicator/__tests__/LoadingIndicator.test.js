import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingIndicator from '../LoadingIndicator';

jest.mock('../FullScreenLoadingIndicator', () => props => (
  <div data-testid="FullScreenLoadingIndicator" content={JSON.stringify(props)}>
    test
  </div>
));
jest.mock('../InlineLoadingIndicator', () => props => (
  <div data-testid="InlineLoadingIndicator" content={JSON.stringify(props)}>
    test
  </div>
));

describe(`Component`, () => {
  describe(`LoadingIndicator`, () => {
    describe(`LoadingIndicator`, () => {
      test('default parameters', async () => {
        const { getByTestId } = render(<LoadingIndicator />);
        expect(
          JSON.parse(getByTestId('FullScreenLoadingIndicator').getAttribute('content'))
        ).toEqual({ className: '', size: 80, white: true });
      });

      test('custom size and color', async () => {
        const { getByTestId } = render(
          <LoadingIndicator size={42} white={false} fullscreen={false} />
        );
        expect(JSON.parse(getByTestId('InlineLoadingIndicator').getAttribute('content'))).toEqual({
          className: '',
          size: 42,
          white: false,
        });
      });
    });
  });
});
