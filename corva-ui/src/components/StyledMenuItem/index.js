import { MenuItem, withStyles } from '@material-ui/core';

const MenuItemWithStyles = withStyles({
  root: {
    '&.Mui-selected': {
      backgroundColor: '#414141',
    },
  },
})(MenuItem);

const StyledMenuItem = props => (
  <MenuItemWithStyles {...props}>{props.children}</MenuItemWithStyles>
);

export default StyledMenuItem;
