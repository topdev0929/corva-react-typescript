import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';

import { useGlobalStore } from '@/contexts/global';
import { APP_SIZE } from '@/shared/types';
import { InsightTypeCircle } from '@/shared/components/InsightType/Circle';

import { isLegendTileItem, useLegendItems } from './useLegendItems';
import styles from './index.module.css';

export const Legend = observer(
  forwardRef<HTMLDivElement | null>((_, ref) => {
    const globalStore = useGlobalStore();
    const legendItems = useLegendItems();
    const isMinimized =
      globalStore.appSize === APP_SIZE.MOBILE || globalStore.appSize === APP_SIZE.MOBILE_SM;

    return (
      <div className={styles.container} ref={ref}>
        {legendItems.map(item => (
          <div className={styles.item} key={item.id}>
            {isMinimized && isLegendTileItem(item) ? (
              <InsightTypeCircle tile={item.tile} />
            ) : (
              <img className={styles.itemIcon} src={item.icon} alt="Insight Type" />
            )}
            <span className={styles.itemText}>{item.label}</span>
          </div>
        ))}
      </div>
    );
  })
);

Legend.displayName = 'Legend';
