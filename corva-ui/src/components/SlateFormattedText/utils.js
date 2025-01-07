import { get } from 'lodash';
import { Node } from 'slate';

const getValidJSON = str => {
  if (!str) return false;
  try {
    const parsedJSON = JSON.parse(str);
    return { isValid: typeof parsedJSON === 'object' && parsedJSON !== null, parsedJSON };
  } catch (e) {
    return { isValid: false, parsedJSON: null };
  }
};

const getValidSlateJSON = str => {
  const { isValid, parsedJSON } = getValidJSON(str);
  if (!isValid) return { isTextValidSlateJSON: false, parsedSlateJSON: null };

  return {
    isTextValidSlateJSON: isValid && get(parsedJSON, '0.children'),
    parsedJSON,
  };
};

const getDefaultParagraphObjectEmpty = () => [
  {
    type: 'paragraph',
    children: [],
  },
];

const getDefaultParagraphObject = text => [
  {
    type: 'paragraph',
    children: [
      {
        text,
      },
    ],
  },
];

const isSlateTextEmpty = slateJSON =>
  !slateJSON ||
  (slateJSON.length === 1 &&
    !get(slateJSON, '0.children.0.text') &&
    !get(slateJSON, '0.children.0.type'));

const getFormattedText = ({ isValid, isEmpty, text, parsedText, defaultText }) => {
  if (!isValid) {
    return text || defaultText;
  } else {
    return isEmpty ? defaultText : parsedText;
  }
};

const getFormattedTextToEdit = ({ isValid, isEmpty, text, parsedText }) => {
  if (!isValid) {
    return (text && getDefaultParagraphObject(text)) || getDefaultParagraphObject('');
  } else {
    return isEmpty ? getDefaultParagraphObject('') : parsedText;
  }
};

const getPlainTextFromSlateJSON = (slateText, defaultText = '') => {
  const textValidSlateJSON = getValidJSON(slateText);
  return (
    (textValidSlateJSON?.parsedJSON &&
      textValidSlateJSON.parsedJSON.map(n => Node.string(n)).join('\n')) ||
    defaultText
  );
};

export const slateFormattingTextUtils = {
  getValidJSON,
  getValidSlateJSON,
  getDefaultParagraphObjectEmpty,
  isSlateTextEmpty,
  getFormattedText,
  getFormattedTextToEdit,
  getPlainTextFromSlateJSON,
};
