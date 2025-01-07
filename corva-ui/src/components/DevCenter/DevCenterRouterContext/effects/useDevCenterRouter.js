import { useContext } from 'react';
import { DevCenterRouterContext } from '../DevCenterRouterContext';

export function useDevCenterRouter() {
  return useContext(DevCenterRouterContext);
}
