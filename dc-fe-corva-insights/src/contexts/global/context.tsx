import { createContext, useState, useEffect, FC } from 'react';

import { GlobalStore, GlobalStoreImpl } from '@/stores/global';
import { AssetId } from '@/entities/asset';
import { User } from '@/entities/user';
import { nativeEventsChannel } from '@/shared/services/native-events-channel';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const GlobalContext = createContext<GlobalStore>();

type Props = {
  assetId: AssetId;
  user: User;
  currentUser: any;
  appWidth: number;
  isNative: boolean;
  appId: number;
};

export const GlobalProvider: FC<Props> = ({
  children,
  user,
  currentUser,
  assetId,
  appWidth,
  isNative,
  appId,
}) => {
  const [store] = useState(
    () => new GlobalStoreImpl(assetId, user, currentUser, nativeEventsChannel, appId)
  );

  useEffect(() => {
    store.setCurrentAssetId(assetId);
  }, [assetId]);

  useEffect(() => {
    store.setUser(user);
  }, [user]);

  useEffect(() => {
    store.setCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    store.setAppSize(appWidth);
  }, [appWidth]);

  useEffect(() => {
    store.setAppId(appId);
  }, [appId]);

  useEffect(() => {
    if (isNative) {
      store.markAsNativeApp();
    } else {
      store.markAsWebApp();
    }
  }, [isNative]);

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
};
