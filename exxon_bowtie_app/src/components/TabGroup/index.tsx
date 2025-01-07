import { FC } from 'react';

import { getStyles, styles } from './styles';

import { TTabsHeader } from '@/types/global.type';

export const TabGroup: FC<TTabsHeader> = ({ tabIndex, setTabIndex }) => {
  const handleChange = (newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <div style={styles.wrapper}>
        <div style={styles.flex}>
          <div style={getStyles(tabIndex === 0, true, false)} onClick={() => handleChange(0)}>
            Surface Blowout
          </div>
          <div style={getStyles(tabIndex === 1, false, false)} onClick={() => handleChange(1)}>
            Seafloor Blowout
          </div>
          <div style={getStyles(tabIndex === 2, false, true)} onClick={() => handleChange(2)}>
            Loss of MODU Stability
          </div>
        </div>
      </div>
    </div>
  );
};
