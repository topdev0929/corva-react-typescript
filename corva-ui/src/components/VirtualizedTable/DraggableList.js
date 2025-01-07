import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { Checkbox, Typography, makeStyles } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

const useStyles = makeStyles({
  draggableList: {
    borderNottom: '1px solid #e0e0e0',
    listStyle: 'none',
    padding: '0',
  },
  draggableListItem: {
    cursor: 'pointer',
    borderTop: '1px solid #e0e0e0',
    lineHeight: '1rem',
    zIndex: 1500,
    display: 'flex',
    alignItems: 'center',
    '&:hover $draggableListItemDraghandle': {
      opacity: 1,
    },
  },
  draggableListItemCheckBox: {
    padding: '8px',
  },
  draggableListItemDraghandle: {
    color: '#777',
    opacity: 0,
  },
});

const DragHandle = SortableHandle(() => (
  <DragIndicatorIcon className="c-draggable-list__item_draghandle" fontSize="small" />
));

const SortableItem = SortableElement(({ item, onClick }) => {
  const classes = useStyles();
  return (
    <li className={classes.draggableListItem}>
      <DragHandle />
      <Checkbox
        className={classes.draggableListItemCheckBox}
        color="primary"
        checked={item.show}
        onClick={() => onClick(item)}
      />
      <Typography variant="body2">{item.customLabel || item.label || item}</Typography>
    </li>
  );
});

const SortableList = SortableContainer(({ items, onClick }) => {
  const classes = useStyles();
  return (
    <ul className={classes.draggableList}>
      {items.map((item, index) => (
        <SortableItem
          key={item.label}
          index={index}
          item={item}
          onClick={onClick}
          disabled={item.disabled}
        />
      ))}
    </ul>
  );
});

function DraggableList({ items, onSort, onClick }) {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = arrayMove(items, oldIndex, newIndex);
    onSort(newItems);
  };

  return <SortableList useDragHandle items={items} onSortEnd={onSortEnd} onClick={onClick} />;
}

DraggableList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSort: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DraggableList;
