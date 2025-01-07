import { RefObject, useEffect, useState } from 'react';

const CALENDAR_LIST_BREAKPOINTS = {
  SMALL: 544,
  MEDIUM: 654,
};
type DaySize = 'small' | 'medium' | 'large';

export const useDaySize = (containerRef: RefObject<HTMLElement>): DaySize => {
  const [daySize, setDaySize] = useState<DaySize>('large');

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        let size: DaySize;
        const { width } = entries[0].contentRect;
        if (width > CALENDAR_LIST_BREAKPOINTS.MEDIUM) size = 'large';
        else if (width <= CALENDAR_LIST_BREAKPOINTS.SMALL) size = 'small';
        else size = 'medium';
        setDaySize(size);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return daySize;
};
