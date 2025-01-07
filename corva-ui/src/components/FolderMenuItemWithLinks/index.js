import { useState } from 'react';
import PropTypes from 'prop-types';

import { Collapse, List } from '@material-ui/core';

import FolderMenuItem from '../FolderMenuItem';
import { EditableItemWithBadge } from '../EditableItem';

const FolderMenuItemWithLinks = ({
  folderColor,
  id,
  isCreatable,
  isOpen: initialIsOpen,
  items,
  name,
  onAdd,
  onFolderClick,
  onItemClick,
  onSave,
  selectedItemId,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

   // eslint-disable-next-line consistent-return
   const handleFolderClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (selectedItemId !== id) {
      onFolderClick();
    }
  };

  const getItemClickHandler = item => () => onItemClick(item);

  const getSaveHandler = id => title => onSave({id, title});

  return (
    <div>
      <FolderMenuItem
        folderColor={folderColor}
        isCreatable={isCreatable}
        isOpen={isOpen}
        isSelected={selectedItemId === id}
        name={name}
        onAdd={() => onAdd(id)}
        onClick={handleFolderClick}
        onToggle={() => setIsOpen(!isOpen)}
      />
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          { items.map(item => (
            <EditableItemWithBadge
              isEditable={item.isEditable}
              isSelected={selectedItemId === item.id}
              key={item.id}
              onClick={getItemClickHandler(item)}
              onSave={getSaveHandler(item.id)}
              value={item.title}
            />
          )) }
        </List>
      </Collapse>
    </div>
  );
};

FolderMenuItemWithLinks.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  selectedItemId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isEditable: PropTypes.bool,
    url: PropTypes.string.isRequired,
  })),
  name: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func,
  folderColor: PropTypes.string.isRequired,
  isCreatable: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

FolderMenuItemWithLinks.defaultProps = {
  isCreatable: false,
  isOpen: true,
  items: [],
  onFolderClick: () => {},
};

export default FolderMenuItemWithLinks;
