import { FC } from 'react';

import { styles } from './styles';

import Tabs from '@/components/Tabs';
import { TTabs } from '@/types/global.type';

export const Main: FC<TTabs> = ({ tabIndex, assetId, currentUser }) => {
  return (
    <div style={styles.container}>
      <Tabs tabIndex={tabIndex} currentUser={currentUser} assetId={assetId} />
    </div>
  );
};
