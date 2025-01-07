import { useEffect } from 'react';
import { toArray, isArray, mapValues } from 'lodash';

import usePermissionsContext from './PermissionsContext';

/**
 * Custom hook for fetching user permissions.
 * @param {string[] | Object<string, string>} permissionKeys - An array of permission keys to check, or an object mapping named keys to permission keys.
 * @returns {object[] | Object<string, object>} An array of objects representing the status of each permission, or an object mapping permission keys to their status objects.
 */
function usePermissions(permissionKeys) {
  const { permissions, fetchPermissions } = usePermissionsContext();

  const permissionKeysArray = toArray(permissionKeys);

  // Fetch the permissions whenever the permission keys change
  useEffect(() => {
    fetchPermissions(permissionKeysArray);
  }, [permissionKeysArray.join()]);

  // Get the status of a single permission based on its key
  const getPermissionByKey = pKey => permissions[pKey] || { active: false, loading: true };

  // Return the status of each permission as an array or object, depending on the input
  return isArray(permissionKeys)
    ? permissionKeys.map(getPermissionByKey)
    : mapValues(permissionKeys, getPermissionByKey);
}

export default usePermissions;
