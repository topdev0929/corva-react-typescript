/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  Checkbox,
  Table as TableComponent,
  TableBody,
  TableHead,
  TableFooter,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core';
import classNames from 'classnames';

import DeleteIcon from '@material-ui/icons/Delete';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { TableSortLabel, TableToolbar, TableContainer, TableCell } from '~/components/Table';
import IconButton from '~/components/IconButton';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

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

const StyledTableCell = withStyles({ root: { boxSizing: 'border-box' } })(TableCell);

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  size,
  withCheckboxes,
  stickyColumn,
}) {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell
          stickyCell={stickyColumn}
          className={classNames({ dense: size === 'dense' })}
          {...(withCheckboxes && {
            style: { paddingTop: 0, paddingBottom: 0, verticalAlign: 'middle' },
          })}
        >
          {withCheckboxes && (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              size="small"
            />
          )}
        </StyledTableCell>
        {headCells.map(headCell => (
          <StyledTableCell
            className={size === 'dense' ? 'dense' : ''}
            key={headCell.id}
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
        {stickyColumn && <StyledTableCell stickyCell emptyCell />}
      </TableRow>
    </TableHead>
  );
}

export function Table({ size, withCheckboxes, type }) {
  const stickyHeader = type === 'vertical scroll';
  const stickyColumn = type === 'horizontal scroll';
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
    <div style={{ width: 750 }}>
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
      <TableContainer
        stickyHeader={stickyHeader}
        stickyColumn={stickyColumn}
        style={{
          width: stickyColumn ? 350 : 750,
          height: stickyHeader ? '75vh' : '100%',
        }}
      >
        <TableComponent stickyHeader={stickyHeader} size={size === 'medium' ? 'medium' : 'small'}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            size={size}
            withCheckboxes={withCheckboxes}
            stickyColumn={stickyColumn}
          />
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
                  <TableCell
                    stickyCell={stickyColumn}
                    className={classNames({ dense: size === 'dense' })}
                    {...(withCheckboxes && { style: { paddingTop: 0, paddingBottom: 0 } })}
                  >
                    {withCheckboxes && <Checkbox size="small" checked={isItemSelected} />}
                  </TableCell>
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
                  {stickyColumn && <StyledTableCell stickyCell emptyCell />}
                </TableRow>
              );
            })}
          </TableBody>
          {stickyHeader && (
            <TableFooter style={{ height: '16px', width: '100%', position: 'sticky', bottom: 0 }} />
          )}
        </TableComponent>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

const tableWithCollapsibleColumnRows = [
  createData(
    'Greg Mc-Fuggin-Donald_Rick Ross State Unit East 4714H (2022-08-19 07:53:14 UTC)',
    305,
    3.7,
    67,
    4.3
  ),
  createData('Wellview POST Test', 452, 25.0, 51, 4.9),
  createData('Wellview Test A', 262, 16.0, 24, 6.0),
  createData('WellView Well H14', 159, 6.0, 24, 4.0),
  createData('WellView Well H14 (2020-03-09 15:53:25 UTC)', 356, 16.0, 49, 3.9),
  createData('Offset Well Name Long Long Long Long Long Long Well Name', 408, 3.2, 87, 6.5),
  createData(
    'Egestas integer eget aliquet nibh praesent tristique magna sit amet',
    237,
    9.0,
    37,
    4.3
  ),
  createData('Lorem ipsum dolor sit amet, consectetur adipiscing elit', 375, 0.0, 94, 0.0),
  createData('Vitae ultricies leo integer malesuada nunc', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
];
const ONE_CHAR_WIDTH = 5;

export function TableWithCollapsibleColumn({
  size,
  cellWidth,
  maxCharsNumberFromEnd,
  maxCharsNumberFromStart,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxCellWidth =
    Math.max(...tableWithCollapsibleColumnRows.map(item => item.name.length)) * ONE_CHAR_WIDTH;
  const cellClassName = size === 'dense' ? 'dense' : '';

  return (
    <TableContainer style={{ width: 750 }}>
      <TableComponent size={size === 'medium' ? 'medium' : 'small'}>
        <TableHead>
          <TableRow>
            <StyledTableCell
              collapsibleHeader
              align="center"
              className={cellClassName}
              cellWidth={cellWidth}
              maxCellWidth={maxCellWidth}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            >
              Well Name
            </StyledTableCell>
            {headCells.slice(1).map(({ id, label }) => (
              <StyledTableCell className={cellClassName} key={id} align="center">
                {label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableWithCollapsibleColumnRows.map(row => {
            return (
              <TableRow hover key={row.name}>
                <StyledTableCell
                  scope="row"
                  className={cellClassName}
                  collapsibleBody
                  isExpanded={isExpanded}
                  tooltipTitle={row.name}
                  maxCharsNumberFromStart={maxCharsNumberFromStart}
                  maxCharsNumberFromEnd={maxCharsNumberFromEnd}
                >
                  {row.name}
                </StyledTableCell>
                <StyledTableCell className={cellClassName} align="center">
                  {row.calories}
                </StyledTableCell>
                <StyledTableCell className={cellClassName} align="center">
                  {row.fat}
                </StyledTableCell>
                <StyledTableCell className={cellClassName} align="center">
                  {row.carbs}
                </StyledTableCell>
                <StyledTableCell className={cellClassName} align="center">
                  {row.protein}
                </StyledTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableComponent>
    </TableContainer>
  );
}

export default {
  title: 'Components/Table',
  component: Table,
  argTypes: {
    size: {
      defaultValue: 'medium',
      control: 'inline-radio',
      options: ['dense', 'small', 'medium'],
    },
    withCheckboxes: {
      control: 'boolean',
    },
    type: {
      control: 'inline-radio',
      options: ['without scroll', 'vertical scroll', 'horizontal scroll'],
    },
    cellWidth: {
      control: 'number',
    },
    maxCharsNumberFromStart: {
      control: 'number',
    },
    maxCharsNumberFromEnd: {
      control: 'number',
    },
  },
  args: {
    size: 'medium',
    withCheckboxes: false,
    type: 'without scroll',
    cellWidth: 140,
    maxCharsNumberFromStart: 10,
    maxCharsNumberFromEnd: 5,
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Table/index.js',
  },
};
