import PropTypes from 'prop-types';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { AppHeader } from '~/components';

import styles from './AppInfoMessage.css';

export const PAGE_NAME = 'AppInfoMessage';

function AppInfoMessage({ app, children, message, submessage }) {
  return (
    <div className={styles.appInfoMessage} data-testid={PAGE_NAME}>
      <AppHeader app={app} />
      <div className={styles.content}>
        {children}
        {!children && (
          <>
            <InfoOutlinedIcon size="large" className={styles.infoIcon} />
            <p className={styles.message}>{message}</p>
            {submessage && <p className={styles.submessage}>{submessage}</p>}
          </>
        )}
      </div>
    </div>
  );
}

AppInfoMessage.propTypes = {
  app: PropTypes.shape({}).isRequired,
  children: PropTypes.node,
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  submessage: PropTypes.string,
};

AppInfoMessage.defaultProps = { message: '', submessage: '', children: null };

export default AppInfoMessage;
