import { memo } from 'react';
import { string, func, arrayOf, shape, bool, number } from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import { TableSortLabel } from '~/components';

const useStyles = makeStyles(theme => ({
  headerCell: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
    background: theme.palette.background.b9,
    borderTop: `1px solid ${theme.palette.primary.text9}`,
    padding: '6px 8px',
    maxWidth: ({ isTablet }) => !isTablet && '150px',
    minWidth: ({ isMobile }) => isMobile && '90px',
  },
  firstCell: {
    position: 'sticky',
    left: 0,
    background: theme.palette.background.b9,
    zIndex: 3,
  },
  centerAlign: {
    textAlign: 'center !important',
  },
  rightAlign: {
    textAlign: 'right !important',
  },
  lastCell: {
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.primary.text7,
    width: ({ rowNum }) => (rowNum ? 'max-content' : 'auto'),
  },
  sortIcon: {
    opacity: '1.0 !important',
  },
  rightShadow: {
    position: 'sticky',
    zIndex: 10,
    right: 0,
    border: 0,
    padding: '0 !important',
    margin: 0,
    '&::after': {
      content: "' '",
      pointerEvents: 'none',
      position: 'absolute',
      width: '16px',
      top: 0,
      bottom: 0,
      right: 0,
      background: `linear-gradient(90deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
  middleCell: {
    fontSize: '12px',
    width: 'max-content',
  },
}));

const StyledTableCell = withStyles({
  root: { boxSizing: 'border-box', padding: '6px 8px !important' },
})(TableCell);

function OffsetWellTableHead({
  headCells,
  order,
  orderBy,
  onRequestSort,
  isTablet,
  isMobile,
  rowNum,
}) {
  const classes = useStyles({ isTablet, isMobile, rowNum });
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <StyledTableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classNames(classes.headerCell, {
              [classes.firstCell]: idx === 0,
              [classes.centerAlign]: idx > 0,
              [classes.rightAlign]: idx === headCells.length - 1,
            })}
          >
            {idx === 0 || (idx === 1 && idx !== headCells.length - 1) ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                classes={{
                  iconDirectionDesc: classes.sortIcon,
                  iconDirectionAsc: classes.sortIcon,
                }}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography className={classes.middleCell}>{headCell.label}</Typography>
              </TableSortLabel>
            ) : (
              <Typography className={classes.lastCell}>{headCell.label}</Typography>
            )}
          </StyledTableCell>
        ))}
        <TableCell className={classes.rightShadow} />
      </TableRow>
    </TableHead>
  );
}

OffsetWellTableHead.propTypes = {
  headCells: arrayOf(shape({})).isRequired,
  order: string.isRequired,
  orderBy: string.isRequired,
  onRequestSort: func.isRequired,
  isTablet: bool.isRequired,
  isMobile: bool.isRequired,
  rowNum: number.isRequired,
};

export default memo(OffsetWellTableHead);
