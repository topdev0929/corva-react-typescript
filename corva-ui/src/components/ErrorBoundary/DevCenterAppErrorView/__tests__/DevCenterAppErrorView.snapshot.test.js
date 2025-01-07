import React from 'react';
import { render } from '@testing-library/react';
import DevCenterAppErrorView from '../DevCenterAppErrorView';

jest.mock('lodash', () => ({
  get: jest
    .fn()
    .mockImplementationOnce(() => 'appProviderUrl')
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => undefined),
}));
jest.mock('../../../DevCenter/AppHeader', () => app => (
  <div content={JSON.stringify(app)}>app</div>
));

describe('Snapshot', () => {
  describe('DevCenterAppErrorView', () => {
    beforeEach(jest.restoreAllMocks);
    describe('appProviderUrl', () => {
      it('true', () => {
        const tree = render(<DevCenterAppErrorView app={{}} />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(<DevCenterAppErrorView app={{}} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('withAppHeader', () => {
      it('true', () => {
        const tree = render(<DevCenterAppErrorView app={{}} withAppHeader={true} />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(<DevCenterAppErrorView app={{}} withAppHeader={false} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });
  });
});
