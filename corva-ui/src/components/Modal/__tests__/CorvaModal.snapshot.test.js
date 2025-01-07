import { render } from '@testing-library/react';
import { CorvaModal } from '../CorvaModal';

describe('Snapshot', () => {
  describe('Modal', () => {
    describe('open', () => {
      it('true', () => {
        const tree = render(<CorvaModal open={true} />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(<CorvaModal open={false} title="title" />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('title', () => {
      it('with title', () => {
        const tree = render(<CorvaModal open={true} title="title" />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('children', () => {
      it('as text', () => {
        const tree = render(<CorvaModal open={true} children="children" />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('as nodes', () => {
        const tree = render(<CorvaModal open={true} children={<div>children</div>} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('actions', () => {
      it('as text', () => {
        const tree = render(<CorvaModal open={true} actions="actions" />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('as nodes', () => {
        const tree = render(<CorvaModal open={true} actions={<div>actions</div>} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('isCloseIconHidden', () => {
      it('true', () => {
        const tree = render(<CorvaModal open={true} isCloseIconHidden={true} />).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(<CorvaModal open={true} isCloseIconHidden={false} />).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('isNative', () => {
      it('true', () => {
        const tree = render(
          <CorvaModal open={true} isNative={true} isCloseIconHidden={true} title="title" />
        ).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(
          <CorvaModal open={true} isNative={false} isCloseIconHidden={true} title="title" />
        ).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });

    describe('isMobile', () => {
      it('true', () => {
        const tree = render(
          <CorvaModal open={true} isMobile={true} isCloseIconHidden={true} title="title" />
        ).baseElement;
        expect(tree).toMatchSnapshot();
      });

      it('false', () => {
        const tree = render(
          <CorvaModal open={true} isMobile={false} isCloseIconHidden={true} title="title" />
        ).baseElement;
        expect(tree).toMatchSnapshot();
      });
    });
  });
});
