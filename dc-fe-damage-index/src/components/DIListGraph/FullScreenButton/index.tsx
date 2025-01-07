import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons';
import { observer } from 'mobx-react-lite';

import { useGlobalStore } from '@/contexts/global';
import { Theme } from '@/shared/types';

const useStyles = makeStyles<Theme>(theme => ({
  fullscreenIcon: {
    backgroundColor: theme.palette.background.b6,
    borderRadius: 4,
    padding: 6,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.text1,
    },
  },
  fullscreenButton: {
    position: 'absolute',
    zIndex: 3,
    right: 16,
    top: 16,
  },
}));

export const FullscreenButton = observer(() => {
  const styles = useStyles();
  const store = useGlobalStore();

  const toggleFullscreen = () => {
    if (store.isFullScreen) {
      store.turnOffFullScreen();
    } else {
      store.turnOnFullScreen();
    }
  };

  return (
    <div className={styles.fullscreenButton}>
      <Tooltip title={store.isFullScreen ? 'Collapse Chart' : 'Expand Chart'} placement="left">
        <IconButton className={styles.fullscreenIcon} onClick={toggleFullscreen}>
          {store.isFullScreen ? (
            <FullscreenExitIcon fontSize="small" />
          ) : (
            <FullscreenIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
});

FullscreenButton.displayName = 'FullscreenButton';
