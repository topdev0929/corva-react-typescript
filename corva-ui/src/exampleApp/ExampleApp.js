import { useState } from 'react';
import { Button } from '@material-ui/core';

import LoadingIndicator from '~/components/LoadingIndicator';

import styles from './ExampleApp.css';

// NOTE: This example app is created just to test the components you implement inside this repo

function ExampleApp() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.exampleApp}>
      <Button onClick={() => setIsLoading(!isLoading)}>Toggle loader</Button>
      <div className={styles.loadingContainer}>{isLoading && <LoadingIndicator />}</div>
    </div>
  );
}

export default ExampleApp;
