import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  IconButton as MuiIconButton,
  makeStyles,
  Tooltip,
  TooltipProps,
  IconButtonProps as MuiIconButtonProps,
} from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.text6,
    padding: 6,
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: theme.palette.background.b7,
      '&.MuiIconButton-colorPrimary': {
        color: theme.palette.primary.main,
      },
    },
    '&:active': {
      color: '#FFFFFF',
      '&.MuiIconButton-colorPrimary': {
        color: theme.palette.primary.main,
      },
    },
    '&.Mui-disabled': {
      pointerEvents: 'all',
      opacity: 0.4,
      color: '#FFFFFF',
      '&.MuiIconButton-colorPrimary': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiSvgIcon-root': {
      color: 'inherit',
      fontSize: 'inherit',
    },
  },
  colorPrimary: {
    color: theme.palette.primary.main,
  },
  sizeSmall: {
    fontSize: 16,
    padding: 7,
  },
  sizeLarge: {
    '&.MuiButtonBase-root': {
      padding: 8,
    },
  },
  contained: {
    backgroundColor: theme.palette.background.b9,
  },
  containedDisabled: {
    '&.MuiButtonBase-root': {
      backgroundColor: theme.palette.background.b9,
    },
  },
  transparent: {
    color: theme.palette.primary.contrastText,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  transparentDisabled: {
    '&.MuiButtonBase-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  tooltip: { top: '-10px !important' },
  active: {
    '&.MuiButtonBase-root': {
      color: theme.palette.primary.text1,
      backgroundColor: theme.palette.background.b9,
      '&.MuiIconButton-colorPrimary': {
        color: theme.palette.primary.main,
      },
      '&.transparent': {
        color: theme.palette.primary.contrastText,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
  tooltipTransparent: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));

interface IconButtonProps
  extends Omit<MuiIconButtonProps, 'size' | 'variant' | 'classes'>,
    PropTypes.InferProps<typeof iconButtonPropTypes> {
  size?: 'small' | 'medium' | 'large';
  variant?: 'transparent' | 'contained' | 'default';
}

const IconButton = ({
  tooltipProps = { title: undefined },
  isActive,
  ...otherProps
}: IconButtonProps): JSX.Element => {
  const { size, variant, classes = {}, 'data-testid': dataTestId } = otherProps;
  const styles = useStyles();

  const [isTooltipShown, setIsTooltipShown] = useState(false);

  const buttonClasses = {
    ...classes,
    root: classNames(classes.root, styles.root, {
      [styles.sizeLarge]: size === 'large',
      [styles.contained]: variant === 'contained',
      [styles.transparent]: variant === 'transparent',
    }),
    disabled: classNames(classes.disabled, {
      [styles.containedDisabled]: variant === 'contained',
      [styles.transparentDisabled]: variant === 'transparent',
    }),
    colorPrimary: classNames(classes.colorPrimary, styles.colorPrimary),
    sizeSmall: classNames(classes.sizeSmall, styles.sizeSmall),
  };

  return tooltipProps.title ? (
    <Tooltip
      open={isTooltipShown}
      classes={{ popper: styles.tooltipTransparent }}
      {...(tooltipProps as TooltipProps)}
    >
      <MuiIconButton
        data-testid={`${dataTestId}_${tooltipProps.title}`}
        classes={buttonClasses}
        className={classNames({ [styles.active]: isActive }, variant)}
        onPointerOver={() => setIsTooltipShown(true)}
        onPointerOut={() => setIsTooltipShown(false)}
        {...(otherProps as MuiIconButtonProps)}
      />
    </Tooltip>
  ) : (
    <MuiIconButton
      data-testid={dataTestId}
      classes={buttonClasses}
      className={classNames({ [styles.active]: isActive }, variant)}
      {...(otherProps as MuiIconButtonProps)}
    />
  );
};

const iconButtonPropTypes = {
  isActive: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'contained', 'transparent']),
  tooltipProps: PropTypes.shape({ title: PropTypes.string }),
  classes: PropTypes.shape({
    root: PropTypes.string,
    disabled: PropTypes.string,
    colorPrimary: PropTypes.string,
    sizeSmall: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  'data-testid': PropTypes.string,
};

IconButton.propTypes = iconButtonPropTypes;

IconButton.defaultProps = {
  isActive: false,
  size: 'medium',
  variant: 'default',
  tooltipProps: { title: undefined },
  disabled: false,
  'data-testid': 'IconButton',
};

export default IconButton;
