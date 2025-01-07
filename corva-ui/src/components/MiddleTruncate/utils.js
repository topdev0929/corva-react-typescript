export const getTruncatedText = ({ text, currentWidth, textLength, separator, maxWidth }) => {
  const pxPerSymbol = currentWidth / textLength;
  const symbolsToCut = (currentWidth - maxWidth) / pxPerSymbol + separator.length;
  const startPosition = (text.length - symbolsToCut) / 2;
  const endPosition = (text.length + symbolsToCut) / 2;
  return text.substring(0, startPosition) + separator + text.substring(endPosition);
};
