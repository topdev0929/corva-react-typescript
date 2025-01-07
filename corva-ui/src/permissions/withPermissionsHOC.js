import { some } from 'lodash';
import LoadingIndicator from '~/components/LoadingIndicator';

import usePermissions from './usePermissions';

const DEFAULT_LOADER = <LoadingIndicator />;

export const withPermissionsHOC = (
  propKeyToPermission,
  hocParams = {}
) => WrappedComponent => props => {
  const { loader = DEFAULT_LOADER, skipLoading = false } = hocParams;

  const propKeys = Object.keys(propKeyToPermission);
  const permissions = usePermissions(
    propKeys.map(propKey => {
      const propValue = propKeyToPermission[propKey];

      return typeof propValue === 'function' ? propValue(props) : propValue;
    })
  );

  if (!skipLoading && some(permissions, 'loading')) return loader;

  const permissionsProps = propKeys.reduce((acc, curr, index) => {
    acc[curr] = permissions[index].active;
    return acc;
  }, {});

  return <WrappedComponent {...props} {...permissionsProps} />;
};
