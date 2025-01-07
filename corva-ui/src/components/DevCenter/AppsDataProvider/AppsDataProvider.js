import PropTypes from 'prop-types';
import AppContext from '../AppContext';
import { useAppsData } from './effects';

function AppsDataProvider({ children, dashboardAssetId, apps }) {
  const appsData = useAppsData({ apps, dashboardAssetId });

  return <AppContext.Provider value={appsData}>{children}</AppContext.Provider>;
}

AppsDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
  dashboardAssetId: PropTypes.string,
  apps: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

AppsDataProvider.defaultProps = {
  dashboardAssetId: null,
};

export default AppsDataProvider;
