import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IconMenu from '../index';

describe('Snapshot', () => {
  describe('IconMenu', () => {
    it('default props', () => {
      const tree = render(<IconMenu />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('classes', () => {
      const tree = render(<IconMenu classes={{ iconButton: 'iconButton', paper: 'paper' }} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('className', () => {
      const tree = render(<IconMenu className='className' />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('color', () => {
      const tree = render(<IconMenu color='inherit' />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('IconElement', () => {
      const tree = render(<IconMenu IconElement={<div>IconElement</div>} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('IconButtonComponent', () => {
      const tree = render(<IconMenu IconButtonComponent={() => (<div>IconButtonComponent</div>)} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('iconButtonStyle', () => {
      const tree = render(<IconMenu iconButtonStyle={{ float: 'right', marginBottom: 2 }} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('data-testid', () => {
      const tree = render(<IconMenu data-testid='data-testid' />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    it('marginThreshold', () => {
      const tree = render(<IconMenu marginThreshold={42} />).baseElement;
      expect(tree).toMatchSnapshot();
    });

    describe('children', () => {
      it('string', () => {
        const tree = render(<IconMenu>{'string'}</IconMenu>).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('node', () => {
        const tree = render(<IconMenu>
          <div>node</div>
        </IconMenu>).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('disableRipple', () => {
      it('true', () => {
        const tree = render(<IconMenu disableRipple={true} />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(<IconMenu disableRipple={false} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('handle actions', () => {
      it('handleOpen', () => {
        const { getByTestId, baseElement } = render(<IconMenu data-testid='test1' />);
        userEvent.click(getByTestId('test1'));
        expect(baseElement).toMatchSnapshot();
      });

      it('handleClose by click', () => {
        const { getByRole, baseElement, getByTestId } = render(<IconMenu data-testid='test1' />);
        userEvent.click(getByTestId('test1'));
        userEvent.click(getByRole('menu'));
        expect(baseElement).toMatchSnapshot();
      });
    });
  });
});

