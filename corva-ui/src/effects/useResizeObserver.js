import { useEffect } from 'react';

function useResizeObserver({ callback, containerRef }) {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(callback);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
}

export default useResizeObserver;
