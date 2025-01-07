import { SlateFormattedText } from '~components/SlateFormattedText';
import { Regular14, Regular16 } from '~components/Typography';

import styles from './style.css';

const PAGE_NAME = 'DC_AppDetails';

const AppDetails = ({ appDescription, appSummary }) => (
  <div className={styles.appSettingsDescription}>
    <Regular16 paragraph>Description</Regular16>

    <Regular14 data-testid={`${PAGE_NAME}_description`}>
      <SlateFormattedText
        text={appDescription}
        defaultText={<i>No description was provided</i>}
      />
    </Regular14>
    <br />

    <Regular16 paragraph>Summary</Regular16>

    <Regular14 data-testid={`${PAGE_NAME}_summary`}>
      <SlateFormattedText
        text={appSummary}
        defaultText={<i>No summary was provided</i>}
      />
    </Regular14>
  </div>
);

export default AppDetails;
