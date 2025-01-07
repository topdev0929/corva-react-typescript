import { render, fireEvent } from '@testing-library/react';
import OffsetWellButton from '../OffsetWellButton';

describe('OffsetWellButton', () => {
  const wells = [
    { id: 1, title: 'Well 1' },
    { id: 2, title: 'Well 2' },
  ];
  const onExpand = jest.fn();
  const onClick = jest.fn();
  const defaultProps = { wells, onExpand, onClick };

  it('should render the button with the correct text', () => {
    const { getByText } = render(<OffsetWellButton {...defaultProps} />);
    const button = getByText('Offset Wells (2)');
    expect(button).toBeInTheDocument();
  });

  it('should call the onClick handler when the button is clicked', () => {
    const { getByText } = render(<OffsetWellButton {...defaultProps} />);
    const button = getByText('Offset Wells (2)');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('should render the expand icon when there are wells and an onExpand handler is provided', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} />);
    const expandIcon = queryByTitle('Expand Offset Wells');
    expect(expandIcon).toBeInTheDocument();
  });

  it('should render the collapse icon when there are wells, an onExpand handler is provided, and the button is expanded', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} expanded />);
    const collapseIcon = queryByTitle('Collapse Offset Wells');
    expect(collapseIcon).toBeInTheDocument();
  });

  it('should call the onExpand handler when the expand/collapse button is clicked', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} />);
    const expandIcon = queryByTitle('Expand Offset Wells');
    fireEvent.click(expandIcon);
    expect(onExpand).toHaveBeenCalled();
  });

  it('should not render the expand icon when there are no wells', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} wells={[]} />);
    const expandIcon = queryByTitle('Expand Offset Wells');
    expect(expandIcon).not.toBeInTheDocument();
  });

  it('should not render the expand icon when an onExpand handler is not provided', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} onExpand={undefined} />);
    const expandIcon = queryByTitle('Expand Offset Wells');
    expect(expandIcon).not.toBeInTheDocument();
  });

  it('should render the info icon when offsetWellsLimited is true', () => {
    const { queryByTitle } = render(<OffsetWellButton {...defaultProps} offsetWellsLimited />);
    const infoIcon = queryByTitle(
      "Offset wells list wasn't populated completely due to technical limitations of the app."
    );
    expect(infoIcon).toBeInTheDocument();
  });

  it('should not render the info icon when offsetWellsLimited is false', () => {
    const { queryByTitle } = render(
      <OffsetWellButton {...defaultProps} offsetWellsLimited={false} />
    );
    const infoIcon = queryByTitle(
      "Offset wells list wasn't populated completely due to technical limitations of the app."
    );
    expect(infoIcon).not.toBeInTheDocument();
  });
});
