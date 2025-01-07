import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Draggable from 'react-draggable';

import { makeStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  resizableColumnHeader: {
    display: 'flex',
    paddingRight: 0,
    justifyContent: 'space-between',
  },
  tableResizer: {
    width: 6,
    borderRadius: 10,
    opacity: 0.7,
    cursor: 'col-resize',
    marginRight: -11,
    marginTop: -16,
    marginBottom: -16,
  },
  hovered: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const getOffsetWidth = cellName => document.getElementById(cellName)?.offsetWidth;

const TABLE_HEADER_CELL_PADDING = 12;

interface ResizableTableHeaderCellProps extends PropTypes.InferProps<typeof resizableTableHeaderCellPropTypes> {}

export default function ResizableTableHeaderCell({
  children,
  cellName,
  nextCellName,
  widths,
  handleWidthsUpdate,
}: ResizableTableHeaderCellProps): JSX.Element {
  const classes = useStyles();

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [currentCellMinWidth, setCurrentCellMinWidth] = useState<number>();
  const [nextCellMinWidth, setNextCellMinWidth] = useState<number>();

  useEffect(() => {
    setCurrentCellMinWidth(getOffsetWidth(`content-${cellName}`) + TABLE_HEADER_CELL_PADDING);
    setNextCellMinWidth(getOffsetWidth(`content-${nextCellName}`) + TABLE_HEADER_CELL_PADDING);
    handleWidthsUpdate({ [cellName]: getOffsetWidth(cellName) });
  }, []);

  if (!children) return null;

  const resize = deltaX => {
    const newWidth = widths[cellName] + deltaX;
    const newNextWidth = widths[nextCellName] - deltaX;
    if (newWidth < 0 || newWidth < currentCellMinWidth || newNextWidth < nextCellMinWidth) return;
    handleWidthsUpdate({ [cellName]: newWidth, [nextCellName]: newNextWidth });
  };

  return (
    <TableCell width={widths[cellName]} id={cellName} {...children.props}>
      <div className={classes.resizableColumnHeader}>
        <div id={`content-${cellName}`}>{children?.props?.children ?? null}</div>
        <Draggable
          axis="x"
          onDrag={(event, { deltaX }) => {
            resize(deltaX);
          }}
          //@ts-ignore
          position={{ x: 0 }}
          zIndex={999}
          onStart={() => {
            setIsHovered(true);
          }}
          onStop={() => {
            if (widths[cellName] !== getOffsetWidth(cellName)) {
              handleWidthsUpdate({ [cellName]: getOffsetWidth(cellName) });
            }
            setIsHovered(false);
          }}
        >
          <div
            className={classNames(classes.tableResizer, isHovered && classes.hovered)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Draggable>
      </div>
    </TableCell>
  );
}

const resizableTableHeaderCellPropTypes = {
  children: PropTypes.element.isRequired,
  cellName: PropTypes.string.isRequired,
  nextCellName: PropTypes.string.isRequired,
  widths: PropTypes.shape({}).isRequired,
  handleWidthsUpdate: PropTypes.func.isRequired,
};

ResizableTableHeaderCell.propTypes = resizableTableHeaderCellPropTypes;
