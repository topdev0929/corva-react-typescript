import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import StraightenIcon from '@material-ui/icons/Straighten';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useTheme } from '@material-ui/core';

import { useDIListStore } from '@/contexts/di-list';
import { useDIChartStore } from '@/contexts/di-chart';
import { DamageIndex } from '@/entities/damage-index';
import { formatAMPMDate, formatNumber } from '@/shared/utils';
import { Theme } from '@/shared/types';

import { CurrentDiChart } from './Chart';
import { CurrentDiMetaInfo } from './MetaInfo';
import { BlockContainer } from '../Container';
import styles from './index.module.css';

export const CurrentDI = observer(() => {
  const theme = useTheme<Theme>();
  const store = useDIListStore();
  const chartStore = useDIChartStore();
  const iconColor = theme.palette.primary.text6;
  const [scales, setScales] = useState(chartStore.scales);

  useEffect(() => {
    setScales(chartStore.scales);
  }, [chartStore.scales])

  const depthIcon = useMemo(
    () => (
      <span className={styles.depthIcon}>
        <StraightenIcon fontSize="small" style={{ color: iconColor }} />
      </span>
    ),
    [iconColor]
  );

  const thermometerIcon = useMemo(
    () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1124_3161)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 2.0001C7.26362 2.0001 6.66667 2.59705 6.66667 3.33343L6.66667 8.66653C6.66667 8.8762 6.56803 9.07365 6.40039 9.19957C5.75118 9.68721 5.33334 10.4614 5.33334 11.3334C5.33334 12.8062 6.52727 14.0001 8.00001 14.0001C9.47275 14.0001 10.6667 12.8062 10.6667 11.3334C10.6667 10.4614 10.2488 9.68721 9.59962 9.19957C9.43198 9.07365 9.33334 8.8762 9.33334 8.66653L9.33334 3.33343C9.33334 2.59705 8.73638 2.00009 8 2.0001ZM5.33334 3.33343C5.33333 1.86067 6.52724 0.666762 8 0.666762C9.47276 0.666761 10.6667 1.86067 10.6667 3.33343L10.6667 8.35199C11.4841 9.08364 12 10.1484 12 11.3334C12 13.5425 10.2091 15.3334 8.00001 15.3334C5.79089 15.3334 4.00001 13.5426 4.00001 11.3334C4.00001 10.1484 4.51593 9.08365 5.33334 8.352L5.33334 3.33343Z"
            fill={iconColor}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.99998 5.00009C8.36817 5.00009 8.66665 5.29857 8.66665 5.66676L8.66665 10.0001C8.66665 10.3683 8.36817 10.6668 7.99998 10.6668C7.63179 10.6668 7.33332 10.3683 7.33332 10.0001L7.33331 5.66676C7.33331 5.29857 7.63179 5.00009 7.99998 5.00009Z"
            fill={iconColor}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 11.3334C6 10.2289 6.89544 9.33342 8 9.33342C9.10456 9.33342 10 10.2289 10 11.3334C10 12.438 9.10456 13.3334 8 13.3334C6.89545 13.3334 6 12.438 6 11.3334ZM8 10.6668C7.63182 10.6668 7.33333 10.9652 7.33333 11.3334C7.33334 11.7016 7.63183 12.0001 8 12.0001C8.36818 12.0001 8.66667 11.7016 8.66667 11.3334C8.66667 10.9652 8.36818 10.6668 8 10.6668Z"
            fill={iconColor}
          />
        </g>
        <defs>
          <clipPath id="clip0_1124_3161">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    [iconColor]
  );

  return (
    <BlockContainer<DamageIndex>
      isLoading={store.isCurrentLoading}
      isEmpty={!store.currentDI}
      data={store.currentDI}
    >
      {currentDI => (
        <>
          <h3 className={styles.title}>Damage Index</h3>
          <CurrentDiChart value={currentDI.value} scales={scales} />
          <CurrentDiMetaInfo
            label="Current Time"
            value={formatAMPMDate(currentDI.timeUTC)}
            icon={<ScheduleIcon fontSize="small" style={{ color: iconColor }} />}
            className={styles.time}
          />
          <CurrentDiMetaInfo
            label="Current Depth"
            value={formatNumber(currentDI.depth)}
            icon={depthIcon}
            unit="ft"
            className={styles.depth}
          />
          <CurrentDiMetaInfo
            label="Max MWD Temperature"
            value={formatNumber(currentDI.maxMWDTemp)}
            icon={thermometerIcon}
            unit="F"
          />
        </>
      )}
    </BlockContainer>
  );
});

CurrentDI.displayName = 'CurrentDI';
