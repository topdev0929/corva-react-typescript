import { useState, ReactNode } from 'react';
import classNames from 'classnames';
// NOTE: it is important to import Popover form @mui and not from ~/components
import { makeStyles, PopoverProps, Popover } from '@material-ui/core';
import { Close as CloseIcon, Settings as SettingsIcon } from '@material-ui/icons';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import { isNativeDetected, isMobileDetected } from '~/utils/mobileDetect';
import IconButton from '~/components/IconButton';
import Modal from '~/components/Modal';
import Button from '~/components/Button';
import palette from '~/config/theme/palette.mjs';

const isNativeOrMobileBrowser = isNativeDetected || isMobileDetected;

const useStyles = makeStyles<
  Theme,
  { isScrollable: boolean; maxHeight: number; isNativeDetected: boolean }
>(theme => ({
  popoverPaper: {
    marginTop: ({ isScrollable }) => (isScrollable ? 0 : 8),
    minWidth: 286,
    width: 286,
    overflowY: 'hidden',
    backgroundColor: theme.palette.background.b9,
    maxHeight: ({ maxHeight }) => (maxHeight ? maxHeight - 24 : 'calc(100% - 24px)'),
    '&.scrollable': {
      height: ({ maxHeight }) => maxHeight || '100%',
    },
  },
  popoverHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 76,
    padding: '24px 16px 16px 16px',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    '&.scrollable': {
      background: `linear-gradient(to bottom, ${theme.palette.background.b9}, ${theme.palette.background.b9} 79%, rgba(65, 65, 65, 0) 100%)`,
    },
  },
  headerTitle: {
    fontSize: 20,
  },
  popoverContentContainer: {
    marginTop: 60,
    paddingTop: 16,
    overflowX: 'hidden',
    overflowY: 'auto',
    '&.scrollable': {
      height: 'calc(100% - 60px)',
    },
  },
  popoverContent: {
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 16,
    background: `linear-gradient(180deg, rgba(65, 65, 65, 0) 0%, ${theme.palette.background.b9} 100%)`,
  },
  modalRoot: {
    '& > div:first-child': {
      backgroundColor: 'transparent !important',
    },
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export interface AppSettingsPopoverProps extends PopoverProps {
  Trigger: ReactNode;
  children: ReactNode;
  classes: PopoverProps['classes'] & {
    popoverContent?: string;
  };
  defaultScrollable?: boolean;
  header?: ReactNode;
  iconSettingsProps?: {
    iconSize?: string;
    tooltipProps?: { title: string };
  };
  maxHeight?: number;
  modalActions?: ReactNode;
  modalProps?: {};
  onClose?: () => void;
}

export function AppSettingsPopover({
  Trigger,
  children,
  classes,
  defaultScrollable = false,
  header = 'Settings',
  iconSettingsProps = {},
  maxHeight = null,
  modalActions = null,
  modalProps = {},
  onClose = () => {},
  ...popoverProps
}: AppSettingsPopoverProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrollable, setIsScrollable] = useState(true);
  const styles = useStyles({ maxHeight, isScrollable, isNativeDetected });
  const { popoverContent: popoverContentClassName, ...popoverClasses } = classes || {};

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  const isOpen = Boolean(anchorEl);

  const handleContainerRef = containerEl => {
    if (containerEl) {
      if (containerEl.scrollHeight <= containerEl.clientHeight && !defaultScrollable)
        setIsScrollable(false);
    }
  };

  const handleTriggerClick = event => setAnchorEl(event.currentTarget);

  const actions = modalActions || (
    <Button variation="secondary" onClick={handleClose}>
      CLOSE
    </Button>
  );

  return (
    <>
      {Trigger ? (
        //@ts-ignore
        <Trigger onClick={handleTriggerClick} />
      ) : (
        <IconButton
          isActive={isOpen}
          onClick={handleTriggerClick}
          size="small"
          tooltipProps={{ title: 'Settings' }}
          variant="contained"
          {...iconSettingsProps}
        >
          <SettingsIcon />
        </IconButton>
      )}
      {!isNativeOrMobileBrowser && (
        <Popover
          open={isOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: isScrollable ? 'top' : 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          marginThreshold={12}
          {...popoverProps}
          classes={{
            ...popoverClasses,
            paper: classNames(
              styles.popoverPaper,
              isScrollable && 'scrollable',
              popoverClasses?.paper
            ),
          }}
        >
          <div className={classNames(styles.popoverHeader, isScrollable && 'scrollable')}>
            <div className={styles.headerTitle}>{header}</div>
            <IconButton tooltipProps={{ title: 'Close' }} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div
            className={classNames(styles.popoverContentContainer, isScrollable && 'scrollable')}
            ref={handleContainerRef}
          >
            <div className={classNames(styles.popoverContent, popoverContentClassName)}>
              {children}
            </div>
          </div>
          <div className={styles.shadow} />
        </Popover>
      )}
      {isNativeOrMobileBrowser && (
        <Modal
          actions={actions}
          onClose={handleClose}
          open={isOpen}
          rootClassName={styles.modalRoot}
          actionsClassName={styles.modalActions}
          title={header}
          {...modalProps}
        >
          {children}
        </Modal>
      )}
    </>
  );
}
