export const calculatePercentForDiff = (arg, min, max) => {
  return (arg * 100) / (max - min);
};

export const calculatePercentForValue = (arg, min, max) => {
  return ((arg - min) * 100) / (max - min);
};

export const calculateValueFromPercent = (arg, min, max) => {
  return min + (arg * (max - min)) / 100;
};

export const updateFromValue = (newFrom, from, to, min, minRange) => {
  if (newFrom < min) {
    return { from: min, to };
  }

  if (newFrom > to - minRange) {
    return { from: to - minRange, to };
  }

  return { from: newFrom, to };
};

export const updateToValue = (newTo, from, to, max, minRange) => {
  if (newTo > max) {
    return { from, to: max };
  }

  if (newTo < from + minRange) {
    return { from, to: from + minRange };
  }

  return { from, to: newTo };
};
