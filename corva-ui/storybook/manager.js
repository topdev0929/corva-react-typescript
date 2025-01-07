/* eslint-disable import/no-extraneous-dependencies */

import { addons } from '@storybook/addons';
import corvaTheme from './corvaTheme';

addons.setConfig({
  theme: corvaTheme,
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: 'bottom',
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  showRoots: false,
  inlineStories: true,
});
