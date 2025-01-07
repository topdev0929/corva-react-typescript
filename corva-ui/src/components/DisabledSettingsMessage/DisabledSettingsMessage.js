import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  messageContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  bottomAligned: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  textContent: {
    color: theme.palette.primary.text6,
  },
}));

function DisabledSettingsMessage({ onCloneDashboard }) {
  const styles = useStyles();

  return (
    <div className={classNames(styles.messageContainer, onCloneDashboard && styles.bottomAligned)}>
      <Typography className={styles.textContent} variant="body1" gutterBottom>
        Settings are not available. This is a shared dashboard, which means it&apos;s been locked
        for editing. Make a copy of this dashboard and get access to all editing features.
      </Typography>
      {onCloneDashboard && (
        <Button
          color="primary"
          variant="contained"
          // this fn comes from parent window through an iframe.
          // It's important to call it without native event as it's not possible
          // to pass it through the iframe, because it contains circular dependencies
          onClick={() => onCloneDashboard()}
        >
          Copy Dashboard
        </Button>
      )}
    </div>
  );
}

DisabledSettingsMessage.propTypes = {
  onCloneDashboard: PropTypes.func.isRequired,
};

export default DisabledSettingsMessage;
