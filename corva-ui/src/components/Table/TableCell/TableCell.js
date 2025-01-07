import { useState } from 'react';
import { TableCell as MUITableCell, makeStyles } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import classNames from 'classnames';
import IconButton from '~/components/IconButton';
import Tooltip from '~/components/Tooltip';

const useStyles = makeStyles(theme => ({
  stickyCell: {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    background: theme.palette.background.b6,
  },
  stickyEmptyCell: {
    position: 'sticky',
    right: 0,
    zIndex: 2,
  },
  collapseHeader: {
    width: ({ isExpanded, maxCellWidth, cellWidth }) => isExpanded ? maxCellWidth : cellWidth,
  },
  tableCellWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ({ isExpanded, maxCellWidth, cellWidth }) => isExpanded ? maxCellWidth : cellWidth,
  },
  iconButton: {
    padding: 0,
    fontSize: 16,
    '&:hover': {
      backgroundColor: 'transparent',
    }
  }
}));

export const TableCell = ({
  isExpanded,
  setIsExpanded,
  tooltipTitle,
  collapsibleHeader,
  collapsibleBody,
  maxCellWidth,
  maxCharsNumberFromStart,
  maxCharsNumberFromEnd,
  cellWidth,
  children,
  ...props
}) => {
  const isStickyCell = props.stickyCell && !props.emptyCell;
  const classes = useStyles({ isExpanded, cellWidth, maxCellWidth });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const getTruncatedText = (text) => {
    return text.length > (maxCharsNumberFromStart + maxCharsNumberFromEnd) ?
      `${text.substring(0, maxCharsNumberFromStart)} ... ${text.substring(text.length - maxCharsNumberFromEnd)}`
      : text;
  };

  const handleArrowIconClick = () => {
    setIsTooltipOpen(false);
    setIsExpanded(!isExpanded);
  }

  return (
    <MUITableCell
      {...props}
      className={classNames(
        collapsibleHeader && classes.collapseHeader,
        isStickyCell && classes.stickyCell,
        props.emptyCell && classes.stickyEmptyCell,
        isStickyCell && 'stickyCell',
        props.emptyCell && 'stickyEmptyCell',
        props.className
      )}
    >
      {collapsibleHeader && (
        <div className={classes.tableCellWrapper}>
          {children}
          <IconButton
            className={classes.iconButton}
            onClick={handleArrowIconClick}
            tooltipProps={{
              title: isExpanded ? 'Collapse': 'Expand',
              open: isTooltipOpen,
              disableHoverListener: true,
              onMouseEnter: () => setIsTooltipOpen(true),
              onMouseLeave: () => setIsTooltipOpen(false),
            }}
          >
            {isExpanded ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
          </IconButton>
        </div>
      )}
      {collapsibleBody && (
        <Tooltip title={isExpanded ? '' : tooltipTitle}>
          <div>
            {isExpanded ? children : getTruncatedText(tooltipTitle)}
          </div>
        </Tooltip>
      )}
      {!collapsibleHeader && !collapsibleBody && children}
    </MUITableCell>
  );
};
