import { useEffect } from 'react';

const useOutsideClick = (
  ref,
  callback,
  excludedSelectors = ['.MuiPopover-root', '.MuiDialog-container', '.ReactModalPortal']
) => {
  const handleClick = e => {
    // NOTE: Check if it's not in exlcluded selectors
    const isTargetExcluded = excludedSelectors.some(excludedSelector =>
      e.target.closest(excludedSelector)
    );

    if (ref.current && !ref.current.contains(e.target) && !isTargetExcluded) callback(e);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });
};
export default useOutsideClick;
