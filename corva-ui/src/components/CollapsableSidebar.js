import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { withStyles, IconButton, Box } from '@material-ui/core';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';

import { SideBar } from './DevCenter';

const PAGE_NAME = 'CollapsableSidebar';

const muiStyles = theme => ({
  drawer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  drawerPaper: {
    '&$drawerClosed': {
      cursor: 'pointer',
      '&:hover::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: theme.palette.background.b7,
      },
    },
  },
  drawerClosed: {
    width: ({ closedWidth }) => closedWidth,
  },
  openToggleIcon: {
    fontSize: '1.25rem',
    color: theme.palette.primary.text7,
  },
  openToggleIconClosed: {
    transform: 'rotate(180deg)',
  },
  openToggleIconButton: {
    padding: 6,
  },
  openToggleContainer: {
    display: 'flex',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flex: '0 0',
    padding: theme.spacing(2, 1, 1.5),
  },
  openToggleContainerCollapsed: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    justifyContent: 'center',
  },
  openToggleContainerOpened: {
    justifyContent: ({ anchor }) => (anchor === 'left' ? 'flex-end' : 'flex-start'),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: 60,
  },
});

const CollapsableSidebar = ({
  classes,
  children,
  onStateChange,
  initialState,
  drawerPaperClassName,
  isToolbarGutterShown,
  openedDrawerWidth,
  anchor,
}) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
    onStateChange(!isOpen);
  };

  const onSidebarClick = () => {
    if (!isOpen) {
      toggleIsOpen();
    }
  };

  const ChevroneIcon = anchor === 'left' ? ChevronLeftRoundedIcon : ChevronRightRoundedIcon;

  return (
    <SideBar
      isToolbarGutterShown={isToolbarGutterShown}
      drawerWidth={openedDrawerWidth}
      drawerClassName={classnames(classes.drawer, !isOpen && classes.drawerClosed)}
      drawerPaperClassName={classnames(
        classes.drawer,
        classes.drawerPaper,
        drawerPaperClassName,
        !isOpen && classes.drawerClosed
      )}
      anchor={anchor}
      listClassName={classes.list}
      onClick={onSidebarClick}
    >
      {children}
      <Box
        className={classnames(classes.openToggleContainer, {
          [classes.openToggleContainerCollapsed]: !isOpen,
          [classes.openToggleContainerOpened]: isOpen,
        })}
      >
        <IconButton
          data-testid={`${PAGE_NAME}_toggle`}
          aria-label="toggle sidebar"
          className={classes.openToggleIconButton}
          onClick={toggleIsOpen}
        >
          <ChevroneIcon
            className={classnames(classes.openToggleIcon, {
              [classes.openToggleIconClosed]: !isOpen,
            })}
          />
        </IconButton>
      </Box>
    </SideBar>
  );
};

CollapsableSidebar.propTypes = {
  children: PropTypes.node.isRequired,
  onStateChange: PropTypes.func,
  initialState: PropTypes.bool,
  drawerPaperClassName: PropTypes.string,
  isToolbarGutterShown: PropTypes.bool,
  openedDrawerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anchor: PropTypes.oneOf(['left', 'right']),
  // eslint-disable-next-line react/no-unused-prop-types
  closedWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CollapsableSidebar.defaultProps = {
  onStateChange: noop,
  initialState: true,
  closedWidth: 48,
  drawerPaperClassName: null,
  isToolbarGutterShown: undefined,
  openedDrawerWidth: undefined,
  anchor: undefined,
};

export default withStyles(muiStyles)(CollapsableSidebar);
