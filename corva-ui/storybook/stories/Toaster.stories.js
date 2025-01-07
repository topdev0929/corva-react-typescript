import { useState, useEffect } from 'react';
import { TextField, Button, Grid, styled, makeStyles } from '@material-ui/core';
import { NotificationsContainer } from '~/components/Notifications';
import { ToastContainer } from '~/components/Toaster';
import {
  showErrorNotification,
  showSuccessNotification,
  showWarningNotification,
  showInfoNotification,
  showNeutralNotification,
} from '~/utils/notificationToasts';
import { showToast } from '~/utils/devcenterToasts';

const MINUTE = 60 * 10000;

const StyledButton = styled(Button)({ marginBottom: 16 });
const StyledTextField = styled(TextField)({ marginBottom: 16, width: '300px' });

export const Toaster = () => {
  const [text, setText] = useState('Hello notification');

  useEffect(() => {
    showErrorNotification('This is an error notification', { autoHideDuration: MINUTE });
    showWarningNotification('This is a warning notification', { autoHideDuration: MINUTE });
    showInfoNotification('This is an info notification', { autoHideDuration: MINUTE });
    showNeutralNotification('This is a neutral notification', { autoHideDuration: MINUTE });
    showSuccessNotification('This is a success notification', { autoHideDuration: MINUTE });
  }, []);

  return (
    <>
      <NotificationsContainer />
      <Grid container direction="column" alignItems="flex-start">
        <StyledTextField
          label="Notification message"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <StyledButton
          onClick={() => showErrorNotification(text, { autoHideDuration: MINUTE })}
          color="primary"
        >
          Show error notification
        </StyledButton>
        <StyledButton
          onClick={() => showWarningNotification(text, { autoHideDuration: MINUTE })}
          color="primary"
        >
          Show warning notification
        </StyledButton>
        <StyledButton
          onClick={() => showInfoNotification(text, { autoHideDuration: MINUTE })}
          color="primary"
        >
          Show info notification
        </StyledButton>
        <StyledButton
          onClick={() => showNeutralNotification(text, { autoHideDuration: MINUTE })}
          color="primary"
        >
          Show neutral notification
        </StyledButton>
        <StyledButton
          onClick={() => showSuccessNotification(text, { autoHideDuration: MINUTE })}
          color="primary"
          variant="contained"
        >
          Show success notification
        </StyledButton>
      </Grid>
    </>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: 480,
    flexDirection: 'column',
    backgroundColor: '#202020',
  },
  header: {
    height: 40,
    paddingTop: 12,
    paddingLeft: 12,
    flexShrink: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: 12,
    height: 'calc(100% - 36px)',
  },
});

export const SmallToaster = () => {
  const styles = useStyles();
  const [text, setText] = useState('Saved');
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.header}>My awesome app</div>
      <div className={styles.content}>
        <StyledTextField
          label="Notification message"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <StyledButton onClick={() => showToast(text)} color="primary" variant="contained">
          Show Toaster
        </StyledButton>
      </div>
    </div>
  );
};

export default {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=9597%3A20397',
  },
};
