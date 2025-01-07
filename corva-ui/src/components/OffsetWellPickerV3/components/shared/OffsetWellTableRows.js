import { string, shape, arrayOf, bool } from 'prop-types';
import {
  TableBody,
  TableRow,
  TableCell,
  withStyles,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Done } from '@material-ui/icons';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  wellCell: {
    minWidth: ({ isTablet, isMobile }) => (isTablet || !isMobile ? '330px' : '180px'),
    maxWidth: ({ isTablet, isMobile }) => !isTablet && isMobile && '200px',
    position: 'sticky',
    left: 0,
    zIndex: 1,
    background: theme.palette.background.b9,
  },
  wellName: {
    display: '-webkit-box',
    alignItems: 'center',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflowWrap: 'break-word',
  },
  iconCell: {
    textAlign: 'center',
    width: '60px',
  },
  rightAlign: {
    textAlign: 'center',
  },
  doneIcon: {
    height: '16px',
    color: theme.palette.primary.light,
  },
  shadow: {
    position: 'sticky',
    zIndex: 10,
    border: 0,
    padding: 0,
    margin: 0,
    '&::after': {
      content: "' '",
      pointerEvents: 'none',
      position: 'absolute',
    },
  },
  topShadow: {
    height: 0,
    top: '48px',
    '&::after': {
      left: 0,
      right: 0,
      height: '16px',
      background: `linear-gradient(0deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
  bottomShadow: {
    height: 0,
    bottom: '16px',
    '&::after': {
      left: 0,
      right: 0,
      height: '16px',
      background: `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
  rightShadow: {
    right: 0,
    padding: '0 !important',
    '&::after': {
      width: '16px',
      top: 0,
      bottom: 0,
      right: 0,
      background: `linear-gradient(90deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
    },
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const StyledTableCell = withStyles({
  root: { boxSizing: 'border-box', padding: '6px 8px !important' },
})(TableCell);

function OffsetWellTableRows({ rows, headCells, order, orderBy, isTablet, isMobile }) {
  const classes = useStyles({ isTablet, isMobile });

  return (
    <TableBody>
      {rows.length > 0 && (
        <TableRow>
          <TableCell colSpan="100%" className={classNames(classes.shadow, classes.topShadow)} />
        </TableRow>
      )}
      {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
        <TableRow key={row.id}>
          <StyledTableCell
            id={`enhanced-table-checkbox-${index}`}
            scope="row"
            className={classes.wellCell}
          >
            <Typography variant="body2" className={classes.wellName}>
              {row.name}
            </Typography>
          </StyledTableCell>
          {headCells.map(header => (
            <StyledTableCell
              key={`offset-well-table-row-${header.id}`}
              className={classes.iconCell}
            >
              {row[header.id] ? <Done className={classes.doneIcon} /> : ''}
            </StyledTableCell>
          ))}
          <TableCell colSpan="100%" className={classNames(classes.shadow, classes.rightShadow)} />
        </TableRow>
      ))}
      {rows.length > 0 && (
        <TableRow>
          <TableCell colSpan="100%" className={classNames(classes.shadow, classes.bottomShadow)} />
        </TableRow>
      )}
    </TableBody>
  );
}

OffsetWellTableRows.propTypes = {
  rows: arrayOf(shape({})).isRequired,
  headCells: arrayOf(shape({})).isRequired,
  order: string.isRequired,
  orderBy: string.isRequired,
  isTablet: bool.isRequired,
  isMobile: bool.isRequired,
};

export default OffsetWellTableRows;
