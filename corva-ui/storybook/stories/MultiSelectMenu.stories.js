import { useState } from 'react';

import { Button, Popover, Checkbox, withStyles } from '@material-ui/core';
import MenuItem from '~/components/MenuItem';

const StyledMenuItem = withStyles({
  root: {
    paddingLeft: 8,
  },
})(MenuItem);

const StyledCheckbox = withStyles({
  root: {
    marginRight: 3,
  },
})(Checkbox);

const items = [
  {
    id: '1',
    value: 'Upper Avalon',
  },
  {
    id: '2',
    value: 'Secondary',
    disabled: true,
  },
  {
    id: '3',
    value: 'Other',
  },
];

export const MultiSelectMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectItem = item => {
    const isItemInList = selectedItems.includes(item);
    const removedItemList = selectedItems.filter(currentItem => currentItem !== item);
    const addedItemList = selectedItems.concat(item);
    setSelectedItems(isItemInList ? removedItemList : addedItemList);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open Menu</Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        PaperProps={{
          style: {
            paddingTop: 8,
            paddingBottom: 8,
          },
        }}
      >
        {items.map(item => (
          <StyledMenuItem
            key={item.id}
            onClick={() => handleSelectItem(item.id)}
            disabled={item.disabled}
          >
            <StyledCheckbox disabled={item.disabled} checked={selectedItems.includes(item.id)} />
            <span>{item.value}</span>
          </StyledMenuItem>
        ))}
      </Popover>
    </div>
  );
};

export default {
  title: 'Components/Menu',
  component: MultiSelectMenu,
  parameters: {
    docs: {
      description: {
        component:
          '<div>Use MUI Menus. More information <a href="https://material-ui.com/api/menu/">here</a></div>',
      },
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9597%3A17471',
  },
};
