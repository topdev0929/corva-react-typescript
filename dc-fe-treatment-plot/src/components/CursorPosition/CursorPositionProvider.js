import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { get, throttle } from 'lodash';

import CursorPositionContext from './CursorPositionContext';

function CursorPositionProvider({ children }) {
  const [cursorInfo, setCursorInfo] = useState(null);

  const onPositionChanged = useCallback(
    throttle(newInfo => setCursorInfo(newInfo), 10),
    []
  );

  const providerInfo = useMemo(() => {
    return {
      xPos: get(cursorInfo, 'position.x', 0),
      yPos: get(cursorInfo, 'position.y', 0),
      isPositionOutside: get(cursorInfo, 'isPositionOutside', true),
      containerHeight: get(cursorInfo, 'elementDimensions.height', 0),
      containerWidth: get(cursorInfo, 'elementDimensions.width', 0),
      onPositionChanged,
    };
  }, [cursorInfo, onPositionChanged]);

  return (
    <CursorPositionContext.Provider value={providerInfo}>{children}</CursorPositionContext.Provider>
  );
}

export default CursorPositionProvider;

CursorPositionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
