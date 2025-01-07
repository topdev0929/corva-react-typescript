import classNames from 'classnames';
import { Tooltip, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: '4px',
    color: palette.primary.text6,
    background: palette.background.b6,
    marginBottom: '4px',
    '&:hover': {
      color: palette.primary.contrastText,
      background: palette.background.b7,
      cursor: 'pointer',
    },
    '&:active': {
      background: palette.background.b8,
      '& .MuiSvgIcon-root': {
        color: palette.primary.main,
      },
    },
    '& .MuiSvgIcon-root': {
      width: 16,
      height: 16,
    },
    '& .MuiSvgIcon-root:active': {
      color: palette.primary.main,
    },
  },
  isActive: {
    color: palette.primary.main,
    '&:hover': {
      color: palette.primary.main,
    },
  },
  isHidden: {
    visibility: 'hidden',
  },
  disabled: {
    cursor: 'not-allowed !important',
    '&:hover': {
      background: palette.background.b6,
    },
    '& .MuiSvgIcon-root': {
      color: `${palette.primary.text6} !important`,
    },
  },
}));

const ChartButton = ({
  onClick,
  className,
  children,
  tooltipProps,
  isActive,
  isHidden,
  disabled,
  ...otherProps
}) => {
  const classes = useStyles();

  const content = (
    <div
      className={classNames(classes.button, className, {
        [classes.isHidden]: isHidden,
        [classes.disabled]: disabled,
        [classes.isActive]: isActive,
      })}
      onClick={disabled ? null : onClick}
      {...otherProps}
    >
      {children}
    </div>
  );

  if (disabled) return content;

  return (
    <Tooltip placement="left" {...tooltipProps}>
      {content}
    </Tooltip>
  );
};

export default ChartButton;
