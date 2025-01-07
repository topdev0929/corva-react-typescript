import { memo, useContext } from 'react';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core';

import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import IconButton from '~/components/IconButton';

import { SidebarFooterProps } from './types';
import RealTimeSidebarContext from './RealTimeSidebarContext';
import { ORIENTATIONS } from './enums';

const useStyles = makeStyles((theme: any) => ({
  button: {
    fontSize: 14,
    fontWeight: 500,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  closedButton: {
    marginBottom: '50px',
  },

  rtSidebarFooter: {
    position: 'absolute',
    right: 0,
    '&.vertical': {
      left: 0,
      bottom: 0,
      boxShadow: `16px -16px 16px ${theme.palette.background.b5}`,
    },
    '&.horizontal': {
      top: 0,
    },
  },

  rtSidebarFooterIcon: {
    color: theme.palette.primary.text6,
  },

  rtSidebarFooterActions: {
    display: 'flex',
    paddingLeft: '14px',
    paddingRight: '5px',
    alignItems: 'center',

    '&.horizontal': {
      flexDirection: 'row-reverse',
    },
  },

  actionButton: {
    padding: 12,
  },
}));

function SidebarFooter({ onSidebarOpened, onSidebarClosed }: SidebarFooterProps) {
  const classes = useStyles();

  const { isSidebarOpen, orientation, handleOpenCloseDialog } = useContext(RealTimeSidebarContext);

  return (
    <div className={classNames(classes.rtSidebarFooter, orientation)} data-testid="sidebar_footer">
      {isSidebarOpen ? (
        <div className={classNames(classes.rtSidebarFooterActions, orientation)}>
          <IconButton
            data-testid="sidebar_close_button"
            onClick={onSidebarClosed}
            size="large"
            className={classes.actionButton}
          >
            {orientation === ORIENTATIONS.vertical ? (
              <ChevronRightIcon />
            ) : (
              <KeyboardArrowUpIcon className={classes.rtSidebarFooterIcon} />
            )}
          </IconButton>
          {orientation === ORIENTATIONS.horizontal && (
            <IconButton
              size="large"
              color="primary"
              tooltipProps={{ title: 'Add' }}
              onClick={() => handleOpenCloseDialog(true)}
              className={classes.actionButton}
            >
              <AddIcon />
            </IconButton>
          )}
        </div>
      ) : (
        <IconButton
          size="large"
          onClick={onSidebarOpened}
          data-testid="sidebar_open_button"
          classes={{ root: classes.actionButton }}
          className={classNames(classes.closedButton)}
        >
          {orientation === ORIENTATIONS.vertical ? <ChevronLeftIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      )}
    </div>
  );
}

export default memo(SidebarFooter);
