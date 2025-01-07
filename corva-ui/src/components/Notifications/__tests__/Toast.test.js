import { render } from '@testing-library/react';

import { NOTIFICATION_VARIANTS } from '~/constants/notifications';

import { Toast } from '../Toast';

const withProps = (extraToastProps = {}) => ({
  toast: {
    content: 'Toast content',
    id: 42,
    ...extraToastProps,
  },
  onDismissClick: () => {},
});

describe('Toast', () => {
  describe('snapshots', () => {
    it('matches default snapshot', () => {
      const container = render(<Toast {...withProps()} />).baseElement;
      expect(container).toMatchSnapshot();
    });

    const testVariant = variant =>
      it(`matches ${variant} snapshot`, () => {
        const container = render(<Toast {...withProps({ variant })} />).baseElement;
        expect(container).toMatchSnapshot();
      });

    Object.values(NOTIFICATION_VARIANTS).forEach(testVariant);
  });
});
