import { memo } from 'react';
import { arrayOf, shape, string, func, bool, number } from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SortableContainer } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core';

import SortableComponent from './SortableComponent';

const useStyles = makeStyles({
  body: {
    flex: 1,
    minHeight: 0,
    zIndex: 0,
    position: 'relative',
  },
});

const SortableComponents = SortableContainer(
  ({
    components,
    validate,
    sortableIndex,
    onDeleteComponent,
    onSaveComponent,
    isMobile,
    viewColumnsPerRow,
    editColumnsPerRow,
  }) => {
    const classes = useStyles();

    return (
      <div className={classes.body}>
        {components.map((component, index) => (
          <SortableComponent
            key={component.id}
            index={index}
            isSortable={sortableIndex === index}
            sortableIndex={sortableIndex}
            component={component}
            isTopComponent={index === 0}
            isLastCompnent={index === components.length - 1}
            validate={validate}
            onDelete={onDeleteComponent}
            onSave={onSaveComponent}
            isMobile={isMobile}
            viewColumnsPerRow={viewColumnsPerRow}
            editColumnsPerRow={editColumnsPerRow}
          />
        ))}
      </div>
    );
  }
);

SortableComponents.propTypes = {
  components: arrayOf(shape({ id: string.isRequired })),
  validate: func.isRequired,
  sortableIndex: number.isRequired,
  onSaveComponent: func.isRequired,
  onDeleteComponent: func.isRequired,
  isMobile: bool.isRequired,
  viewColumnsPerRow: number.isRequired,
  editColumnsPerRow: number.isRequired,
};

export default memo(SortableComponents);
