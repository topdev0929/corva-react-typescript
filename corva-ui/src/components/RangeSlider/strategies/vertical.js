function getCoordinates(event, rect) {
  return {
    new: event.clientY,
    min: rect.y,
    max: rect.y + rect.height,
  };
}

function getRotatedCoordinates(event, rect) {
  return {
    new: rect.y + rect.height - event.clientY + rect.y,
    min: rect.y,
    max: rect.y + rect.height,
  };
}

function getBarCoordinates(event, startCoordinates, rect) {
  const startY = startCoordinates.clientY;
  const startFromY = startCoordinates.y;
  const grabOffset = startY - startFromY;

  return {
    new: event.clientY - grabOffset,
    min: rect.y,
    max: rect.y + rect.height,
  };
}

function getThumbStyles(percent, isLastMoved) {
  return {
    left: '50%',
    top: percent < 50 ? `calc(${percent}% + 3px)` : `calc(${percent}% - 3px)`,
    zIndex: isLastMoved ? 10 : 2,
  };
}

function getBarStyles(fromPercent, toPercent) {
  return {
    top: `${fromPercent}%`,
    height: `${toPercent - fromPercent}%`,
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
export const verticalStrategy = {
  getCoordinates,
  getRotatedCoordinates,
  getBarCoordinates,
  getThumbStyles,
  getBarStyles,
  getInputStyles,
};
