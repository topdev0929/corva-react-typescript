import { Icon, IconButton } from '@material-ui/core';

import styles from './PriorityMenus.css';

const PAGE_NAME = 'PriorityMenus';

export default function PriorityMenus({ menuItems, devCenterRouter, isMobileView }) {
  return menuItems.map(menuConfig => (
    <IconButton
      data-testid={`${PAGE_NAME}_item_${menuConfig.title}`}
      key={menuConfig.title}
      classes={{ root: styles.iconButton }}
      tooltipProps={{ title: !isMobileView && 'Menu' }}
      onClick={() => {
        menuConfig.onClick?.();

        if (menuConfig.to) {
          devCenterRouter.push(menuConfig.to);
        }
      }}
    >
      <Icon className={styles.icon}>{menuConfig.icon}</Icon>
    </IconButton>
  ));
}
