import { memo } from 'react';
import { arrayOf, shape } from 'prop-types';
import { Table, TableHead, TableCell, TableBody, TableRow, makeStyles } from '@material-ui/core';
import { getUnitDisplay } from '~/utils';

import CasingComponent from './CasingComponent';

const useStyles = makeStyles({
  tableStyle: { tableLayout: 'fixed' },
  tableHeadCellStyle: {
    padding: '14px 0px',
    color: '#9E9E9E',
    borderTop: '1px solid rgba(81, 81, 81, 1)',
  },
});

const CasingTable = ({ components }) => {
  const { tableStyle, tableHeadCellStyle } = useStyles();

  return (
    <Table aria-label="casing table" className={tableStyle}>
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
          <CasingComponent key={component.id} component={component} order={idx + 1} />
        ))}
      </TableBody>
    </Table>
  );
};

CasingTable.propTypes = {
  components: arrayOf(shape({})).isRequired,
};

export default memo(CasingTable);
