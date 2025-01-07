import { useEffect, useRef, useState } from 'react';

export function useCustomShrink({ startIcon, endIcon, onFocus, onBlur, value, InputProps }) {
  const [startlabelOffset, setStartLabelOffset] = useState();
  const [endlabelOffset, setEndLabelOffset] = useState();
  const [shrink, setShrink] = useState(
    (typeof value === 'string' && value.length !== 0) ||
      (typeof value === 'number' && String(value).length !== 0) ||
      !!InputProps?.startAdornment ||
      false
  );

  const startAdornmentRef = useRef(null);
  const endAdornmentRef = useRef(null);

  useEffect(() => {
    setStartLabelOffset(startAdornmentRef.current?.offsetWidth);
    setEndLabelOffset(endAdornmentRef.current?.offsetWidth);
  }, [startIcon, endIcon]);

  const onInputFocus = event => {
    setShrink(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  const onInputBlur = event => {
    if (event.target.value.length === 0 && !InputProps?.startAdornment) {
      setShrink(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  };

  return {
    shrink,
    onInputFocus,
    onInputBlur,
    startlabelOffset,
    endlabelOffset,
    startAdornmentRef,
    endAdornmentRef,
  };
}
