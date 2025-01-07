import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { noop } from 'lodash';

import ErrorBoundary from '../ErrorBoundary';
import Rollbar from 'rollbar';
import { Provider } from '@rollbar/react';

jest.mock('../DevCenterAppErrorView', () => () => <div data-testid="test2">div</div>);

describe(`Component`, () => {
  describe(`ErrorBoundary`, () => {
    describe(`ErrorBoundary`, () => {
      jest.spyOn(console, 'error').mockImplementation(noop);
      test('renders children if no internal error', () => {
        const { getByTestId } = render(
          <ErrorBoundary>
            <div data-testid="test1">div</div>
          </ErrorBoundary>
        );
        expect(getByTestId('test1')).toBeTruthy();
      });

      test(`renders default error view if 'children' threw`, () => {
        const { getByTestId } = render(
          <ErrorBoundary>
            <ThrowingComponent>ThrowingComponent</ThrowingComponent>
          </ErrorBoundary>
        );
        expect(getByTestId('test2')).toBeTruthy();
      });

      test(`renders custom error view if passed and 'children' threw`, () => {
        const { getByTestId } = render(
          <ErrorBoundary>
            <CustomErrorView>CustomErrorView</CustomErrorView>
          </ErrorBoundary>
        );
        expect(getByTestId('test3')).toBeTruthy();
      });

      test(`reports to 'Rollbar' instance if there is one in the context`, () => {
        const rollbarInstance = new Rollbar({
          enabled: false,
          accessToken: 'test',
        });
        rollbarInstance.error = jest.fn();

        render(
          <Provider instance={rollbarInstance}>
            <ErrorBoundary>
              <ThrowingComponent>ThrowingComponent</ThrowingComponent>
            </ErrorBoundary>
          </Provider>
        );
        expect(rollbarInstance.error).toBeCalledWith(Error('ThrowingComponent'));
      });
    });
  });
});

function ThrowingComponent() {
  throw Error('ThrowingComponent');
}

function CustomErrorView() {
  return <div data-testid="test3">CustomErrorView</div>;
}
