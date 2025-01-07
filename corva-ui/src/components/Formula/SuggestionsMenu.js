import { useMemo, useRef, useEffect } from 'react';
import { uniq } from 'lodash';
import { MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  content: {
    width: '342px',
    maxHeight: '166px',
    borderRadius: '4px',
    marginLeft: '50px',
    marginTop: '-16px',
    overflowY: 'auto',
    background: theme.palette.background.b9,
    boxShadow:
      '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-corner': {
      background: 'rgba(0, 0, 0, 0)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(164, 164, 167, 0.7)',
      borderRadius: '10px',
      border: '5px solid rgba(0, 0, 0, 0.01)',
      backgroundClip: 'padding-box',
    },
    zIndex: 999,
  },
  label: {
    background: theme.palette.background.b9,
  },
  labelWrapper: {
    height: '24px',
    padding: '0 4px',
    background: theme.palette.background.b9,
  },
  itemWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  unit: {
    color: theme.palette.primary.text7,
    marginLeft: '4px',
  },
}));

export default function SuggestionsMenu({ suggestions, keyStr, onAddSuggestion, onChangeHeight }) {
  const classes = useStyles();
  const menusRef = useRef();

  const optionsData = useMemo(() => {
    const filteredSuggestions = suggestions.filter(item =>
      item.label.toUpperCase().includes(keyStr.toUpperCase())
    );
    const filteredTypes = uniq(filteredSuggestions.map(item => item.type));
    const data = filteredTypes.reduce((result, type) => {
      const subSuggestions = filteredSuggestions.filter(item => item.type === type);
      return result
        .concat([{ value: type, label: type, isSubHeader: true }])
        .concat(subSuggestions.map(suggestion => ({ ...suggestion, value: suggestion.key })));
    }, []);
    return data.length ? data : [{ value: 'noOptions', label: 'No Options', isSubHeader: true }];
  }, [suggestions, keyStr]);

  useEffect(() => {
    if (menusRef.current) onChangeHeight(menusRef.current.clientHeight);
  }, [suggestions, keyStr, menusRef.current]);

  const renderOptionLabel = option => {
    const { label, isSubHeader, unit } = option;
    if (isSubHeader)
      return (
        <div className={classes.labelWrapper}>
          <span>{label}</span>
        </div>
      );

    return (
      <div className={classes.itemWrapper}>
        <span>{label}</span>
        {!!unit && <span className={classes.unit}>{unit}</span>}
      </div>
    );
  };

  return (
    <div className={classes.content} ref={menusRef}>
      {optionsData.map(option => (
        <MenuItem
          key={option.value}
          selected={false}
          disabled={option.isSubHeader}
          onClick={() => onAddSuggestion(option.value)}
        >
          {renderOptionLabel(option)}
        </MenuItem>
      ))}
    </div>
  );
}
