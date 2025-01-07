import { useState, useEffect, ReactElement } from 'react';

import { Toaster } from './Toaster';
import { ToasterType } from './types';

type createToast = (message: ReactElement, autoHideDuration?: number) => void;

export const DEVCENTER_TOASTS_SYMBOL = Symbol.for('devcenterToasts');

export const ToastContainer = () => {
  const [toaster, setToaster] = useState<ToasterType>(null);

  const removeToast = () => setToaster(null);

  const createToast: createToast = (message, autoHideDuration) =>
    setToaster({ message, autoHideDuration });

  const showToast = createToast;

  useEffect(() => {
    window[DEVCENTER_TOASTS_SYMBOL] = {
      createToast,
      removeToast,
      showToast,
    };
  }, []);

  if (!toaster) return null;

  return (
    <Toaster
      message={toaster.message}
      autoHideDuration={toaster.autoHideDuration}
      onDismiss={removeToast}
    />
  );
};
