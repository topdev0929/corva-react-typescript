import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InlineLoadingIndicator from '../InlineLoadingIndicator';

jest.mock('../Loader', () => (props) => (<div
  data-testid='test'
  content={JSON.stringify(props)}
>
  test
</div>));
let componentContainer = null;

describe(`Component`, () => {
  describe(`LoadingIndicator`, () => {
    describe(`InlineLoadingIndicator`, () => {
      afterEach(() => {
        expect(componentContainer.firstChild).toHaveClass('appLoadingInline');
      });

      test('default parameters', async () => {
        const { getByTestId, container } = render(<InlineLoadingIndicator />);
        componentContainer = container;
        expect(JSON.parse(getByTestId('test').getAttribute('content')))
          .toEqual({ size: 80, white: true });
      });

      test('custom size and color', async () => {
        const { getByTestId, container } = render(<InlineLoadingIndicator size={42} white={false} />);
        componentContainer = container;
        expect(JSON.parse(getByTestId('test').getAttribute('content')))
          .toEqual({ size: 42, white: false });
      });
    });
  });
});
