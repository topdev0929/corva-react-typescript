import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { bind } from 'size-sensor';

const useSizer = container => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!container) {
      return;
    }

    const update = debounce(width => {
      setWidth(width);
    }, 100);

    const unbind = bind(container, ({ clientWidth }) => {
      update(clientWidth);
    });

    return () => {
      unbind();
    };
  }, [container]);

  return width;
};

export default useSizer;
