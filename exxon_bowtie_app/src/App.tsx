import { useState } from 'react';

import { CustomAppHeader as AppHeader } from './layout/AppHeader';
import { TabsHeader as SubHeader } from './layout/SubHeader';
import { Main } from './layout/Main';

import styles from './App.css';

type AppProps = {
  appHeaderProps: {
    [key: string]: any;
    app: any;
  };
  isExampleCheckboxChecked?: boolean;
  rig: { name: string };
  well: { name: string };
};

function App({ appHeaderProps }: AppProps): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={styles.container}>
      <AppHeader appHeaderProps={appHeaderProps} />
      <SubHeader tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <Main
        tabIndex={tabIndex}
        currentUser={appHeaderProps?.currentUser}
        assetId={appHeaderProps?.rig?.asset_id}
      />
    </div>
  );
}

// Important: Do not change root component default export (App.js). Use it as container
//  for your App. It's required to make build and zip scripts work as expected;
export default App;
