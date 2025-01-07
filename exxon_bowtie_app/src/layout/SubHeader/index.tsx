import { FC } from 'react';

import { styles } from './styles';

import { RigSelector } from '@/components/RigSelector';
import { TabGroup } from '@/components/TabGroup';
import { TTabsHeader } from '@/types/global.type';

export const TabsHeader: FC<TTabsHeader> = ({ tabIndex, setTabIndex }) => {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <RigSelector />
        <TabGroup tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    </div>
  );
};
