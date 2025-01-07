import { forwardRef } from 'react';
import classNames from 'classnames';

import { Grid, Switch, Typography, Tooltip, Theme, makeStyles } from '@material-ui/core';

import { SwitchControlTypes } from './types';

import styles from './style.css';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    width: 60,
    height: 40,
    padding: 13,
    '&.MuiSwitch-sizeSmall': { width: 52, height: 36, padding: 13 },
    '& .MuiSwitch-switchBase': { padding: 10 },
  },
  switchBase: {
    padding: 10,
    color: '#03BCD4',
    '&.MuiIconButton-root:hover': {
      backgroundColor: 'rgba(3, 188, 212, 0.08)',
    },
  },
  switchBaseDisabled: {
    color: '#196069 !important',
  },
  track: {
    backgroundColor: '#196069 !important',
    opacity: '1 !important',
    border: 'none',
  },
  trackDisabled: {
    backgroundColor: '#223D40 !important',
    opacity: '1 !important',
    border: 'none',
  },
  switchBaseDisabledNoLabels: {
    color: '#545454 !important',
  },
  trackDisabledNoLabels: {
    backgroundColor: '#3D3D3D !important',
    opacity: '1 !important',
    border: 'none',
  },
  label: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '16px',
    lineHeight: '22px',
    color: theme.palette.primary.text7,
    margin: '8px 0px',
    cursor: 'pointer',
  },
  labelSmall: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  disabledLabel: {
    cursor: 'default',
    color: '#808080',
  },
  activeLabel: {
    color: theme.palette.primary.text1,
  },
}));

export const SwitchControlComponent = forwardRef<HTMLButtonElement, SwitchControlTypes>(
  (
    {
      title,
      leftLabel,
      rightLabel,
      checked,
      onChange,
      disabled,
      size,
      className,
      rightLabelTooltip,
      leftLabelTooltip,
      customClasses,
      'data-testid': dataTestId,
    },
    ref
  ) => {
    const classes = useStyles();
    const isSwitchWithLabels = leftLabel && rightLabel;
    const { root, track, switchBase, ...restSwitchClasses } = customClasses;

    return (
      <div className={className}>
        {title && <div className={styles.switchControlTitle}>{title}</div>}
        <Grid component="label" container alignItems="center" spacing={0}>
          {leftLabel && (
            <Grid item>
              <Tooltip title={leftLabelTooltip}>
                <Typography
                  variant="body2"
                  className={classNames(
                    classes.label,
                    size === 'small' && classes.labelSmall,
                    (!checked || !rightLabel) && !disabled && classes.activeLabel,
                    disabled && classes.disabledLabel
                  )}
                >
                  {leftLabel}
                </Typography>
              </Tooltip>
            </Grid>
          )}
          <Grid item>
            <Switch
              data-testid={`${dataTestId}_switch_${checked}`}
              ref={ref}
              checked={checked}
              onChange={onChange}
              color="primary"
              disabled={disabled}
              classes={{
                root: classNames(classes.root, root),
                switchBase: classNames(
                  {
                    [classes.switchBase]: isSwitchWithLabels || (checked && !disabled),
                    [classes.switchBaseDisabled]: disabled && (isSwitchWithLabels || checked),
                    [classes.switchBaseDisabledNoLabels]:
                      !isSwitchWithLabels && disabled && !checked,
                  },
                  switchBase
                ),
                track: classNames(
                  {
                    [classes.track]: isSwitchWithLabels || (checked && !disabled),
                    [classes.trackDisabled]: disabled && (isSwitchWithLabels || checked),
                    [classes.trackDisabledNoLabels]: !isSwitchWithLabels && disabled && !checked,
                  },
                  track
                ),
                ...restSwitchClasses,
              }}
              size={size}
            />
          </Grid>
          {rightLabel && (
            <Grid item>
              <Tooltip title={rightLabelTooltip}>
                <Typography
                  variant="body2"
                  className={classNames(
                    classes.label,
                    size === 'small' && classes.labelSmall,
                    (checked || !leftLabel) && !disabled && classes.activeLabel,
                    disabled && classes.disabledLabel
                  )}
                >
                  {rightLabel}
                </Typography>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
);

SwitchControlComponent.defaultProps = {
  title: '',
  leftLabel: '',
  rightLabel: '',
  disabled: false,
  size: 'medium',
  className: '',
  customClasses: {},
  rightLabelTooltip: '',
  leftLabelTooltip: '',
  'data-testid': 'SwitchControlComponent',
};

//@ts-ignore
export default SwitchControlComponent;
