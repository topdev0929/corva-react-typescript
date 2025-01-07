import classNames from 'classnames';
import { makeStyles, TooltipProps, Theme } from '@material-ui/core';
import { Tooltip } from './Tooltip';
import { ReactNode } from 'react';

const useStyles = makeStyles<Theme, { staticTitleHeight: number }>(theme => ({
  popper: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: theme.palette.background.b8,
      margin: 12,
      // NOTE: interactive Tooltip is set 5px from the window top so in total it will result in 12px margin
      marginTop: '7px !important',
      maxHeight: 'calc(100vh - 24px)',
      maxWidth: 500,
      padding: 0,
    },
  },
  staticTitle: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: '0.4px',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    padding: '8px 8px 0 8px',
  },
  titleWrapper: {
    position: 'relative',
    '&::before, &::after': {
      content: '""',
      height: 16,
      position: 'absolute',
      width: '100%',
    },
    '&::before': {
      background: `linear-gradient(180deg, ${theme.palette.background.b8} 18.23%, rgba(59, 59, 59, 0) 100%)`,
      opacity: 0.8,
      top: 0,
    },
    '&::after': {
      background: `linear-gradient(0deg, ${theme.palette.background.b8} 18.23%, rgba(59, 59, 59, 0) 100%)`,
      bottom: 0,
      opacity: 0.8,
    },
  },
  title: {
    maxHeight: ({ staticTitleHeight = 0 }) => `calc(100vh - ${staticTitleHeight + 24}px)`,
    overflowY: 'auto',
    padding: '8px 16px 8px 8px',
  },
}));

interface ScrollableTooltip extends Omit<TooltipProps, 'classes' | 'title'> {
  classes?: TooltipProps['classes'];
  popperClassName?: string;
  staticTitle?: ReactNode;
  staticTitleHeight?: number;
  title: ReactNode;
  titleClassName?: string;
  titleWrapperClassName?: string;
}

export const ScrollableTooltip = ({
  classes: classesProp = {},
  popperClassName = '',
  staticTitle = '',
  staticTitleHeight = 0,
  title,
  titleClassName = '',
  titleWrapperClassName = '',
  ...props
}: ScrollableTooltip): JSX.Element => {
  const classes = useStyles({ staticTitleHeight: staticTitle ? staticTitleHeight || 24 : 0 });

  return (
    <Tooltip
      interactive
      isFullScreen={false}
      title={
        staticTitle || title ? (
          <>
            {staticTitle && <div className={classes.staticTitle}>{staticTitle}</div>}
            <div className={classNames(classes.titleWrapper, titleWrapperClassName)}>
              <div className={classNames(classes.title, titleClassName)}>{title}</div>
            </div>
          </>
        ) : (
          ''
        )
      }
      classes={{
        ...classesProp,
        popper: classNames(classes.popper, classesProp.popper, popperClassName),
      }}
      {...props}
    />
  );
};
