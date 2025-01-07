import { useEffect, useCallback } from 'react';

const useEscPress = (callback) => {
  const onKeyDown = useCallback((event) => {
    if(event.keyCode === 27) {
      callback()
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, false);

    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
    };
  }, []);
};

export default useEscPress;