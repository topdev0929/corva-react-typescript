import { useState } from 'react';
import PropTypes from 'prop-types';

import { Popover, Button } from '@material-ui/core';

import ArchiveIcon from '@material-ui/icons/Archive';
import ChatIcon from '@material-ui/icons/Chat';
import LaunchIcon from '@material-ui/icons/Launch';
import SettingsIcon from '@material-ui/icons/Settings';
import SendIcon from '@material-ui/icons/Send';

import ContextMenuItem from '~/components/ContextMenuItem';

export const ContextMenu = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            paddingTop: props.padding,
            paddingBottom: props.padding,
          },
        }}
      >
        <ContextMenuItem
          onClick={() => setSelectedItem(1)}
          selected={selectedItem === '1'}
          icon={<ArchiveIcon />}
          small={props.small}
        >
          Export as CSV
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setSelectedItem(2)}
          selected={selectedItem === '2'}
          icon={<SendIcon />}
          small={props.small}
          disabled
        >
          Direct message
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setSelectedItem(3)}
          selected={selectedItem === '3'}
          icon={<ChatIcon />}
          small={props.small}
        >
          Annotate
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setSelectedItem(4)}
          selected={selectedItem === '4'}
          icon={<LaunchIcon />}
          small={props.small}
        >
          Full Screen
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => setSelectedItem(5)}
          selected={selectedItem === '5'}
          icon={<SettingsIcon />}
          small={props.small}
        >
          Settings
        </ContextMenuItem>
      </Popover>
    </div>
  );
};

ContextMenu.propTypes = {
  width: PropTypes.string,
  padding: PropTypes.string,
  small: PropTypes.bool,
};

ContextMenu.defaultProps = {
  width: '200px',
  padding: '8px',
  small: false,
};

export default {
  title: 'Components/Menu',
  component: ContextMenu,
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
