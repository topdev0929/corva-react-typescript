import { FC, memo, useState } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import classnames from 'classnames';

import { AxisOption } from '@/stores/di-chart';

import styles from './index.module.css';

type Props = {
  axis: AxisOption;
  options: AxisOption[];
  onChange: (axis: AxisOption) => void;
  type: 'horizontal' | 'vertical';
};

export const AxisSelector: FC<Props> = memo(({ axis, onChange, options, type }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const isVertical = type === 'vertical';

  const onOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (option: AxisOption) => {
    onChange(option);
    onClose();
  };

  const renderUnits = (axis: AxisOption) => {
    return axis.units && <p className={styles.units}>({axis.units})</p>;
  };

  return (
    <>
      <div
        className={classnames(styles.container, {
          [styles.isVertical]: isVertical,
        })}
        onClick={onOpen}
      >
        <div className={styles.labelContainer}>
          <p className={styles.label}>{axis.label}</p>
          {renderUnits(axis)}
        </div>
        <div className={classnames(styles.triangle, { [styles.isActive]: isOpen })} />
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{
          vertical: isVertical ? 'center' : 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: isVertical ? 'center' : 'bottom',
          horizontal: isVertical ? 'left' : 'center',
        }}
        getContentAnchorEl={null}
      >
        {options.map(option => (
          <MenuItem
            key={option.value}
            onClick={() => handleChange(option)}
            selected={option.value === axis.value}
          >
            <div className={styles.option}>
              <p className={styles.label}>{option.label}</p>
              {renderUnits(option)}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

AxisSelector.displayName = 'AxisSelector';
