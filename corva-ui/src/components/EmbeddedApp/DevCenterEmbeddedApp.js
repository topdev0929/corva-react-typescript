import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isNativeDetected } from '~/utils/mobileDetect';
import { Size } from '~/constants/sizes';
import { DevCenterIsolatedApp } from '~/components/DevCenter/IsolatedDevCenterAppContainer/DevCenterIsolatedApp';

import { AppInfo, AppInfoMaximized } from './components/AppInfo';

import styles from './styles.css';

const DevCenterEmbeddedApp = ({
  app,
  coordinates,
  appId,
  appSize,
  appContainerClassName,
  currentUser,
  timestamp,
}) => {
  const [maximized, setMaximized] = useState(false);

  return (
    <div
      className={classNames(styles.embeddedApp, appContainerClassName, {
        [styles.embeddedAppMaximized]: maximized,
        [styles.embeddedAppNative]: isNativeDetected,
      })}
    >
      {!maximized && <AppInfo setMaximized={setMaximized} />}

      <div className={styles.embeddedAppContent} key={maximized ? Size.XLARGE : appSize}>
        <DevCenterIsolatedApp
          app={app}
          appId={appId}
          onSettingsChange={() => undefined}
          onSettingChange={() => undefined}
          onAppRemove={() => undefined}
          coordinates={coordinates}
          currentUser={currentUser}
          timestamp={timestamp}
        />
      </div>

      {maximized && <AppInfoMaximized setMaximized={setMaximized} />}
    </div>
  );
};

DevCenterEmbeddedApp.propTypes = {
  appContainerClassName: PropTypes.string,
  appId: PropTypes.number,
  appSize: PropTypes.string,
  app: PropTypes.shape({
    coordinates: PropTypes.shape().isRequired,
  }).isRequired,
  currentUser: PropTypes.shape().isRequired,
  coordinates: PropTypes.shape(),
  timestamp: PropTypes.string,
};

DevCenterEmbeddedApp.defaultProps = {
  appContainerClassName: undefined,
  appId: 0,
  appSize: Size.MEDIUM,
  coordinates: {},
  timestamp: undefined,
};

export default memo(DevCenterEmbeddedApp);
