import { createContext, useState, useEffect, FC } from 'react';

import { GlobalStore, IGlobalStore } from '@/stores/global';
import { wellsRepository } from '@/repositories/wells';
import { Well } from '@/entities/well';

export const GlobalContext = createContext<IGlobalStore>({
  assetIds: [],
  currentWell: { assetId: 0, name: '' },
  currentCompanyId: 0,
  currentAssetId: 0,
  rigName: '',
  isFullScreen: false,
  isTabletSize: false,
  isTabletSmSize: false,
  isMobileSize: false,
  isAppMaximized: false,
  appSize: { width: 0, height: 0 },
  setCurrentWell: () => null,
  setCurrentCompanyId: () => null,
  setRigName: () => null,
  turnOnFullScreen: () => null,
  turnOffFullScreen: () => null,
  setAppSize: () => null,
  setAppMaximizedFlag: () => null,
});

type Props = {
  well: Well;
  companyId: number;
  rigName: string;
  coordinates: { pixelHeight: number; pixelWidth: number };
  isAppMaximized: boolean;
};

export const GlobalProvider: FC<Props> = ({
  children,
  companyId,
  well,
  rigName,
  coordinates,
  isAppMaximized,
}) => {
  const [store] = useState(
    () =>
      new GlobalStore(
        { getByCompany: wellsRepository.getAssetIdsByCompany },
        well,
        companyId,
        rigName
      )
  );

  useEffect(() => {
    store.setCurrentWell(well);
  }, [well.name]);

  useEffect(() => {
    store.setCurrentCompanyId(companyId);
  }, [companyId]);

  useEffect(() => {
    store.setRigName(rigName);
  }, [rigName]);

  useEffect(() => {
    store.setAppSize({ width: coordinates.pixelWidth, height: coordinates.pixelHeight });
  }, [coordinates.pixelHeight, coordinates.pixelWidth]);

  useEffect(() => {
    store.setAppMaximizedFlag(isAppMaximized);
  }, [isAppMaximized]);

  return <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>;
};
