import { ReactNode } from 'react';
import { makeStyles, useTheme } from '@material-ui/core';
import classNames from 'classnames';
import FilterListIcon from "@material-ui/icons/FilterList";

import AppSideBarComponent, { AppSideBarProps } from '~/components/DevCenter/AppSideBar/AppSideBar';
import {
  AppSettingsPopover,
  AppSettingsPopoverProps,
} from '~/components/DevCenter/AppSettingsPopover/AppSettingsPopover';
import Button, { ButtonProps } from '~/components/Button';
import { useMatchAppContainerSize } from '~/effects/useMatchAppContainerSize';
import { isMobileDetected, isNativeDetected } from '~/utils/mobileDetect';

const useStyles = makeStyles({
  appLayout: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  header: {
    paddingLeft: 12,
    paddingRight: 12,
    display: 'flex',
    height: 36,
  },
  contentWrapper: {
    display: 'flex',
    position: 'relative',
    flexGrow: 1,
    height: 'calc(100% - 36px)', // NOTE: 36px is header height
    '@media (max-width: 960px)': {
      height: '100%',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  popoverContent: {
    padding: '0 16px',
  },
});

export interface AppFilterPanelLayoutProps {
  appSettingsPopoverProps?: AppSettingsPopoverProps;
  children: ReactNode;
  classes: {
    appLayout?: string;
    content?: string;
    contentWrapper?: string;
    header?: string;
  };
  header?: ReactNode;
  sideBarContent: ReactNode;
  sideBarProps?: AppSideBarProps;
}

export const AppFilterPanelLayout = ({
  appSettingsPopoverProps,
  children,
  classes = {},
  header,
  sideBarContent,
  sideBarProps,
}: AppFilterPanelLayoutProps): JSX.Element => {
  const styles = useStyles();
  const theme = useTheme();

  const isTabletView = useMatchAppContainerSize({
    width: { max: theme.breakpoints.width('md') },
  });
  const showFilterButton = isNativeDetected || isMobileDetected || isTabletView;

  return (
    <div className={classNames(styles.appLayout, classes.appLayout)}>
      {showFilterButton && (
        <div className={classNames(styles.header, classes.header)}>
          <AppSettingsPopover
            Trigger={(props: ButtonProps) => (
              <Button startIcon={<FilterListIcon />} {...props}>
                Filters
              </Button>
            )}
            classes={{ popoverContent: styles.popoverContent }}
            header="Filters"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            {...appSettingsPopoverProps}
          >
            {sideBarContent}
          </AppSettingsPopover>
          {header}
        </div>
      )}
      <div className={classNames(styles.contentWrapper, classes.contentWrapper)}>
        {!showFilterButton && (
          <AppSideBarComponent {...sideBarProps} anchor="left">
            {sideBarContent}
          </AppSideBarComponent>
        )}
        <div className={classNames(styles.content, classes.content)}>{children}</div>
      </div>
    </div>
  );
};
