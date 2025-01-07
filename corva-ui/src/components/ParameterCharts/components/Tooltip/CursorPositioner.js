import { useContext, useCallback, useMemo, useState } from 'react';
import { throttle } from 'lodash';

import SettingsContext from '../../SettingsContext';
import ChartsContext from '../../ChartsContext';

import Tooltip from './Tooltip';

import styles from './CursorPositioner.css';

const HORIZONTAL_HEADER_WIDTH = 68; // px
const HORIZONTAL_TRACK_HEIGHT = 100; // px
const HORIZONTAL_TRACK_SPACING = 16; // px
const HORRIZONTAL_TRACK_HEADER_WIDTH = 24 + 8; // header + spacing px

const CursorPositioner = () => {
  const { chartsRef } = useContext(ChartsContext);
  const { settings, horizontal, maxTracesCount, settingsKey } = useContext(SettingsContext);
  const [points, setPoints] = useState([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const onMouseOverTraceCharts = e => {
    setIsTooltipVisible(true);
    if (chartsRef && chartsRef.current && settings[settingsKey]) {
      const points = [];
      const tracks = settings[settingsKey];
      tracks.forEach((_, index) => {
        const currentPoints = [];
        const ref = chartsRef.current.get(index);
        if (ref && ref.current && ref.current.chart) {
          const { chart } = ref.current;
          const event = chart.pointer.normalize(e);
          chart.series.forEach(item => {
            const point = item.searchPoint(event, true);
            if (point) {
              currentPoints.push(point);
            }
          });
        }
        points.push(currentPoints);
      });
      setPoints(points);
    }
  };

  const onMouseMove = useCallback(
    throttle(event => onMouseOverTraceCharts(event), 50, {
      leading: true,
      trailing: false,
    }),
    [chartsRef]
  );

  const dynamicStyles = useMemo(() => {
    const tracksAmount = settings?.[settingsKey]?.length || 1;
    if (horizontal) {
      const right = `${
        HORIZONTAL_HEADER_WIDTH * maxTracesCount + HORRIZONTAL_TRACK_HEADER_WIDTH
      }px`;
      const height = `${(HORIZONTAL_TRACK_HEIGHT + HORIZONTAL_TRACK_SPACING) * tracksAmount}px`;
      return {
        right,
        height,
      };
    }
    return {
      right: 0,
      height: 0,
    };
  }, [maxTracesCount, horizontal, settings]);

  const hideToolTip = () => {
    setIsTooltipVisible(false);
  };

  return (
    <div
      className={styles.container}
      style={dynamicStyles}
      onMouseMove={onMouseMove}
      onMouseLeave={hideToolTip}
    >
      {isTooltipVisible && <Tooltip points={points} />}
    </div>
  );
};

export default CursorPositioner;
