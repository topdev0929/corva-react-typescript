import { DIListProvider } from './contexts/di-list';
import { FiltersProvider } from './contexts/filters';
import { GlobalProvider } from './contexts/global';
import { Main } from './components/Main';
import { CustomAppHeader } from './components/AppHeader';
import styles from './App.module.css';

type Props = {
  appHeaderProps: { [key: string]: any };
  // eslint-disable-next-line camelcase
  well: { asset_id: number; id: string; name: string };
  // eslint-disable-next-line camelcase
  currentUser: { company_id: number };
  rig: { name: string };
  coordinates: { pixelHeight: number; pixelWidth: number };
};

function App({ appHeaderProps, well, currentUser, rig, coordinates }: Props): JSX.Element {
  return (
    <GlobalProvider
      well={{ assetId: well.asset_id, name: well.name }}
      companyId={currentUser.company_id}
      rigName={rig.name}
      coordinates={coordinates}
      isAppMaximized={appHeaderProps.isMaximized}
    >
      <FiltersProvider>
        <DIListProvider>
          <div className={styles.container}>
            <CustomAppHeader appHeaderProps={appHeaderProps} />
            <div className={styles.content}>
              <Main />
            </div>
          </div>
        </DIListProvider>
      </FiltersProvider>
    </GlobalProvider>
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
