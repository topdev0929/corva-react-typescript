import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, withStyles, Tooltip } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

const muiStyles = theme => ({
  iconButton: {
    padding: '10px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
    paper: {},
  },
});

function IconMenu({
  classes,
  // IconButtonComponentProps
  'data-testid': testId,
  iconButtonStyle,
  color,
  disableRipple,
  className,
  IconElement,
  IconButtonComponent,
  disabled,
  iconButtonProps,
  // MenuProps
  children,
  anchorOrigin,
  transformOrigin,
  marginThreshold,
  menuProps,
  // Tooltip
  tooltipProps,
  paperClassName,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = !!anchorEl;

  /*
    A fix of the issue: https://corvaqa.atlassian.net/browse/DC-3713

    When Material Menu is rendered, at first it's displayed at the top of the container
    and only then moves to the anchor element. When the focus is enabled, and the element is
    inside of an iframe but outside the view - browsers scroll the page to it. Because of this, we set focus in async
    manner, to wait for correct position - and then set focus.

    https://github.dev/mui/material-ui/blob/v4.x/packages/material-ui/src/Popover/Popover.js#L323-L331
  */
  const [isMenuAutofocus, setIsMenuAutofocus] = useState(false);
  useEffect(() => {
    let timerId;

    if (isOpen) {
      setTimeout(() => {
        timerId = setIsMenuAutofocus(isOpen);
        // Why 500? The lower delay doesn't actually work, so this is the lowest value I could get to make it work
      }, 500);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isOpen]);

  const handleClose = event => {
    event.stopPropagation();
    setAnchorEl(null);
    setIsMenuAutofocus(false);
  };
  const handleOpen = event => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const iconButtonElement = (
    <IconButtonComponent
      aria-label="IconMenu"
      aria-owns={isOpen ? 'icon-menu' : undefined}
      aria-haspopup="true"
      data-testid={testId}
      onClick={handleOpen}
      classes={{ root: classes.iconButton }}
      className={className}
      style={iconButtonStyle}
      color={color}
      disableRipple={disableRipple}
      disabled={disabled}
      {...iconButtonProps}
    >
      {IconElement}
    </IconButtonComponent>
  );

  return (
    <>
      {tooltipProps ? <Tooltip {...tooltipProps}>{iconButtonElement}</Tooltip> : iconButtonElement}
      <Menu
        id="icon-menu"
        anchorEl={anchorEl}
        open={isOpen}
        disableAutoFocus={!isMenuAutofocus}
        autoFocus={isMenuAutofocus}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        classes={{ paper: classes.paper }}
        elevation={0}
        marginThreshold={marginThreshold}
        PaperProps={{
          className: classes[paperClassName],
        }}
        {...menuProps}
      >
        {children}
      </Menu>
    </>
  );
}

IconMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.array]),
  classes: PropTypes.shape({
    iconButton: PropTypes.string,
    paper: PropTypes.string,
  }),
  className: PropTypes.string,
  color: PropTypes.string,
  IconElement: PropTypes.element,
  // eslint-disable-next-line react/forbid-prop-types
  IconButtonComponent: PropTypes.any,
  iconButtonStyle: PropTypes.shape({}),
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
  }),
  transformOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
  }),
  disableRipple: PropTypes.bool,
  'data-testid': PropTypes.string,
  marginThreshold: PropTypes.number,
  disabled: PropTypes.bool,
  tooltipProps: PropTypes.shape({}),
  menuProps: PropTypes.shape({}),
  iconButtonProps: PropTypes.shape({}),
  paperClassName: PropTypes.string,
};

IconMenu.defaultProps = {
  children: undefined,
  classes: {},
  className: undefined,
  color: undefined,
  'data-testid': undefined,
  IconElement: <MoreVert />,
  iconButtonStyle: undefined,
  IconButtonComponent: IconButton,
  disableRipple: false,
  anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
  transformOrigin: { horizontal: 'right', vertical: 'bottom' },
  marginThreshold: undefined,
  disabled: false,
  tooltipProps: undefined,
  menuProps: {},
  iconButtonProps: {},
  paperClassName: '',
};

export default withStyles(muiStyles)(IconMenu);
