import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import classnames from 'classnames';
import { AppHeader, AppFilterPanelLayout } from '@corva/ui/components';

import LogoSVG from '~/assets/logo.svg';

import { getStatusTimestamp } from './utils/datetime';
import { useAppSettings } from './effects/useAppSettings';
import Filters from './components/Filters';
import ChartContent from './components/Chart';
import CriticalTable from './components/CriticalTable';
import RealTimeBox from './components/RealTimeBox';
import Toolbar from './components/Toolbar';
import AppProvider from './components/AppProvider';
import OffsetPicker from './components/OffsetPicker';
import LastDataUpdate from './components/Footer/LastDataUpdate';
import StatusBadge from './components/Footer/StatusBadge';

import styles from './App.css';

function App(props) {
  const { well, appHeaderProps, timestamp, currentUser, app, devCenterRouter, coordinates } = props;

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isAddChannelDialogOpen, setIsAddChannelDialogOpen] = useState(false);

  const { appSettings, onAppSettingChange, onAppSettingsChange } = useAppSettings(props);

  const queryTimestamp = useMemo(() => {
    return timestamp || getStatusTimestamp(get(devCenterRouter, ['location', 'query', 'query']));
  }, [devCenterRouter, timestamp]);

  return (
    <div className={styles.container}>
      <AppHeader
        {...appHeaderProps}
        showLastAnnotation={false}
        logoSrc={LogoSVG}
        classes={{ appHeader: styles.appHeader }}
      >
        <OffsetPicker
          currentUser={currentUser}
          well={well}
          appSettings={appSettings}
          updateAppSettings={onAppSettingChange}
        />
      </AppHeader>
      <AppProvider
        currentUser={currentUser}
        queryTimestamp={queryTimestamp}
        currentAsset={well}
        app={app}
        appSettings={appSettings}
        onAppSettingChange={onAppSettingChange}
        onAppSettingsChange={onAppSettingsChange}
      >
        <div className={styles.contentWrapper}>
          <AppFilterPanelLayout
            sideBarProps={{
              openedDrawerWidth: 240,
              isOpen: isDrawerOpen,
              setIsOpen: setIsDrawerOpen,
              header: <span>filters</span>,
              onAllOptionsClick: () => {},
            }}
            sideBarContent={<Filters />}
            classes={{ contentWrapper: styles.appContentWrapper }}
            appSettingsPopoverProps={{
              defaultScrollable: true,
              maxHeight: 480,
            }}
          >
            <div className={styles.content}>
              <Toolbar
                setIsAddChannelDialogOpen={setIsAddChannelDialogOpen}
                settings={appSettings.settings}
                onAppSettingChange={onAppSettingChange}
              />
              <div className={styles.viewWrapper}>
                <div
                  className={classnames(styles.graphContainer, {
                    [styles.visible]: appSettings.settings.graph,
                    [styles.fullVisible]: appSettings.settings.graph && !appSettings.settings.table,
                  })}
                >
                  <ChartContent />
                  <RealTimeBox
                    isAddChannelDialogOpen={isAddChannelDialogOpen}
                    setIsAddChannelDialogOpen={setIsAddChannelDialogOpen}
                  />
                </div>
                <div
                  className={classnames(styles.tableContainer, {
                    [styles.visible]: appSettings.settings.table,
                    [styles.fullVisible]: !appSettings.settings.graph && appSettings.settings.table,
                  })}
                >
                  <CriticalTable />
                </div>
              </div>
              <div className={styles.appFooter}>
                <StatusBadge
                  appId={app?.app?.id || 1}
                  appHeight={coordinates.pixelHeight}
                  appWidth={coordinates.pixelWidth}
                  currentUser={props.currentUser}
                  currentAsset={well}
                />
                <LastDataUpdate />
              </div>
            </div>
          </AppFilterPanelLayout>
        </div>
      </AppProvider>
    </div>
  );
}

App.propTypes = {
  well: PropTypes.shape({}),
  appHeaderProps: PropTypes.shape({}).isRequired,
  app: PropTypes.shape({ app: PropTypes.shape({ id: PropTypes.number }) }).isRequired,
  timestamp: PropTypes.number,
  coordinates: PropTypes.shape({
    pixelHeight: PropTypes.number.isRequired,
    pixelWidth: PropTypes.number.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({}).isRequired,
  devCenterRouter: PropTypes.shape({ location: PropTypes.shape({}) }).isRequired,
};

App.defaultProps = {
  well: null,
  timestamp: null,
};

export default App;
