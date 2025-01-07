import { RefObject, useEffect, useState } from 'react';

const DEFAULT_LEGEND_HEIGHT = 24;
const CALENDAR_HEADER_HEIGHT = 58;

const stringifyMaxHeight = (height: number): string => {
  return `calc(100% - ${height + CALENDAR_HEADER_HEIGHT}px)`;
};

export const useListMaxHeight = (legendRef: RefObject<HTMLElement>): string => {
  const [maxHeight, setMaxHeight] = useState<string>(stringifyMaxHeight(DEFAULT_LEGEND_HEIGHT));

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { height } = entries[0].contentRect;
        setMaxHeight(stringifyMaxHeight(height));
      }
    });

    if (legendRef.current) {
      resizeObserver.observe(legendRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [legendRef]);

  return maxHeight;
};
