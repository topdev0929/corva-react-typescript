import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  subtitle: { color: theme.palette.primary.main, cursor: 'pointer' },
}));

function SubtitleWithIntercomLink({ openIntercom }) {
  const styles = useStyles();

  return (
    <span>
      This app failed to load. Try refreshing the page or{' '}
      <span className={styles.subtitle} onClick={() => openIntercom()}>
        contact support
      </span>
      .
    </span>
  );
}

SubtitleWithIntercomLink.propTypes = {
  openIntercom: PropTypes.func.isRequired,
};

export default SubtitleWithIntercomLink;
