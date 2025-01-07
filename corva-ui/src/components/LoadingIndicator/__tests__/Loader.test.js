import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Loader, { LOADER_HREF } from '../Loader';

let loader = null;

describe(`Component`, () => {
  describe(`LoadingIndicator`, () => {
    describe(`Loader`, () => {
      afterEach(() => {
        expect(loader).toHaveClass('cLoader');
        expect(loader).toHaveAttribute('alt', 'Corva Loader');
        expect(loader).toHaveAttribute('src', LOADER_HREF);
      });
      test('default parameters', async () => {
        const { getByTestId } = render(<Loader />);
        loader = getByTestId('loader_image');
        expect(loader).not.toHaveClass('cLoaderBlack');
        expect(loader).toHaveStyle('width: 80px; height: 80px;');
      });

      test('custom size and color', async () => {
        const { getByTestId } = render(<Loader white={false} size={42} />);
        loader = getByTestId('loader_image');
        expect(loader).toHaveClass('cLoaderBlack');
        expect(loader).toHaveStyle('width: 42px; height: 42px;');
      });
    });
  });
});
