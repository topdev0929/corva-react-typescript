import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import classnames from 'classnames';
import { noop } from 'lodash';
import { Button, useTheme } from '@material-ui/core';
import { InfoOutlined as InfoOutlinedIcon, Close as CloseIcon } from '@material-ui/icons';

import Tooltip from '~/components/Tooltip';
import useOutsideClick from '~/effects/useOutsideClick';

import { replaceStringToLabel } from './utils';
import { useFormulaFunction } from './useFormulaFunction';
import { useFormulaStyles } from './useFormulaStyles';
import RootXIcon from './RootXIcon';
import FormulaTextEditor from './FormulaTextEditor';
import CloseSuggestion from './CloseSuggestion';
import SuggestionsMenu from './SuggestionsMenu';

const HOT_STR = '/f';
const mathSymbols = [
  { value: '*', isShift: true, label: '8' },
  { value: '/', label: '/' },
  { value: '(', isShift: true, label: '9' },
  { value: ')', isShift: true, label: '0' },
  { value: '+', isShift: true, label: '+' },
  { value: '-', label: '-' },
  { value: '^', isShift: true, label: '6' },
];
const getColor = (theme, isHighlight, isError) => {
  if (!isHighlight) return theme.palette.primary.text7;
  return isError ? theme.palette.error.main : theme.palette.primary.main;
};

const FormulaComponent = ({ suggestions, initFormula, onSave }) => {
  const [isVerified, setIsVerified] = useState(true);
  const [isValueUpdated, setIsValueUpdated] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [formulaValue, setFormulaValue] = useState(initFormula);
  const [cursorPos, setCursorPos] = useState(0);
  const [suggestionsMenuHeight, setSuggestionsMenuHeight] = useState(0);
  const formulaLabel = replaceStringToLabel(formulaValue, suggestions);
  const hotStrPos = formulaLabel.search(HOT_STR);
  const isSuggestionState = hotStrPos !== -1;
  const suggestionKeys = useMemo(() => suggestions.map(item => item.key), [suggestions]);
  const keyStr = formulaLabel.substring(hotStrPos + HOT_STR.length, cursorPos);

  const formulaRef = useRef();
  const classes = useFormulaStyles({ isValue: !isSuggestionState && !!formulaValue });

  const theme = useTheme();
  const { formulaFunction, error } = useFormulaFunction(formulaValue, suggestionKeys);

  useOutsideClick(formulaRef, () => {
    setIsHighlight(false);
  });

  const handleAddSuggestion = value => {
    const suggestion = suggestions.find(item => item.key === value);
    setIsValueUpdated(true);
    setIsHighlight(true);
    setFormulaValue(prev => prev.replace(`${HOT_STR}${keyStr}`, value ? `[${value}]` : ''));
    setCursorPos(hotStrPos + (suggestion?.label?.length || 0));
  };

  const handleCloseSuggestionState = () => handleAddSuggestion('');

  const handleChangeEditorValue = useCallback(
    (newValue, newCursorPos) => {
      if (cursorPos !== newCursorPos) {
        setCursorPos(newCursorPos);
      }
      if (newValue !== formulaValue) {
        setFormulaValue(newValue);
        setIsVerified(false);
      }
    },
    [formulaValue, cursorPos]
  );

  const handleClickValue = () => {
    setIsHighlight(true);
  };

  const handleClear = () => {
    if (isSuggestionState) return;
    setIsVerified(false);
    setFormulaValue('');
    setCursorPos(0);
    setIsValueUpdated(true);
  };

  const handleVerify = () => {
    setIsVerified(true);
    const variables = suggestions
      .map(suggestion => suggestion.key)
      .filter(item => formulaValue && formulaValue.includes(item));
    onSave({ formula: formulaValue, variables, formulaFunc: formulaFunction });
  };

  useEffect(() => {
    setFormulaValue(initFormula);
  }, [initFormula]);

  return (
    <div className={classes.formulaContainer}>
      <div className={classes.formulaHeaderWrapper}>
        <div className={classes.formulaHeaderTextWrapper}>
          <RootXIcon color={getColor(theme, isHighlight, error)} />
          <div
            className={classes.formulaHeaderText}
            style={{ color: getColor(theme, isHighlight, error) }}
          >
            Formula Expression
          </div>
        </div>
        <div className={classes.formulaHeaderButtonWrapper} onClick={handleClear}>
          <CloseIcon className={classes.formulaCloseIcon} />
          <div className={classes.formulaHeaderText}>Clear</div>
        </div>
      </div>
      <div className={classes.formulaEditorWrapper}>
        <div ref={formulaRef} onClick={handleClickValue}>
          <FormulaTextEditor
            initFormula={formulaValue}
            cursorPos={cursorPos}
            color={getColor(theme, isHighlight, error)}
            suggestions={suggestions}
            isValueUpdated={isValueUpdated}
            setIsValueUpdated={setIsValueUpdated}
            onChange={handleChangeEditorValue}
            onCloseSuggestionState={handleCloseSuggestionState}
          />
        </div>
        {isSuggestionState && <CloseSuggestion onClose={handleCloseSuggestionState} />}
      </div>
      {isSuggestionState && (
        <SuggestionsMenu
          suggestions={suggestions}
          keyStr={keyStr}
          onAddSuggestion={handleAddSuggestion}
          onChangeHeight={setSuggestionsMenuHeight}
        />
      )}
      <div
        className={classes.formulaFooterWrapper}
        style={{ marginTop: isSuggestionState ? -suggestionsMenuHeight : 0 }}
      >
        <InfoOutlinedIcon className={classes.formulaFooterIcon} />
        <div className={classes.formulaFooterTextWrapper}>
          <div className={classes.formulaFooterText}>
            Type <span className={classes.funcText}>/f</span> to do add live channels to your
            equation. Use your keybord for numbers and{' '}
            <Tooltip
              title={
                <div className={classes.tooltipWrapper}>
                  {mathSymbols.map(item => (
                    <div key={item.value} className={classes.tooltipLine}>
                      <span className={classes.tooltipValue}>{item.value}</span>
                      <div key={item.value} className={classes.tooltipLabelContainer}>
                        {!!item.isShift && <span className={classes.tooltipSymbol}>&#8679;</span>}
                        <span>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
              placement="bottom"
            >
              <span className={classes.successColor}>math symbols</span>
            </Tooltip>
          </div>
        </div>
      </div>
      <Button
        className={classes.verifyButton}
        variant="contained"
        color="primary"
        onClick={handleVerify}
        disabled={isVerified || !formulaFunction}
      >
        Verify
      </Button>
      {!!formulaValue && (
        <span
          className={classnames(classes.resultText, {
            [classes.errorColor]: !!error,
            [classes.resultSuccessColor]: !error,
          })}
        >
          {error ? 'The formula is not valid' : 'The formula is valid'}
        </span>
      )}
    </div>
  );
};

FormulaComponent.defaultProps = {
  suggestions: [
    { key: 'rop', label: 'ROP', unit: 'ft/h', type: 'Sensor Trace(WITSML)' },
    { key: 'rpm', label: 'RPM', type: 'Sensor Trace(WITSML)' },
    { key: 'rict', label: 'Rict', type: 'Sensor Trace(WITSML)' },
    { key: 'rotaryTorque', label: 'Rotary Torque', unit: 'ft-klbf', type: 'Corva Trace' },
    { key: 'rspd', label: 'Rspd', unit: 'ft', type: 'Corva Trace' },
    { key: 'spm', label: 'SPM', unit: 'ft', type: 'Corva Trace' },
    { key: 'standpipePressure', label: 'Standpipe Pressure', unit: 'psi', type: 'Roadmap Trace' },
    { key: 'state', label: 'State', type: 'Roadmap Trace' },
    { key: 'tda', label: 'Tda', unit: 'ft', type: 'Roadmap Trace' },
    { key: 'time', label: 'Time', unit: 'h', type: 'Trace App' },
    { key: 'wob', label: 'Weight on Bit', unit: 'klbf', type: 'Trace App' },
    { key: 'tvd', label: 'True Vertical Depth', unit: 'ft', type: 'Dev Center Collection' },
    { key: 'spd', label: 'SPD', unit: 'ft', type: 'Dev Center Collection' },
  ],
  initFormula: '2*[rop] + sin([rotaryTorque] + PI)',
  onSave: noop,
};

export default FormulaComponent;
