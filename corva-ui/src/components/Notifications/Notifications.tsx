import { ReactNode } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

import { Toast } from './Toast';
import { Notification } from './types';

interface NotificationsProps {
  removeNotification: (id: string) => void;
  notifications: Notification[];
}

export const Notifications = ({
  notifications,
  removeNotification,
}: NotificationsProps): JSX.Element => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open
      ClickAwayListenerProps={{ onClickAway: e => e.stopPropagation() }}
    >
      <div>
        {notifications.map(toast => (
          // @ts-ignore
          <Toast key={toast.id} onDismissClick={removeNotification} toast={toast} />
        ))}
      </div>
    </Snackbar>
  );
};
