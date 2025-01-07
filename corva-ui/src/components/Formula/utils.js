export const format = 'html';
const html = String.raw;

// note: will update for highlight style - multi child
export const convertStringToHtml = inputStr => {
  return html`<p>${inputStr}</p>`;
};

export const replaceStringToLabel = (inputStr, suggestions) => {
  return suggestions.reduce((result, suggestion) => {
    return result.replaceAll(`[${suggestion.key}]`, `${suggestion.label}`);
  }, inputStr);
};

export const convertHtmlToString = html => {
  const convertedString = html.replace(/<[^>]+>/g, '');
  return convertedString;
};

export const replaceStringToValue = (inputStr, suggestions) => {
  return suggestions.reduce((result, suggestion) => {
    return result.replaceAll(suggestion.label, `[${suggestion.key}]`);
  }, inputStr);
};

export const convertStringToEditorValue = (inputStr, suggestions) => {
  const convertedStr = replaceStringToLabel(inputStr, suggestions);
  return convertStringToHtml(convertedStr);
};

export const convertEditorValueToString = (editorValue, suggestions) => {
  const valueStr = convertHtmlToString(editorValue, suggestions);
  return replaceStringToValue(valueStr, suggestions);
};

export const getUpdatedHtmlValue = htmlValue => {
  const stringValue = convertHtmlToString(htmlValue);
  return [convertStringToHtml(stringValue || ''), !stringValue];
};

export function getCaret(el) {
  let caretAt = 0;
  const sel = window.getSelection();

  if (sel.rangeCount === 0) {
    return caretAt;
  }

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);
  caretAt = preRange.toString().length;

  return caretAt;
}

// note: will update for highlight style - multi child
export function setCaret(el, offset) {
  if (!el.childNodes[0]) return;
  const sel = window.getSelection();
  const range = document.createRange();
  const childNode = el.childNodes[0].childNodes[0] || el.childNodes[0];

  range.setStart(childNode, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}
