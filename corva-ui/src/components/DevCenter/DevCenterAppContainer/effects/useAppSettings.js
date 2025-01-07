import { useState } from 'react';

function useAppSettings({ setIsFullscreenModalMode }) {
  const [isAppSettingsDialogOpened, setAppSettingsDialogOpened] = useState(false);
  const toggleAppSettingsDialog = async () => {
    const nextValue = !isAppSettingsDialogOpened;

    if (nextValue) {
      await setIsFullscreenModalMode(nextValue);
      setAppSettingsDialogOpened(nextValue);
    } else {
      setAppSettingsDialogOpened(nextValue);
      setIsFullscreenModalMode(nextValue);
    }
  };

  return { isAppSettingsDialogOpened, toggleAppSettingsDialog };
}

export default useAppSettings;
