export const getWellStatusLabel = (isActiveFracAsset, isActiveWirelineAsset, isActivePumpdownAsset) => {
  if (isActiveFracAsset && isActiveWirelineAsset) return ' (Active Frac & WL)';
  if (isActiveFracAsset) return ' (Active Frac)';
  if (isActiveWirelineAsset) return ' (Active WL)';
  if (isActivePumpdownAsset) return ' (Active Pumpdown)';

  return '';
};
