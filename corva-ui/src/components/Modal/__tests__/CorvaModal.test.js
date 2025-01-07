import { render, fireEvent } from '@testing-library/react';
import { CorvaModal } from '../CorvaModal';
import { MOBILE_MODAL_TYPES } from '../types';

describe('CorvaModal', () => {
  it('calls onClose when close icon is clicked', () => {
    const onClose = jest.fn();
    const { queryByTitle } = render(
      <CorvaModal open type={MOBILE_MODAL_TYPES.SETTINGS} onClose={onClose} />
    );

    fireEvent.click(queryByTitle('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close icon when isCloseIconHidden is true', () => {
    const { queryByTitle } = render(<CorvaModal open isCloseIconHidden />);
    expect(queryByTitle('Close')).toBeNull();
  });

  it('renders title based on type prop when title prop is not provided', () => {
    const { getByText } = render(<CorvaModal open type={MOBILE_MODAL_TYPES.SETTINGS} />);
    expect(getByText('Settings')).toBeInTheDocument();
  });

  it('renders title based on title prop when provided', () => {
    const { getByText } = render(<CorvaModal open title="Custom title" />);
    expect(getByText('Custom title')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const { getByText } = render(
      <CorvaModal open>
        <div>Custom content</div>
      </CorvaModal>
    );

    expect(getByText('Custom content')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const { getByText } = render(
      <CorvaModal open actions={<button>OK</button>}>
        <div>Custom content</div>
      </CorvaModal>
    );

    expect(getByText('OK')).toBeInTheDocument();
    expect(getByText('Custom content')).toBeInTheDocument();
  });
});
