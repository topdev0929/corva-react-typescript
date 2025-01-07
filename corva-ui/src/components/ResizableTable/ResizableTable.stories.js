/* eslint-disable react/prop-types */
import { useState } from 'react';
import classNames from 'classnames';

import {
  Checkbox,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { ResizableTable } from '~/components/ResizableTable';
import IconButton from '~/components/IconButton';
import { TableSortLabel, TableToolbar } from '~/components/Table';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const StyledTableCell = withStyles({
  root: { boxSizing: 'border-box', border: '1px solid #808080' },
})(TableCell);

const StyledTableSortLabel = withStyles({
  root: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
})(TableSortLabel);

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),
];

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

const headCells = [
  { id: 'name', numeric: false, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, label: 'Calories' },
  { id: 'fat', numeric: true, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, label: 'Carbs (g)' },
  {
    id: 'protein',
    numeric: true,
    label: 'Protein (g)',
  },
];

export function TableResizable({ size, withCheckboxes }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const createSortHandler = (property, handleRequestSort) => event => {
    handleRequestSort(event, property);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <div style={{ width: 1200 }}>
      {withCheckboxes && (
        <TableToolbar
          numSelected={selected.length}
          actions={
            <IconButton size={size === 'medium' ? 'medium' : 'small'}>
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          }
          content={
            <div>
              <Typography variant="h6" id="tableTitle" component="div">
                Nutrition
              </Typography>
            </div>
          }
        />
      )}
      <TableContainer style={{ width: 1200 }}>
        <ResizableTable>
          <TableHead>
            <TableRow>
              {withCheckboxes && (
                <StyledTableCell
                  className={classNames({ dense: size === 'dense' })}
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    verticalAlign: 'middle',
                    border: '1px solid #808080',
                  }}
                >
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    size="small"
                  />
                </StyledTableCell>
              )}
              {headCells.map(headCell => (
                <StyledTableCell
                  className={size === 'dense' ? 'dense' : ''}
                  key={headCell.id}
                  align="left"
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{ border: '1px solid #808080' }}
                >
                  <StyledTableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id, handleRequestSort)}
                  >
                    {headCell.label}
                  </StyledTableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.name);
              return (
                <TableRow
                  hover
                  onClick={withCheckboxes ? event => handleClick(event, row.name) : () => {}}
                  role="checkbox"
                  tabIndex={-1}
                  key={row.name}
                >
                  {withCheckboxes && (
                    <StyledTableCell
                      className={classNames({ dense: size === 'dense' })}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                    >
                      <Checkbox size="small" checked={isItemSelected} />
                    </StyledTableCell>
                  )}
                  <StyledTableCell
                    className={size === 'dense' ? 'dense' : ''}
                    id={`enhanced-table-checkbox-${index}`}
                    scope="row"
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell className={size === 'dense' ? 'dense' : ''} align="left">
                    {row.calories}
                  </StyledTableCell>
                  <StyledTableCell className={size === 'dense' ? 'dense' : ''} align="left">
                    {row.fat}
                  </StyledTableCell>
                  <StyledTableCell className={size === 'dense' ? 'dense' : ''} align="left">
                    {row.carbs}
                  </StyledTableCell>
                  <StyledTableCell className={size === 'dense' ? 'dense' : ''} align="left">
                    {row.protein}
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </ResizableTable>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}

export default {
  title: 'Components/ResizableTable',
  component: TableResizable,
  argTypes: {
    size: {
      efaultValue: 'medium',
      control: 'inline-radio',
      options: ['dense', 'small', 'medium'],
    },
    withCheckboxes: {
      control: 'boolean',
    },
  },
  args: {
    size: 'medium',
    withCheckboxes: false,
  },
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/ResizableTable/ResizableTable.js',
  },
};
