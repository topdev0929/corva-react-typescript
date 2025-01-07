import { useEffect } from 'react';

export const useKeyboardControl = ({ keyCode, callback }) => {
  const handleKeyDownAction = event => {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === keyCode) {
      event.preventDefault();
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDownAction);

    return () => {
      document.removeEventListener('keydown', handleKeyDownAction);
    };
  }, [keyCode]);
};
