import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon, IconButton } from '@material-ui/core';

import { isNativeDetected } from '~/utils/mobileDetect';

import styles from './RestoreAppSizeButton.css';

const PAGE_NAME = 'DevCenter_AppContainer';

function RestoreAppSizeButton({ setIsMaximized }) {
  return (
    <div
      className={classNames(
        styles.containerRestoreAction,
        isNativeDetected && styles.containerRestoreActionNative
      )}
    >
      <IconButton
        data-testid={`${PAGE_NAME}_restore`}
        className={styles.iconButton}
        onClick={() => {
          setIsMaximized(false);
        }}
      >
        <Icon
          className={
            isNativeDetected ? styles.containerRestoreIconNative : styles.containerRestoreIcon
          }
        >
          close
        </Icon>
      </IconButton>
    </div>
  );
}

RestoreAppSizeButton.propTypes = {
  setIsMaximized: PropTypes.func.isRequired,
};

export default RestoreAppSizeButton;
