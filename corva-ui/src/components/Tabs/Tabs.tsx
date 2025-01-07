import { Tabs as MuiTabs, makeStyles, Theme, TabsProps as MuiTabsProps } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiTab-root': {
      paddingLeft: 16,
      paddingRight: 16,
      '&.Mui-disabled': {
        color: theme.palette.primary.text1,
      },
    },
  },
  rootCompact: {
    '& .MuiTab-root': {
      minWidth: 0,
    },
  },
  root_filled: {
    backgroundColor: theme.palette.background.b9,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
    '& .MuiTab-root': {
      color: theme.palette.primary.text6,
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: theme.palette.primary.contrastText,
        opacity: 1,
      },
    },
  },
  root_default: {
    minHeight: 42,
    '& .MuiTab-root': {
      color: theme.palette.primary.contrastText,
      minHeight: 42,
      opacity: 1,
      textTransform: 'none',
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
      '&:hover': {
        borderRadius: 4,
        backgroundColor: 'rgba(3, 188, 212, 0.15)',
      },
    },
  },
  root_filledTab: {
    minHeight: 42,
    '& .MuiTab-root': {
      borderRadius: 4,
      color: theme.palette.primary.contrastText,
      fontSize: 16,
      minHeight: 42,
      opacity: 1,
      textTransform: 'none',
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
      },
      '&:hover': {
        backgroundColor: 'rgba(3, 188, 212, 0.15)',
      },
      '&.Mui-disabled': {
        color: theme.palette.primary.text9,
      },
    },
  },
  tabIndicatorRoot: {
    height: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tabIndicatorFilledTab: {
    display: 'none',
  },
  scrollButtonsRoot: {
    backgroundColor: theme.palette.background.b9,
    height: 48,
    zIndex: 1,
    '&.Mui-disabled': {
    },
    '&:first-of-type': {
      '&::after': {
        background: `linear-gradient(to right, rgba(60, 59, 59, 0.8) 39.13%, rgba(58, 58, 58, 0) 100%)`,
        content: '""',
        display: 'block',
        height: '100%',
        left: 40,
        position: 'absolute',
        width: 16,
        zIndex: 1,
      },
    },
    '&:last-of-type': {
      '&::before': {
        background: 'linear-gradient(to left, rgba(60, 59, 59, 0.8) 39.13%, rgba(58, 58, 58, 0) 100%)',
        content: '""',
        display: 'block',
        height: '100%',
        position: 'absolute',
        right: 40,
        width: 16,
        zIndex: 1,
      },
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.text6,
    },
  },
}));

interface TabsProps extends Omit<MuiTabsProps, 'type' | 'TabIndicatorProps'> {
  compact?: boolean;
  type?: 'default' | 'filled' | 'filledTab';
  TabIndicatorProps?: Partial<React.HTMLAttributes<HTMLDivElement>> & {
    classes: {
      root: string;
    }
  };
}

const Tabs = ({ compact, type, ...TabsProps }: TabsProps): JSX.Element => {
  const styles = useStyles();

  const { classes, TabIndicatorProps } = TabsProps;

  return (
    <MuiTabs
      {...TabsProps}
      classes={{
        ...classes,
        root: classNames(
          classes?.root,
          styles.root,
          styles[`root_${type}`],
          { [styles.rootCompact]: compact },
        ),
        scrollButtons: classNames(classes?.scrollButtons, styles.scrollButtonsRoot),
      }}
      indicatorColor="primary"
      TabIndicatorProps={{
        ...TabIndicatorProps,
        //@ts-ignore
        classes: {
          root: classNames(
            TabIndicatorProps?.classes?.root,
            styles.tabIndicatorRoot,
            { [styles.tabIndicatorFilledTab]: type === 'filledTab' }
          )
        }
      }}
    />
  );
};

Tabs.propTypes = {
  type: PropTypes.oneOf(['default', 'filled', 'filledTab']),
  compact: PropTypes.bool,
};

Tabs.defaultProps = {
  type: 'default',
  compact: false,
};

export default Tabs;
