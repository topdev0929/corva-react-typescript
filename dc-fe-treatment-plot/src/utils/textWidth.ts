export function getTextWidth(strText: string, fontSize = 11) {
  const text = document.createElement('span');
  document.body.appendChild(text);
  text.style.font = 'Roboto';
  text.style.fontSize = `${fontSize}px`;
  text.style.letterSpacing = '-0.001px';
  text.style.height = 'auto';
  text.style.width = 'auto';
  text.style.position = 'absolute';
  text.style.whiteSpace = 'nowrap';
  text.innerHTML = strText;
  const textWidth = Math.ceil(text.clientWidth);
  document.body.removeChild(text);
  return textWidth;
}
