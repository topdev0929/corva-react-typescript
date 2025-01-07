import { memo, useContext } from 'react';
import classNames from 'classnames';

import { makeStyles, Typography } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import RealTimeSidebarContext from './RealTimeSidebarContext';
import { ORIENTATIONS } from './enums';

const useStyles = makeStyles((theme: any) => ({
  iconWithText: {
    fontSize: 20,
    lineHeight: '20px',
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  icon: {
    fontSize: 20,
    lineHeight: '20px',
  },

  cTpRtSidebarTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '50px',
    justifyContent: 'normal',
    paddingLeft: '16px',
    zIndex: 1,
    position: 'absolute',

    '&.vertical': {
      width: '100%',
      boxShadow: `16px 16px 16px ${theme.palette.background.b5}`,
      borderBottom: `1px solid ${theme.palette.background.b7}`,
      color: theme.isLightTheme ? theme.palette.primary.text9 : theme.palette.primary.text1,
    },

    '&.horizontal': {
      color: theme.isLightTheme ? theme.palette.primary.text1 : theme.palette.primary.text6,
    },
  },
}));

function SidebarTitle() {
  const classes = useStyles();

  const { isSidebarOpen, orientation } = useContext(RealTimeSidebarContext);

  return (
    <div className={classNames(classes.cTpRtSidebarTitle, orientation)}>
      {isSidebarOpen || orientation === ORIENTATIONS.horizontal ? (
        <>
          <TimerIcon className={classes.iconWithText} />
          <Typography variant="body2" component="h4" className={classes.text}>
            Real-Time Values
          </Typography>
        </>
      ) : (
        <TimerIcon className={classes.icon} />
      )}
    </div>
  );
}

export default memo(SidebarTitle);
