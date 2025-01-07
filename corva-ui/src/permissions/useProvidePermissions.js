import { useRef, useState } from 'react';
import { getPermissionCheck } from '~/clients/jsonApi';
import { parsePermission } from './utils';

async function fetchPermissionCheck(requestOptions) {
  try {
    return await getPermissionCheck(requestOptions);
  } catch (e) {
    console.error(e);
    // NOTE: Return false by default
    return { active: false };
  }
}

function useProvidePermissions() {
  const [permissions, setPermissions] = useState({});
  // NOTE: Store pending requests to prevent duplicate requests
  const pendingRequests = useRef(new Set());

  // NOTE: Called in finishLogIn redux action
  window[Symbol.for('resetPermissionsCache')] = () => setPermissions({});

  async function fetchPermissions(permissionKeys) {
    const permissionsToFetch = permissionKeys.filter(
      // NOTE: Send check request ONLY for new permission
      pKey => !(pKey in permissions) && !pendingRequests.current.has(pKey)
    );
    if (!permissionsToFetch.length) return;

    const response = await Promise.all(
      permissionsToFetch.map(pKey => {
        // NOTE: Add permission to pending requests and send check request
        pendingRequests.current.add(pKey);

        return fetchPermissionCheck(parsePermission(pKey));
      })
    );

    setPermissions(prevPermissions => {
      const nextPermissions = { ...prevPermissions };

      permissionsToFetch.forEach((pKey, pIndex) => {
        // NOTE: Delete permission from pending request
        pendingRequests.current.delete(pKey);
        nextPermissions[pKey] = { loading: false, ...response[pIndex] };
      });
      return nextPermissions;
    });
  }

  return { permissions, fetchPermissions };
}

export default useProvidePermissions;
