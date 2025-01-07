import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SortableElement, sortableHandle } from 'react-sortable-hoc';
import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import Component from './Component';

const useStyles = makeStyles(theme => ({
  sortableComponent: {
    position: 'relative',
    '&:hover': {
      '& $dragButton': {
        display: 'block',
      },
    },
    zIndex: '99999999 !important',
    background: ({ isSortable }) => isSortable && theme.palette.background.b5,
    boxShadow: ({ isSortable }) => isSortable && '0px 0px 6px rgba(0, 0, 0, 0.5)',
  },
  topComponent: {
    marginTop: '16px',
  },
  bottomComponent: {
    marginBottom: '8px',
  },
  dragInidicationHidden: {
    '&:hover': {
      '& $dragButton': {
        display: 'none',
      },
    },
  },
  dragIndicatorWrapper: {
    position: 'absolute',
    left: ({ isMobile }) => (isMobile ? '8px' : 0),
    top: ({ isMobile }) => (isMobile ? '20px' : '8px'),
  },
  dragButton: {
    display: ({ isMobile }) => (isMobile ? 'block' : 'none'),
    padding: '8px',
    background: ({isMobile}) => isMobile? 'none' : theme.palette.background.b9,
    '&:hover': {
      background: theme.palette.background.b7,
      '& $dragIndicatorIcon': {
        color: theme.palette.primary.text1,
      },
    },
  },
  dragIndicatorIcon: {
    cursor: 'pointer',
    color: theme.palette.primary.text6,
    fontSize: '16px',
  },
}));

const DragHandle = sortableHandle(({ isMobile }) => {
  const classes = useStyles({ isMobile });

  return (
    <div className={classes.dragIndicatorWrapper}>
      <Tooltip title={isMobile ? '' : 'Click & Drag to reorder'}>
        <IconButton className={classes.dragButton}>
          <DragIndicatorIcon className={classes.dragIndicatorIcon} />
        </IconButton>
      </Tooltip>
    </div>
  );
});

const SortableComponent = SortableElement(
  ({
    component,
    isTopComponent,
    isLastCompnent,
    isSortable,
    sortableIndex,
    validate,
    onDelete,
    onSave,
    isMobile,
    viewColumnsPerRow,
    editColumnsPerRow,
  }) => {
    const classes = useStyles({ isMobile, isSortable });
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div
        className={classNames(classes.sortableComponent, {
          [classes.topComponent]: !isMobile && isTopComponent,
          [classes.bottomComponent]: !isMobile && isLastCompnent,
          [classes.dragInidicationHidden]: !isSortable && sortableIndex !== -1,
        })}
      >
        {!isEditing && <DragHandle isMobile={isMobile} />}
        <Component
          isMobile={isMobile}
          viewColumnsPerRow={viewColumnsPerRow}
          editColumnsPerRow={editColumnsPerRow}
          component={component}
          validate={validate}
          onSave={onSave}
          onDelete={onDelete}
          onChangeEditing={setIsEditing}
          isDragComponent={sortableIndex !== -1}
        />
      </div>
    );
  }
);

SortableComponent.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  component: PropTypes.shape({}).isRequired,
  isTopComponent: PropTypes.bool.isRequired,
  isLastCompnent: PropTypes.bool.isRequired,
  isSortable: PropTypes.bool.isRequired,
  sortableIndex: PropTypes.number.isRequired,
  validate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  viewColumnsPerRow: PropTypes.number.isRequired,
  editColumnsPerRow: PropTypes.number.isRequired,
};

export default memo(SortableComponent);
