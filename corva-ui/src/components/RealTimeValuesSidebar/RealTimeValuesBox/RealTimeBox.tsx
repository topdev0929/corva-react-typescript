import { memo, useContext } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { Divider } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import { getUnitDisplay } from '~/utils';

import { RealTimeBoxProps } from '../types';
import IconButton from '~/components/IconButton';
import RealTimeSidebarContext from '../RealTimeSidebarContext';
import { useStyles } from './RealTimeBoxStyles';

function RealTimeBox(props: RealTimeBoxProps) {
  const { item = null, isDraggable = true, dragHandle = noop, itemSelected = null } = props;

  const classes = useStyles();

  const { handleOpenCloseDialog, handleChangeParamToEdit } = useContext(RealTimeSidebarContext);

  const displayUnit = item ? getUnitDisplay(item.unitType) : null;

  const paramColorStyle = item
    ? {
        borderLeft: `2px solid ${item.color}`,
      }
    : null;

  const handleClick = () => {
    handleOpenCloseDialog(true);
    handleChangeParamToEdit(item.key);
  };

  if (!item) return null;

  return (
    <>
      <div
        className={classNames(classes.rtBox, {
          [classes.rtBoxSelected]: !!itemSelected,
          notDraggable: !isDraggable,
        })}
        data-testid="realtime_box"
      >
        <>
          <div
            className={classes.rtBoxInner}
            style={paramColorStyle}
            onClick={handleClick}
            data-testid={`${item.name}_edit_item`}
          >
            <div className={classes.rtBoxTitle}>{item.name}</div>
            <div className={classes.rtBoxValue}>
              {item.value} <span>{displayUnit}</span>
            </div>
          </div>
          {isDraggable &&
            dragHandle(
              <div className={classes.rtBoxButtonContainer}>
                <IconButton tooltipProps={{ title: 'Drag to Reorder' }}>
                  <DragIndicatorIcon className={classes.dragIcon} color="error" />
                </IconButton>
              </div>
            )}
        </>
      </div>
      {isDraggable && <Divider className={classes.divider} />}
    </>
  );
}

export default memo(RealTimeBox);
