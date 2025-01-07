import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import { ISOLATED_PAGE_APP_CONTAINER_ID } from '~/components/DevCenter/IsolatedDevCenterAppContainer/constants';

export type MatchAppContainerSizeOptions = {
  width?: { max?: number; min?: number };
  height?: { max?: number; min?: number };
};

const getDCAppContainerElement = () => {
  // Get the first child to match correct app height
  return document.getElementById(ISOLATED_PAGE_APP_CONTAINER_ID)?.firstElementChild as HTMLElement;
};

export const useMatchAppContainerSize = ({ width, height }: MatchAppContainerSizeOptions = {}) => {
  const widgetContainerEl = useRef<HTMLElement>(getDCAppContainerElement());

  const calculateLayoutMatch = () => {
    const containerBcRect = widgetContainerEl.current?.getBoundingClientRect();

    if (!containerBcRect) {
      console.error(
        `#${ISOLATED_PAGE_APP_CONTAINER_ID} component is not available. Check if you are not using "useMatchAppContainerSize" hook outside of DC app`
      );
      return null;
    }

    const minWidthMatch = typeof width?.min === 'number' ? width.min < containerBcRect.width : true;
    const maxWidthMatch = typeof width?.max === 'number' ? width.max > containerBcRect.width : true;
    const minHeightMatch =
      typeof height?.min === 'number' ? height.min < containerBcRect.height : true;
    const maxHeightMatch =
      typeof height?.max === 'number' ? height.max > containerBcRect.height : true;

    return minWidthMatch && maxWidthMatch && minHeightMatch && maxHeightMatch;
  };

  const [isMatch, setIsMatch] = useState<boolean>(
    widgetContainerEl.current ? calculateLayoutMatch() : null
  );

  const checkContainerSize = useCallback(
    throttle(() => setIsMatch(calculateLayoutMatch()), 200),
    [width, height]
  );

  useEffect(() => {
    // NOTE: Set container element in case if it was not available at the time before first render
    if (!widgetContainerEl.current) {
      widgetContainerEl.current = getDCAppContainerElement();
      setIsMatch(calculateLayoutMatch());
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', checkContainerSize);

    return () => {
      window.removeEventListener('resize', checkContainerSize);
    };
  }, []);

  return isMatch;
};
