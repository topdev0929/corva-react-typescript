import PropTypes from 'prop-types';

import { Launch as LaunchIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

import styles from './FullscreenButton.css';

const FullscreenButton = ({ setIsMaximized }) => (
  <IconButton className={styles.menuIcon} onClick={() => setIsMaximized(true)}>
    <LaunchIcon />
  </IconButton>
);

FullscreenButton.propTypes = {
  setIsMaximized: PropTypes.func.isRequired,
};

export default FullscreenButton;
