import { MenuItem as MuiMenuItem, Tooltip, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  disabled: {
    color: theme.palette.primary.text9,
    opacity: 1,
    cursor: 'default',
  },
  tooltipTrigger: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}));

const MenuItem = ({ DisabledTooltipProps, disabled, ...MenuItemProps }) => {
  const styles = useStyles();

  const handleDisabledItemClick = e => {
    e.stopPropagation();
  };

  if (disabled) {
    return (
      <MuiMenuItem
        {...MenuItemProps}
        className={classNames(styles.disabled, MenuItemProps.className)}
        tabIndex={-1}
        button={false}
      >
        <>
          {MenuItemProps.children}
          <Tooltip title="Disabled" placement="right" {...DisabledTooltipProps}>
            <div onClick={handleDisabledItemClick} className={styles.tooltipTrigger} />
          </Tooltip>
        </>
      </MuiMenuItem>
    );
  }

  return <MuiMenuItem {...MenuItemProps} />;
};

MenuItem.propTypes = {
  disabled: PropTypes.bool,
  DisabledTooltipProps: PropTypes.shape({}),
};

MenuItem.defaultProps = {
  disabled: false,
  DisabledTooltipProps: {},
};

export default MenuItem;
