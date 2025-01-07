import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Drawer, List, Toolbar, withStyles } from '@material-ui/core';

const SideBar = ({
  classes,
  drawerClassName,
  drawerPaperClassName,
  isToolbarGutterShown,
  onClick,
  children,
  listClassName,
  anchor,
}) => (
  <Drawer
    onClick={onClick}
    className={classnames(classes.drawer, drawerClassName)}
    variant="permanent"
    classes={{
      paper: classnames(classes.drawerPaper, drawerPaperClassName),
    }}
    anchor={anchor}
  >
    {isToolbarGutterShown && <Toolbar className={classes.toolbar} />}
    <List className={classnames(classes.list, listClassName)}>{children}</List>
  </Drawer>
);

SideBar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  drawerPaperClassName: PropTypes.string,
  drawerClassName: PropTypes.string,
  listClassName: PropTypes.string,
  onClick: PropTypes.func,
  isToolbarGutterShown: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  drawerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anchor: PropTypes.oneOf(['left', 'right']),
};

SideBar.defaultProps = {
  drawerPaperClassName: null,
  drawerClassName: null,
  listClassName: null,
  onClick: () => {},
  isToolbarGutterShown: true,
  drawerWidth: 240,
  anchor: 'left',
};

export default withStyles({
  drawer: {
    width: ({ drawerWidth }) => drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: ({ drawerWidth }) => drawerWidth,
    background: '#3B3B3B',
    border: 'none',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
  },
  toolbar: {
    height: 50,
    minHeight: 50,
  },
  list: {
    padding: 0,
  },
})(SideBar);
