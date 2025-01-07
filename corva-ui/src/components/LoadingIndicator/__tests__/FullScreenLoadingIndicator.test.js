import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FullScreenLoadingIndicator from '../FullScreenLoadingIndicator';

jest.mock('../Loader', () => (props) => (<div
  data-testid='test'
  content={JSON.stringify(props)}
>
  test
</div>));
let componentContainer = null;

describe(`Component`, () => {
  describe(`LoadingIndicator`, () => {
    describe(`FullScreenLoadingIndicator`, () => {
      afterEach(() => {
        expect(componentContainer.firstChild).toHaveClass('appLoading');
        expect(componentContainer.firstChild.firstChild).toHaveClass('appLoadingGrid');
        expect(componentContainer.firstChild.firstChild.firstChild).toHaveClass('appLoadingInner');
      });

      test('default parameters', async () => {
        const { getByTestId, container } = render(<FullScreenLoadingIndicator />);
        componentContainer = container;
        expect(JSON.parse(getByTestId('test').getAttribute('content')))
          .toEqual({ size: 80, white: true });
      });

      test('custom size and color', async () => {
        const { getByTestId, container } = render(<FullScreenLoadingIndicator size={42} white={false} />);
        componentContainer = container;
        expect(JSON.parse(getByTestId('test').getAttribute('content')))
          .toEqual({ size: 42, white: false });
      });
    });
  });
});
