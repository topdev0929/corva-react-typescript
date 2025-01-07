import PropTypes from 'prop-types';
import EmptyState from '~/components/EmptyState';
import SubtitleWithIntercomLink from '~/components/EmptyView/EmptyAppView/components/ErrorSubtitleWithIntercomLink';

import AppHeader from '../../DevCenter/AppHeader';
import styles from './DevCenterAppErrorView.css';

function DevCenterAppErrorView({ app, openIntercom }) {
  return (
    <div className={styles.container}>
      {app && <AppHeader app={app} />}
      <EmptyState
        title={EmptyState.APP_MESSAGES.internalAppError.title}
        subtitle={<SubtitleWithIntercomLink openIntercom={openIntercom} />}
        image={EmptyState.IMAGES.AppLoadingError}
      />
    </div>
  );
}

DevCenterAppErrorView.propTypes = {
  app: PropTypes.shape({}),
};

DevCenterAppErrorView.defaultProps = {
  app: null,
};

export default DevCenterAppErrorView;
