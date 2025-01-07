import PropTypes from 'prop-types';

import { Table, TableBody, TableCell, TableHead, TableRow, TableProps } from '@material-ui/core';

import { useState } from 'react';
import ResizableTableHeaderCell from './ResizableTableHeaderCell';
import ResizableTableCell from './ResizableTableCell';

const ResizableTable = ({ children, ...rest }: TableProps): JSX.Element => {
  const [tableHeader, tableBody] = children as Array<JSX.Element>;

  const tableBodyRows = tableBody?.props?.children;

  const tableHeaderCells = tableHeader?.props?.children?.props?.children?.reduce(
    (accum, current) => {
      if (Array.isArray(current)) {
        accum.push(...current);
      } else {
        accum.push(current);
      }
      return accum;
    },
    []
  );

  const [widths, setWidths] = useState({});

  const handleWidthsUpdate = newWidth => setWidths(prevWidths => ({ ...prevWidths, ...newWidth }));

  return (
    <Table {...rest}>
      <TableHead>
        <TableRow>
          {tableHeaderCells?.map((cell, index) => {
            if (!cell) return null;
            const isLastColumn = index === tableHeaderCells.length - 1;
            return isLastColumn ? (
              // eslint-disable-next-line react/no-array-index-key
              <TableCell key={cell.key || index} {...cell.props}>
                {cell.props?.children}
              </TableCell>
            ) : (
              <ResizableTableHeaderCell
                // Note: need to use key as index because key is sent only for rows
                // but not for cells in most cases
                // eslint-disable-next-line react/no-array-index-key
                key={cell.key || index}
                cellName={`cell${index}`}
                nextCellName={`cell${index + 1}`}
                handleWidthsUpdate={handleWidthsUpdate}
                widths={widths}
              >
                {cell}
              </ResizableTableHeaderCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableBodyRows?.map(tableBodyRow => {
          return (
            <TableRow key={tableBodyRow.key}>
              {tableBodyRow?.props?.children?.map(
                (cell, index) =>
                  cell && (
                    <ResizableTableCell
                      // Note: need to use key as index because key is sent only for rows
                      // but not for cells in most cases
                      // eslint-disable-next-line react/no-array-index-key
                      key={cell.key || index}
                    >
                      {cell}
                    </ResizableTableCell>
                  )
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const resizableTablePropTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

ResizableTable.propTypes = resizableTablePropTypes;

export default ResizableTable;
