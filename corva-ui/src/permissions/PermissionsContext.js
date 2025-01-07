import { createContext, useContext } from 'react';

export const PermissionsContext = createContext();
const usePermissionsContext = () => useContext(PermissionsContext);

export default usePermissionsContext;
