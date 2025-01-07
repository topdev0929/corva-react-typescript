import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { Popover, Checkbox, MenuItem, withStyles } from '@material-ui/core';

const StyledMenuItem = withStyles({
  root: {
    paddingRight: 8,
  },
})(MenuItem);

const items = [
  {
    id: '1',
    value: 'Canyon',
  },
  {
    id: '2',
    value: 'Secondary',
  },
  {
    id: '3',
    value: 'Other',
  },
];

// eslint-disable-next-line react/prop-types
const Icon = ({ color }) => (
  <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 6, marginRight: 8 }} />
);

export const MultiSelectMenuIcons = props => {
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
            width: props.width,
            paddingTop: 8,
            paddingBottom: 8,
          },
        }}
      >
        {items.map(item => (
          <StyledMenuItem key={item.id} onClick={() => handleSelectItem(item.id)}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Icon color={props.color} />
                <span>{item.value}</span>
              </div>
              <Checkbox checked={selectedItems.includes(item.id)} color="primary" />
            </div>
          </StyledMenuItem>
        ))}
      </Popover>
    </div>
  );
};

MultiSelectMenuIcons.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
};

MultiSelectMenuIcons.defaultProps = {
  width: '348px',
  color: '#D06CFF',
};

export default {
  title: 'Components/Menu',
  component: MultiSelectMenuIcons,
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
  argTypes: {
    color: { control: 'color' },
  },
};
