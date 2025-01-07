import PropTypes from 'prop-types';
import classNames from 'classnames';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core';

import MenuItem from '../MenuItem';

const useStyles = makeStyles(theme => ({
  menuItem: {
    height: ({ small }) => (small ? 36 : 54),
    lineHeight: ({ small }) => (small ? '17px' : '24px'),
    '&:hover svg': {
      fill: ({ disabled }) =>
        disabled ? theme.palette.primary.text9 : theme.palette.primary.contrastText,
    },
  },
  listItemIcon: {
    paddingRight: theme.spacing(1),
    color: ({ disabled }) => (disabled ? theme.palette.primary.text9 : theme.palette.primary.text7),
    minWidth: 'auto',
    fontSize: ({ small }) => (small ? 16 : 24),
    '& .MuiSvgIcon-root': {
      fontSize: 'inherit',
    },
  },
}));

const ContextMenuItem = ({ classes = {}, icon, children, small, ...otherProps }) => {
  const styles = useStyles({ small, disabled: otherProps.disabled });

  return (
    <MenuItem
      classes={{ ...classes, root: classNames(styles.menuItem, classes.root) }}
      {...otherProps}
    >
      <ListItemIcon classes={{ root: styles.listItemIcon }}>{icon}</ListItemIcon>
      {children}
    </MenuItem>
  );
};

ContextMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  small: PropTypes.bool,
};

ContextMenuItem.defaultProps = {
  small: false,
};

export default ContextMenuItem;
