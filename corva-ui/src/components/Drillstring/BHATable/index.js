import { memo } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableCell, TableBody, TableRow, makeStyles } from '@material-ui/core';
import { getUnitDisplay } from '~/utils';

import BHAComponent from './BHAComponent';

const useStyles = makeStyles({
  tableStyle: { tableLayout: 'fixed' },
  tableHeadCellStyle: {
    height: '38px',
    padding: '0px',
    color: '#999999',
    fontSize: '12px',
    borderTop: '1px solid rgba(81, 81, 81, 1)',
  },
});

function BHATable({ components, onSelectComponent }) {
  const { tableStyle, tableHeadCellStyle } = useStyles();

  return (
    <Table className={tableStyle}>
      <TableHead>
        <TableRow>
          <TableCell className={tableHeadCellStyle} style={{ width: '2%' }}>
            #
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '13%', paddingLeft: 44 }}>
            Category
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '13%' }}>
            Name
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '7%' }}>
            OD ({getUnitDisplay('shortLength')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '7%' }}>
            ID ({getUnitDisplay('shortLength')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '15%' }}>
            Linear Weight ({getUnitDisplay('massPerLength')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '10%' }}>
            Length ({getUnitDisplay('length')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '10%' }}>
            Weight ({getUnitDisplay('mass')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '13%' }}>
            Cum.Length ({getUnitDisplay('length')})
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '7%' }}>
            Grade
          </TableCell>
          <TableCell className={tableHeadCellStyle} style={{ width: '3%' }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {components.map((component, idx) => (
          <BHAComponent
            key={component.id}
            component={component}
            order={idx + 1}
            onSelect={onSelectComponent}
          />
        ))}
      </TableBody>
    </Table>
  );
}

BHATable.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelectComponent: PropTypes.func.isRequired,
};

export default memo(BHATable);
