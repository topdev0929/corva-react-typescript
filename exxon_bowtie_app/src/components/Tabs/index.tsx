import { FC } from 'react';

import { SurfaceTab } from './Surface';
import { SeafloorTab } from './Seafloor';
import { StabilityTab } from './Stability';

import { TTabs } from '@/types/global.type';

const Tabs: FC<TTabs> = ({ tabIndex, currentUser, assetId }) => {
  return (
    <>
      {tabIndex === 0 && <SurfaceTab currentUser={currentUser} assetId={assetId} />}
      {tabIndex === 1 && <SeafloorTab currentUser={currentUser} assetId={assetId} />}
      {tabIndex === 2 && <StabilityTab currentUser={currentUser} assetId={assetId} />}
    </>
  );
};

export default Tabs;
