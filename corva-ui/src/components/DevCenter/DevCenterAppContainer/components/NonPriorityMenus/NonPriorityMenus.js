import { useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, ListItemIcon, ListItemText, Icon } from '@material-ui/core';
import {
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Launch as LaunchIcon,
} from '@material-ui/icons';
import { IconButton } from '~/components';
import IconMenu from '~/components/IconMenu';

import styles from './NonPriorityMenus.css';

const PAGE_NAME = 'DevCenter_AppPriorityMenu';

const NonPriorityMenus = ({
  toggleAppSettingsDialog,
  devCenterRouter,
  isMaximized,
  setIsMaximized,
  menuItems,
  isMobileView,
  setIsFullscreenModalMode,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleMenu = () => {
    const nextValue = !isMenuOpen;

    if (nextValue) {
      setIsFullscreenModalMode(nextValue).then(() => setIsMenuOpen(nextValue));
    } else {
      setIsMenuOpen(nextValue);

      // NOTE: popover closing animation slightly moves down, in order to fix the issue I did it in async manner. It's min time the feature works with
      // As I call setIsFullscreenModalMode in setTimeout then I had to do the same when we open settings modal or fullscreen app
      setIsFullscreenModalMode(nextValue);
    }
  };

  const handleMenuItemClick = fn => {
    setIsFullscreenModalMode(true).then(() => fn?.(true));
  };

  return (
    <IconMenu
      data-testid={`${PAGE_NAME}_menu`}
      IconElement={<MenuIcon />}
      className={styles.menuIcon}
      IconButtonComponent={IconButton}
      iconButtonProps={{
        tooltipProps: { title: !isMobileView && 'Menu' },
        onClick: e => {
          setAnchorEl(e.currentTarget);
          setIsFullscreenModalMode(true).then(() => {
            setIsMenuOpen(true);
          });
        },
      }}
      classes={{ iconButton: styles.iconButton }}
      menuProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        getContentAnchorEl: null,
        onClick: toggleMenu,
        onClose: toggleMenu,
        open: isMenuOpen,
        anchorEl,
      }}
    >
      {menuItems.map(menuConfig => (
        <MenuItem
          data-testid={`${PAGE_NAME}_${menuConfig.title}`}
          key={menuConfig.title}
          onClick={() => {
            handleMenuItemClick(menuConfig.onClick);
            if (menuConfig.to) {
              devCenterRouter.push(menuConfig.to);
            }
          }}
          component="li"
          to={menuConfig.to}
        >
          <ListItemIcon>
            <Icon>{menuConfig.icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={menuConfig.title} />
        </MenuItem>
      ))}
      {!isMaximized && (
        <MenuItem
          data-testid={`${PAGE_NAME}_fullScreenMenuItem`}
          className={styles.containerDropdownActionMaximize}
          onClick={() => handleMenuItemClick(setIsMaximized)}
        >
          <ListItemIcon>
            <LaunchIcon />
          </ListItemIcon>
          <ListItemText primary="Full Screen" />
        </MenuItem>
      )}
      <MenuItem
        data-testid={`${PAGE_NAME}_settings`}
        onClick={() => handleMenuItemClick(toggleAppSettingsDialog)}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
    </IconMenu>
  );
};

NonPriorityMenus.propTypes = {
  toggleAppSettingsDialog: PropTypes.func.isRequired,
  isMaximized: PropTypes.bool.isRequired,
  isMobileView: PropTypes.bool,
  setIsMaximized: PropTypes.func.isRequired,
  devCenterRouter: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
      icon: PropTypes.string,
      title: PropTypes.string,
    })
  ),
};

NonPriorityMenus.defaultProps = {
  menuItems: [],
  isMobileView: false,
};

export default NonPriorityMenus;
