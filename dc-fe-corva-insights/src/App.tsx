import { AppHeader } from '@corva/ui/components';
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';

import { User } from '@/entities/user';
import { GlobalProvider } from '@/contexts/global';
import { Main } from '@/components/Main';

import styles from './App.module.css';

type Props = {
  appHeaderProps: { [key: string]: any; app: { [key: string]: any } };
  // eslint-disable-next-line camelcase
  well: { asset_id: number; id: string; name: string };
  // eslint-disable-next-line camelcase
  currentUser: { company_id: number };
  coordinates: { pixelWidth: number; pixelHeight: number };
  devCenterRouter: { location: { query: { [key: string]: any } } };
  app: { settings: { [key: string]: any }; id: number };
  onSettingChange: (key: string, value: unknown) => void;
  isNative: boolean;
};

function convertToUser(data: any): User {
  return {
    id: data.id,
    companyId: data.company_id,
    profilePhoto: data.profile_photo,
    firstName: data.first_name,
    lastName: data.last_name,
  };
}

function App(props: Props): JSX.Element {
  const {
    appHeaderProps,
    well,
    currentUser,
    isNative,
    app: { id: appId },
  } = props;

  return (
    <GlobalProvider
      assetId={well.asset_id}
      user={convertToUser(currentUser)}
      currentUser={currentUser}
      appWidth={props.coordinates.pixelWidth}
      isNative={isNative}
      appId={appId}
    >
      <IconProvider value={{ ...DEFAULT_ICON_CONFIGS, size: '16px' }}>
        <div className={styles.container}>
          <AppHeader {...appHeaderProps} classes={{ appHeader: styles.appHeader }} />
          <div className={styles.content}>
            <Main appSettings={props.app.settings} />
          </div>
        </div>
      </IconProvider>
    </GlobalProvider>
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
