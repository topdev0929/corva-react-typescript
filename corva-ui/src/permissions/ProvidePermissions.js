import PropTypes from 'prop-types';
import { PermissionsContext } from './PermissionsContext';
import useProvidePermissions from './useProvidePermissions';

function ProvidePermissions({ children }) {
  return (
    <PermissionsContext.Provider value={useProvidePermissions()}>
      {children}
    </PermissionsContext.Provider>
  );
}

ProvidePermissions.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProvidePermissions;
