import { useRef, useEffect } from 'react';
import { sortBy } from 'lodash';

export function useRadiusWells(radius, wells, setSelectedWells, maxOffsetwellNumber) {
  const prevRadius = useRef(-1);

  useEffect(() => {
    if (!wells) return;

    if (prevRadius.current === -1) {
      prevRadius.current = radius;
    }

    if (radius && prevRadius.current !== radius) {
      prevRadius.current = radius;
      const radiusWellIds = [];
      wells.forEach(well => {
        if (well.distance <= radius) {
          radiusWellIds.push(well);
        }
      });
      if (maxOffsetwellNumber && maxOffsetwellNumber < radiusWellIds.length) {
        const sortedRadiusWellIds = sortBy(radiusWellIds, 'distance');
        setSelectedWells(sortedRadiusWellIds.slice(0, maxOffsetwellNumber));
      } else {
        setSelectedWells(radiusWellIds);
      }
    }
  }, [radius, wells]);
}
