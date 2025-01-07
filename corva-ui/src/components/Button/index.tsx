import { memo } from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton, makeStyles, Theme } from '@material-ui/core';
import { ButtonProps as MUIButtonProps } from '@material-ui/core/Button';
import classNames from 'classnames';

type Variation = 'primary' | 'secondary' | 'tertiary' | 'dangerPrimary' | 'dangerSecondary';

const mapVariationToMUIProps = (
  variation?: Variation
): { color?: 'primary'; variant?: 'contained' } => {
  return (
    {
      primary: {
        color: 'primary',
        variant: 'contained',
      },
      secondary: {
        color: 'primary',
      },
      dangerPrimary: {
        variant: 'contained',
      },
    }[variation] || {}
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dangerPrimary: {
    color: '#FFFFFF',
    backgroundColor: `${theme.palette.error.main} !important`,
    '&:hover': {
      backgroundColor: `${theme.palette.error.dark} !important`,
    },
  },
  dangerPrimaryDisabled: {
    backgroundColor: theme.palette.error.main,
    color: '#FFFFFF !important',
  },
  dangerSecondary: {
    color: `${theme.palette.error.main} !important`,
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.2)',
    },
  },
  dangerSecondaryDisabled: {
    color: theme.palette.error.main,
  },
}));

export interface ButtonProps extends MUIButtonProps {
  variation?: Variation;
}

const Button = (props: ButtonProps) => {
  const { classes = {}, variation, ...restProps } = props;
  const styles = useStyles();

  const buttonClasses = {
    ...classes,
    root: classNames(styles?.[variation], classes.root),
    disabled: classNames(styles?.[`${variation}Disabled`], classes.disabled),
  };

  const muiProps: MUIButtonProps = {
    classes: buttonClasses,
    ...mapVariationToMUIProps(props.variation),
    ...restProps,
  };

  return <MUIButton {...muiProps} />;
};

Button.defaultProps = {
  // NOTE: default is set to 'tertiary' to preserve existing MUI Button interface
  variation: 'tertiary',
};

export default memo(Button);
