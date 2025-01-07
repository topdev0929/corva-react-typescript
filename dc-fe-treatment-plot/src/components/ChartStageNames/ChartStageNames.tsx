import { FunctionComponent, memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';

import { TimeRange } from '@/types/Settings';
import { GroupedWitsData } from '@/types/Data';
import { getStageNamesInfo } from './utils';
import { ChartStageNameItem } from './ChartStageNameItem';
import { useAppContext } from '@/context/AppContext';

const MAX_STAGE_COUNT_BREAKPOINT = 30;

const useStyles = makeStyles({
  captionsContainer: {
    position: 'relative',
    height: 16,
    width: 'auto',
    overflow: 'hidden',

    '&.singleStage': {
      textAlign: 'center',
    },
  },
});

type ChartStageNamesProps = {
  chartGrid: {
    left: number;
    right: number;
  };
  isOverlay: boolean;
  isLive: boolean;
  assetTimeLimits: TimeRange;
  zoom: TimeRange;
  data: GroupedWitsData[];
};

const ChartStageNames: FunctionComponent<ChartStageNamesProps> = ({
  chartGrid,
  assetTimeLimits,
  zoom,
  isOverlay,
  isLive,
  data = [],
}) => {
  const namesContainer = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const [secondsPerPixel, setSecondsPerPixel] = useState(0);
  const { isAssetViewer } = useAppContext();

  const stageNameInfo = useMemo(
    () => getStageNamesInfo({ data, isAssetViewer, isZoomedIn: !!zoom }),
    [data, zoom, isAssetViewer]
  );

  useLayoutEffect(() => {
    if (!namesContainer?.current) return;
    const { startValue, endValue } = zoom || assetTimeLimits;

    setSecondsPerPixel((endValue - startValue) / namesContainer?.current?.clientWidth);
  }, [assetTimeLimits, zoom, namesContainer?.current?.clientWidth]);

  if ((data.length > MAX_STAGE_COUNT_BREAKPOINT && !zoom) || isOverlay) return null;
  const isSingleStage = stageNameInfo.length === 1;

  return (
    <div
      ref={namesContainer}
      className={classNames(styles.captionsContainer, isSingleStage && 'singleStage')}
      style={{ marginLeft: chartGrid.left, marginRight: chartGrid.right }}
    >
      {stageNameInfo.map((infoItem, index) => (
        <ChartStageNameItem
          {...infoItem}
          key={infoItem.firstTimestamp}
          isLive={isLive && index === stageNameInfo.length - 1}
          assetTimeLimits={zoom || assetTimeLimits}
          secondsPerPixel={secondsPerPixel}
          isSingleStage={isSingleStage}
        />
      ))}
    </div>
  );
};

export default memo(ChartStageNames);
