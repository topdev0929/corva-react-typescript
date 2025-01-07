import React from 'react';
import { render } from '@testing-library/react';
import EmptyAppView from '../index';

describe('Snapshot', () => {
  describe('EmptyAppView', () => {
    it('default', () => {
      const tree = render(<EmptyAppView title="title" />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('style', () => {
      const tree = render(<EmptyAppView title="title" style={{ marginTop: 200 }} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('message', () => {
      const tree = render(<EmptyAppView title="title" message="message" />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('onRetry', () => {
      const tree = render(<EmptyAppView title="title" />).baseElement;
      expect(tree).toMatchSnapshot();
    });
  });
});
