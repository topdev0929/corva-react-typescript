import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';

enum MODES {
  STANDARD,
  FULL_SCREEN,
}

export const FullScreenToggle = observer(() => {
  const store = useGlobalStore();

  const onTabChange = (event, active) => {
    if (active === MODES.STANDARD) {
      store.turnOffFullScreen();
    } else {
      store.turnOnFullScreen();
    }
  };

  return (
    <ToggleButtonGroup
      value={store.isFullScreen ? MODES.FULL_SCREEN : MODES.STANDARD}
      onChange={onTabChange}
      size="small"
      exclusive
    >
      <ToggleButton value={MODES.STANDARD}>Standard</ToggleButton>
      <ToggleButton value={MODES.FULL_SCREEN}>Full Screen</ToggleButton>
    </ToggleButtonGroup>
  );
});
