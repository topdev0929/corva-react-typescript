import { useState, useEffect } from 'react';

export function useXProps() {
  const [xprops, setXProps] = useState(window.xprops);

  useEffect(() => {
    window.xprops.onProps(props => {
      setXProps({ ...props });
    });
  }, []);

  return xprops;
}
