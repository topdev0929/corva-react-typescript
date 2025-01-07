import { cloneElement, useEffect } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import { SnackbarContent, Typography, Grow, Tooltip } from '@material-ui/core';

import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ReportProblemOutlined as ReportProblemOutlinedIcon,
  ReportOutlined as ReportOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@material-ui/icons';

import IconButton from '~/components/IconButton';
import { NOTIFICATION_VARIANTS } from '~/constants/notifications';

import { Notification } from './types';

import { useStyles } from './Toast.styles';

export const PAGE_NAME = 'NotificationPopup';

const icons = {
  [NOTIFICATION_VARIANTS.success]: CheckCircleOutlineIcon,
  [NOTIFICATION_VARIANTS.warning]: ReportProblemOutlinedIcon,
  [NOTIFICATION_VARIANTS.error]: ReportOutlinedIcon,
  [NOTIFICATION_VARIANTS.info]: InfoOutlinedIcon,
  [NOTIFICATION_VARIANTS.neutral]: CheckIcon,
};

interface ToastProps {
  onDismissClick: (id: string) => void;
  toast: Notification;
}

export const Toast = ({ onDismissClick, toast, ...other }: ToastProps): JSX.Element => {
  const {
    alertLevel,
    autoHideDuration = 3000,
    content,
    hideIcon,
    icon,
    id,
    onClick = noop,
    onClose = noop,
    timestamp,
    title,
    tooltipProps,
    variant = 'info',
  } = toast;

  useEffect(() => {
    const timeout = setTimeout(() => onDismissClick(id), autoHideDuration);

    return () => clearTimeout(timeout);
  }, []);

  const styles = useStyles();

  const Icon = icons[variant];

  return (
    <Grow appear in>
      <SnackbarContent
        classes={{
          root: classNames(
            styles.main,
            !alertLevel && styles[variant],
            alertLevel && styles.alertNotification,
            alertLevel && styles[`alertLevels-${alertLevel}`]
          ),
          action: styles.actionContainer,
          message: styles.messageContainer,
        }}
        aria-describedby="client-snackbar"
        message={
          <Tooltip
            {...tooltipProps}
            title={content}
            classes={{ tooltip: styles.tooltip }}
            placement="bottom"
          >
            <div
              id="client-snackbar"
              className={styles.messageWrapper}
              onClick={onClick}
              data-testid={`${PAGE_NAME}_status_${NOTIFICATION_VARIANTS[variant]}`}
            >
              {!hideIcon && (
                <div className={styles.iconWrapper}>
                  {icon ? (
                    cloneElement(icon, {
                      className: styles.icon,
                      nativeColor: '#fff',
                    })
                  ) : (
                    <Icon htmlColor="#fff" className={styles.icon} />
                  )}
                </div>
              )}
              <div className={styles.message}>
                <div className={styles.messageTop}>
                  {title && (
                    <Typography
                      data-testid={`${PAGE_NAME}_title`}
                      variant="subtitle2"
                      className={classNames(styles.title, { [styles.alertTitle]: alertLevel })}
                    >
                      {title}
                    </Typography>
                  )}
                  {timestamp && (
                    <Typography
                      className={classNames(styles.timestamp, !alertLevel && styles[variant])}
                    >
                      {timestamp}
                    </Typography>
                  )}
                </div>
                <div className={classNames(styles.messageContent, !alertLevel && styles[variant])}>
                  <Typography
                    data-testid={`${PAGE_NAME}_content`}
                    className={classNames(alertLevel ? styles.alertContent : styles.content)}
                  >
                    {content}
                  </Typography>
                </div>
              </div>
            </div>
          </Tooltip>
        }
        action={[
          <IconButton
            data-testid={`${PAGE_NAME}_closeButton`}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => {
              onClose();
              onDismissClick(id);
            }}
            size="small"
            // @ts-ignore
            tooltipProps={{ title: 'Close', classes: { tooltip: styles.tooltip } }}
            className={styles.closeIconButton}
          >
            <CloseIcon className={styles.closeIcon} htmlColor={alertLevel ? '#000' : '#fff'} />
          </IconButton>,
        ]}
        {...other}
      />
    </Grow>
  );
};
