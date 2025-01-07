import PropTypes from 'prop-types';

interface ResizableTableCellProps {
  children: JSX.Element
}

export default function ResizableTableCell({ children }: ResizableTableCellProps): JSX.Element {
  if (!children) return null;

  return (
    <children.type {...children.props}>
      <div>{children?.props?.children ?? null}</div>
    </children.type>
  );
}

ResizableTableCell.propTypes = {
  children: PropTypes.element.isRequired,
};
