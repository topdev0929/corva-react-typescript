import { useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Notifications as NotificationsComponent } from '~/components/Notifications';

import { Variant } from './types';

type ShowNotification = (message: ReactNode, options: {}) => string;
interface Notification {
  autoHideDuration: number;
  content: ReactNode;
  id: string;
  variant: Variant;
}

export const NotificationsContainer = () => {
  const [notificationToasts, setNotificationToasts] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotificationToasts(prevNotificationToasts => [...prevNotificationToasts, notification]);
  };

  const removeNotification = (id: string) => {
    setNotificationToasts(prevNotificationToasts =>
      prevNotificationToasts.filter(toast => toast.id !== id)
    );
  };

  const createNotification = (variant: Variant, message: ReactNode, options = {}): string => {
    const mapVariantToContent = {
      info: 'Info',
      error: 'Error',
      warning: 'Warning',
      success: 'Success',
      neutral: 'Neutral',
    };

    const DEFAULT_AUTO_HIDE_DURATION = 3000;
    const notification = {
      autoHideDuration: DEFAULT_AUTO_HIDE_DURATION,
      content: message || mapVariantToContent[variant] || 'info',
      id: uuidv4(),
      variant,
      ...options,
    };

    addNotification(notification);
    return notification.id;
  };

  const showSuccessNotification: ShowNotification = (message, options) =>
    createNotification('success', message, options);

  const showErrorNotification: ShowNotification = (message, options) =>
    createNotification('error', message, options);

  const showWarningNotification: ShowNotification = (message, options) =>
    createNotification('warning', message, options);

  const showInfoNotification: ShowNotification = (message, options) =>
    createNotification('info', message, options);

  const showNeutralNotification: ShowNotification = (message, options) =>
    createNotification('neutral', message, options);

  useEffect(() => {
    window[Symbol.for('notificationToasts')] = {
      createNotification: addNotification,
      removeNotification,
      showErrorNotification,
      showInfoNotification,
      showNeutralNotification,
      showSuccessNotification,
      showWarningNotification,
    };
  }, []);

  return (
    <NotificationsComponent
      notifications={notificationToasts}
      removeNotification={removeNotification}
    />
  );
};
