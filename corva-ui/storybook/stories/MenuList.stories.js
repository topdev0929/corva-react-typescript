import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Menu } from '@material-ui/core';
import MenuItem from '~/components/MenuItem';
import TruncatedText from '~/components/TruncatedText';

export const MenuList = props => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: props.width,
          },
        }}
      >
        <MenuItem onClick={handleClose}>Twenty</MenuItem>
        <MenuItem onClick={handleClose}>Twenty</MenuItem>
        <MenuItem disabled onClick={handleClose}>
          Twenty
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <TruncatedText>
            very loong textvery loong textvery loong textvery loong textvery loong text
          </TruncatedText>
        </MenuItem>
      </Menu>
    </div>
  );
};

MenuList.propTypes = {
  width: PropTypes.string,
};

MenuList.defaultProps = {
  width: '360px',
};

export default {
  title: 'Components/Menu',
  component: MenuList,
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
