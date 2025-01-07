export const getBarPercents = (designValue, actualValue) => {
  let designBarPercent;
  let actualBarPercent;

  if (designValue && actualValue) {
    designBarPercent = Math.min((designValue / actualValue) * 100, 100);
    actualBarPercent = Math.min((actualValue / designValue) * 100, 100);
  } else if (designValue) {
    designBarPercent = 100;
    actualBarPercent = 0;
  } else if (actualValue) {
    actualBarPercent = 100;
    designBarPercent = 0;
  }

  return { actualBarPercent, designBarPercent };
};
