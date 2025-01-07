function getCoordinates(event, rect) {
  return {
    new: event.clientX,
    min: rect.x,
    max: rect.x + rect.width,
  };
}

function getBarCoordinates(event, startCoordinates, rect) {
  const startX = startCoordinates.clientX;
  const startFromX = startCoordinates.x;
  const grabOffset = startX - startFromX;

  return {
    new: event.clientX - grabOffset,
    min: rect.x,
    max: rect.x + rect.width,
  };
}

function getThumbStyles(percent, isLastMoved) {
  return {
    top: '50%',
    left: percent < 50 ? `calc(${percent}% + 3px)` : `calc(${percent}% - 3px)`,
    zIndex: isLastMoved ? 10 : 2,
  };
}

function getBarStyles(fromPercent, toPercent) {
  return {
    left: `${fromPercent}%`,
    width: `${toPercent - fromPercent}%`,
  };
}

function getInputStyles(isActive) {
  if (!isActive) return {};
  return {
    border: '1px solid #03BCD4',
    color: '#ffffff',
    backgroundColor: '#333333',
  };
}

export const horizontalStrategy = {
  getCoordinates,
  getBarCoordinates,
  getThumbStyles,
  getBarStyles,
  getInputStyles,
};
