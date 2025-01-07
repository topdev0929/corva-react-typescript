import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { every } from 'lodash';

import { Leaf, Element } from './RenderElements';
import { slateFormattingTextUtils } from './utils';

const PAGE_NAME = 'SlateFormattedText';

const SlateFormattedText = ({
  text,
  textsList,
  defaultText,
  defaultRenderingTextNode,
  locator,
}) => {
  const currentLocator = `${locator}_slateText`;
  const editor = useMemo(() => withReact(createEditor()), []);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const { isValidSlateJSON, parsedSlateJSON, isEmptySlateJSON } = useMemo(() => {
    let { isTextValidSlateJSON, parsedJSON } = slateFormattingTextUtils.getValidSlateJSON(text);

    if (textsList.length) {
      const validatedAndParsedTextsList = textsList.map(item =>
        slateFormattingTextUtils.getValidSlateJSON(item)
      );
      isTextValidSlateJSON = every(validatedAndParsedTextsList, item => item.isTextValidSlateJSON);
      parsedJSON = slateFormattingTextUtils.getDefaultParagraphObjectEmpty();

      if (isTextValidSlateJSON) {
        validatedAndParsedTextsList.forEach(item => {
          const parsedItem = item.parsedJSON;
          if (!slateFormattingTextUtils.isSlateTextEmpty(parsedItem)) {
            parsedJSON[0].children = parsedJSON[0].children.concat(
              ...parsedItem.map(el => el.children)
            );
          }

          parsedJSON[0].children = parsedJSON[0].children.concat({ text: '\n' });
        });
      }
    }

    const isTextEmptySlateJSON =
      isTextValidSlateJSON && slateFormattingTextUtils.isSlateTextEmpty(parsedJSON);
    return {
      isValidSlateJSON: isTextValidSlateJSON,
      parsedSlateJSON: parsedJSON,
      isEmptySlateJSON: isTextEmptySlateJSON,
    };
  }, [text, String(textsList)]);

  const textFormatted = slateFormattingTextUtils.getFormattedText({
    isValid: isValidSlateJSON,
    isEmpty: isEmptySlateJSON,
    text,
    parsedText: parsedSlateJSON,
    defaultText,
  });

  let notSlateText;

  if (textsList.length > 0) {
    notSlateText = textsList.map(textsListItem => (
      <span data-testid={`${currentLocator}_listItem`} key={textsListItem}>
        {textsListItem}
        <br />
      </span>
    ));
  } else {
    notSlateText =
      (isValidSlateJSON && isEmptySlateJSON) || !defaultRenderingTextNode
        ? textFormatted
        : defaultRenderingTextNode;
  }

  return isValidSlateJSON && !isEmptySlateJSON ? (
    <Slate editor={editor} value={textFormatted}>
      <Editable
        data-testid={`${currentLocator}_editable`}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly
      />
    </Slate>
  ) : (
    notSlateText
  );
};

SlateFormattedText.propTypes = {
  text: PropTypes.string,
  textsList: PropTypes.arrayOf(PropTypes.string),
  defaultText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  defaultRenderingTextNode: PropTypes.node,
  locator: PropTypes.string,
};

SlateFormattedText.defaultProps = {
  text: '',
  textsList: [],
  defaultText: '',
  defaultRenderingTextNode: undefined,
  locator: PAGE_NAME,
};

export default SlateFormattedText;
