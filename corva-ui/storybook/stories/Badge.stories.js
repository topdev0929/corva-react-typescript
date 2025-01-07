/* eslint-disable react/prop-types */

import { makeStyles, Typography, Grid, Tooltip, Badge as BadgeComponent } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '~/components/IconButton';

const useStyles = makeStyles({
  dotBadge: {
    backgroundColor: '#f44336',
    right: '10px',
    top: '7px',
    minWidth: 8,
    border: '2px solid #2C2C2C',
    borderRadius: '8px',
    boxSizing: 'content-box',
  },
  iconDotBadge: {
    boxSizing: 'content-box',
    backgroundColor: '#f44336',
    right: 8,
    top: 8,
    fontSize: '11px',
    fontWeight: 'normal',
    minWidth: 16,
    height: 16,
    border: '2px solid #2C2C2C',
    borderRadius: '16px',
    padding: 0,
  },
  iconDotBadgeDynamic: {
    boxSizing: 'content-box',
    backgroundColor: '#f44336',
    right: 4,
    top: 8,
    fontSize: '11px',
    fontWeight: 'normal',
    minWidth: 16,
    height: 16,
    border: '2px solid #2C2C2C',
    borderRadius: '16px',
    padding: '0px 3px',
  },
  feedButton: {
    padding: '8px 16px',
    '&:hover': { backgroundColor: '#1c1c1c !important' },
  },
});

export const Badge = () => {
  const styles = useStyles();

  return (
    <>
      <Grid
        container
        style={{ width: '100%', padding: 16, backgroundColor: '#272727' }}
        spacing={2}
      >
        <Grid item>
          <Typography variant="body" component="div">
            Dot Badge
          </Typography>
          <div style={{ padding: '16px 16px' }}>
            <BadgeComponent variant="dot" classes={{ badge: styles.dotBadge }}>
              <div className={styles.feedButton}>Feed</div>
            </BadgeComponent>
          </div>
        </Grid>
        <Grid item>
          <Typography variant="body" component="div">
            Icon Badge
          </Typography>

          <div style={{ padding: '16px 16px' }}>
            <BadgeComponent
              badgeContent={25}
              classes={{
                badge: styles.iconDotBadge,
              }}
            >
              <IconButton>
                <Tooltip title="Notification" placement="bottom">
                  <NotificationsIcon />
                </Tooltip>
              </IconButton>
            </BadgeComponent>
          </div>
          <div style={{ padding: '16px 16px' }}>
            <BadgeComponent
              badgeContent="99+"
              classes={{
                badge: styles.iconDotBadgeDynamic,
              }}
            >
              <IconButton>
                <Tooltip title="Notification" placement="bottom">
                  <NotificationsIcon />
                </Tooltip>
              </IconButton>
            </BadgeComponent>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default {
  title: 'Components/Badge',
  component: IconButton,
  argTypes: {
    '...muiIconButtonProps': {
      description:
        '<a href="https://v4.mui.com/api/icon-button/#iconbutton-api" target="_blank">MUI IconButton API</a>',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19111%3A91930',
    docs: {
      description: {
        component: '<div>A wrapper around MUI IconButton component wrapped in MUI Tooltip',
      },
    },
  },
};
