/* eslint-disable react/no-danger */
import { useState, useMemo, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import {
  convertStringToEditorValue,
  convertEditorValueToString,
  getUpdatedHtmlValue,
  getCaret,
  setCaret,
} from './utils';

export const useStyles = makeStyles(() => ({
  customTextarea: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '442px',
    maxWidth: '442px',
    minHeight: '90px',
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
    margin: '-8px 0',
    padding: ({ isEmptyValue }) => (isEmptyValue ? '31px 24px 24px 16px' : '16px 24px 16px 16px'),
    fontSize: '16px',
    lineHeight: '24px',
    borderRadius: '8px',
    outline: '0px',
    border: ({ color }) => `1px solid ${color}`,
  },
}));

const enterKeyCode = 13;
const FormulaTextEditor = ({
  initFormula,
  cursorPos,
  color,
  suggestions,
  isValueUpdated,
  setIsValueUpdated,
  onChange,
}) => {
  const initialValue = useMemo(
    () => convertStringToEditorValue(initFormula, suggestions),
    [initFormula, suggestions]
  );
  const [htmlValue, setHtmlValue] = useState(initialValue);
  const [updatedHtmlValue, isEmptyValue] = useMemo(
    () => getUpdatedHtmlValue(htmlValue),
    [htmlValue]
  );

  const contentRef = useRef();
  const initialRef = useRef(false);
  const classes = useStyles({ color, isEmptyValue });

  const handleKeyPress = event => {
    // prevent Enter key
    if (event.charCode === enterKeyCode) {
      event.preventDefault();
    }
  };

  const handleChange = event => {
    const caretPos = getCaret(contentRef.current);
    setHtmlValue(event.target.innerHTML);
    onChange(convertEditorValueToString(event.target.innerHTML, suggestions), caretPos);
  };

  useEffect(() => {
    if (isValueUpdated) {
      initialRef.current = true;
      setHtmlValue(initialValue);
      setIsValueUpdated(false);
    }
  }, [initialValue, isValueUpdated]);

  useEffect(() => {
    setCaret(contentRef.current, cursorPos);
    if (initialRef.current) contentRef.current.focus();
  }, [updatedHtmlValue]);

  return (
    <span
      ref={contentRef}
      contentEditable
      onInput={handleChange}
      onKeyPress={handleKeyPress}
      className={classes.customTextarea}
      dangerouslySetInnerHTML={{ __html: updatedHtmlValue }}
    />
  );
};

export default FormulaTextEditor;
