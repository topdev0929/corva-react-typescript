import { useRef, useEffect } from 'react';

export function usePreviousWells(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
