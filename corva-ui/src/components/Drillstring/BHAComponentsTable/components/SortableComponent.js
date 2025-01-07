import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SortableElement, sortableHandle } from 'react-sortable-hoc';
import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import { BHA_FAMILY } from '~/constants/bha';
import Component from './Component';

const useStyles = makeStyles(theme => ({
  sortableComponent: {
    position: 'relative',
    '&:hover': {
      '& $dragIndicatorButton': {
        visibility: 'visible',
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
      '& $dragIndicatorButton': {
        visibility: 'hidden',
      },
    },
  },
  dragIndicatorWrapper: {
    position: 'absolute',
    left: ({ isMobile }) => (isMobile ? '8px' : 0),
    top: ({ isMobile }) => (isMobile ? '20px' : '8px'),
  },
  dragIndicatorButton: {
    visibility: ({ isMobile }) => (isMobile ? 'visible' : 'hidden'),
    padding: '8px',
    background: ({ isMobile }) => (isMobile ? 'none' : theme.palette.background.b9),
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
        <IconButton className={classes.dragIndicatorButton}>
          <DragIndicatorIcon className={classes.dragIndicatorIcon} />
        </IconButton>
      </Tooltip>
    </div>
  );
});

const SortableComponent = SortableElement(
  ({
    isActualBha,
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
    onAutocompleteApplied,
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
        {component.family !== BHA_FAMILY.bit && !isEditing && <DragHandle isMobile={isMobile} />}
        <Component
          isMobile={isMobile}
          isActualBha={isActualBha}
          viewColumnsPerRow={viewColumnsPerRow}
          editColumnsPerRow={editColumnsPerRow}
          component={component}
          validate={validate}
          onSave={onSave}
          onDelete={onDelete}
          onChangeEditing={setIsEditing}
          onAutocompleteApplied={onAutocompleteApplied}
          isDragComponent={sortableIndex !== -1}
        />
      </div>
    );
  }
);

SortableComponent.propTypes = {
  isActualBha: PropTypes.bool.isRequired,
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
  onAutocompleteApplied: PropTypes.func.isRequired,
};

export default memo(SortableComponent);
