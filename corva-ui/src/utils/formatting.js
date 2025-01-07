export const orDash = value => {
  return Number.isFinite(value) || typeof value === 'string' ? value : '-';
};

const MOBILE_BREAK_POINT_WIDTH = 420;
const MAX_ASSET_NAME_LENGTH = 6;

export const formatAssetName = (
  assetName = '',
  containerPixelWidth,
  mobileBreakPointWidth = MOBILE_BREAK_POINT_WIDTH,
  maxAssetNameLength = MAX_ASSET_NAME_LENGTH
) => {
  const words = assetName.split(' ');
  if (
    containerPixelWidth > mobileBreakPointWidth ||
    assetName.length < maxAssetNameLength ||
    words.length <= 1
  ) {
    return assetName;
  }

  const initialChar = assetName[0];
  const lastWord = words[words.length - 1];
  return `${initialChar} ${lastWord}`;
};

export const truncateInTheMiddle = (text, clientWidth, scrollWidth) => {
  if (clientWidth === scrollWidth) return text;

  const charWidthInPx = scrollWidth / text.length;
  const visibleCharsLength = Math.floor(clientWidth / charWidthInPx);
  const trimmedTextLength = Math.floor(visibleCharsLength / 2);
  const charNum = Math.max(trimmedTextLength - 2, 2);

  return `${text.slice(0, charNum)}...${text.slice(text.length - charNum)}`;
};
