import { memo } from 'react';
import { shape, number, func } from 'prop-types';
import { TableCell, TableRow, makeStyles } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';

import BHAComponentIcon from '../BHAComponentIcon';

const useStyles = makeStyles({
  tableBodyCell: { padding: 0, borderBottom: 'none', height: 49, fontSize: '13px' },
  componentIconCell: {
    padding: 0,
    borderBottom: 'none',
    height: 49,
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
  },
  infoIcon: {
    fontSize: 16,
    color: '#ccc',
    cursor: 'pointer',
  },
  iconWrapper: {
    width: '40px',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '4px',
  },
});

const BHAComponent = ({ component, order, onSelect }) => {
  const { tableBodyCell, componentIconCell, iconWrapper, infoIcon } = useStyles();

  return (
    <TableRow>
      <TableCell className={tableBodyCell}>{order}</TableCell>
      <TableCell className={componentIconCell}>
        <div className={iconWrapper}>
          <BHAComponentIcon component={component} />
        </div>
        <div>{component.family_name || component.family}</div>
      </TableCell>
      <TableCell className={tableBodyCell}>{component.name}</TableCell>
      <TableCell className={tableBodyCell}>{component.outer_diameter}</TableCell>
      <TableCell className={tableBodyCell}>{component.inner_diameter}</TableCell>
      <TableCell className={tableBodyCell}>{component.linear_weight}</TableCell>
      <TableCell className={tableBodyCell}>{component.length}</TableCell>
      <TableCell className={tableBodyCell}>{component.weight}</TableCell>
      <TableCell className={tableBodyCell}>
        {Number.isFinite(component.c_length) ? component.c_length.toFixed(2) : ''}
      </TableCell>
      <TableCell className={tableBodyCell}>{component.grade}</TableCell>
      <TableCell className={tableBodyCell}>
        <InfoOutlined className={infoIcon} onClick={() => onSelect(component)} />
      </TableCell>
    </TableRow>
  );
};

BHAComponent.propTypes = {
  component: shape({}).isRequired,
  order: number.isRequired,
  onSelect: func.isRequired,
};

export default memo(BHAComponent);
