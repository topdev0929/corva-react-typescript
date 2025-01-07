import { createContext } from 'react';
import { SETTINGS_KEY } from './constants';

export default createContext({
  horizontal: false,
  settingsKey: SETTINGS_KEY,
  settings: {
    [SETTINGS_KEY]: []
  },
  onSettingsChange: () => {}
});
