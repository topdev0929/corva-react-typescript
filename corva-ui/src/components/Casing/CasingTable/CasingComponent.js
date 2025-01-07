import { memo } from 'react';
import { shape, number } from 'prop-types';
import { TableCell, TableRow, makeStyles } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';

import CasingComponentIcon from '../CasingComponentIcon';

const useStyles = makeStyles({
  tableBodyCell: { padding: 0, borderBottom: 'none', height: 49 },
  componentIconCell: {
    padding: 0,
    borderBottom: 'none',
    height: 49,
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    color: '#ccc',
  },
  iconWrapper: {
    width: '40px',
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    marginRight: '4px',
  },
});

const CasingComponent = ({ component, order }) => {
  const { tableBodyCell, componentIconCell, infoIcon, iconWrapper } = useStyles();

  return (
    <TableRow>
      <TableCell className={tableBodyCell}>{order}</TableCell>
      <TableCell className={componentIconCell}>
        <div className={iconWrapper}>
          <CasingComponentIcon component={component} />
        </div>
        <div>{component.family_name || component.family}</div>
      </TableCell>
      <TableCell className={tableBodyCell}>{component.name}</TableCell>
      <TableCell className={tableBodyCell}>{component.outer_diameter}</TableCell>
      <TableCell className={tableBodyCell}>{component.inner_diameter}</TableCell>
      <TableCell className={tableBodyCell}>{component.linear_weight}</TableCell>
      <TableCell className={tableBodyCell}>{component.length}</TableCell>
      <TableCell className={tableBodyCell}>{component.weight}</TableCell>
      <TableCell className={tableBodyCell}>{component.cum_length}</TableCell>
      <TableCell className={tableBodyCell}>{component.grade}</TableCell>
      <TableCell className={tableBodyCell}>
        <InfoOutlined className={infoIcon} />
      </TableCell>
    </TableRow>
  );
};

CasingComponent.propTypes = {
  component: shape({}).isRequired,
  order: number.isRequired,
};

export default memo(CasingComponent);
