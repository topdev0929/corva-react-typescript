import { Tooltip, TableSortLabel as TableSortLabelComponent } from '@material-ui/core';

const TableSortLabel = props => (
  <Tooltip placement="top-end" title="Sort">
    <TableSortLabelComponent {...props} />
  </Tooltip>
);

export default TableSortLabel;
